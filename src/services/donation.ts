// import transakSDK from '@transak/transak-sdk'
import { captureException } from '@sentry/nextjs';
import { Address } from 'viem';
import {
	CREATE_DONATION,
	UPDATE_DONATION_STATUS,
} from '@/apollo/gql/gqlDonations';
import { client } from '@/apollo/apolloClient';
import { ICreateDonation } from '@/components/views/donate/common/helpers';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { FETCH_USER_STREAMS } from '@/apollo/gql/gqlUser';
import { ITokenStreams } from '@/context/donate.context';
import { gqlRequest } from '@/helpers/requests';
import { ISuperfluidStream, IToken } from '@/types/superFluid';
import config, { SENTRY_URGENT } from '@/configuration';
import {
	CREATE_DRAFT_RECURRING_DONATION,
	CREATE_RECURRING_DONATION,
	UPDATE_RECURRING_DONATION,
	UPDATE_RECURRING_DONATION_BY_ID,
	UPDATE_RECURRING_DONATION_STATUS,
} from '@/apollo/gql/gqlSuperfluid';
import { ERecurringDonationStatus } from '@/apollo/types/types';

const SAVE_DONATION_ITERATIONS = 5;

export interface IOnTxHash extends ICreateDonation {
	txHash?: string | null;
	nonce?: number | null;
	chainId: number;
	safeTransactionId?: string | null;
}

export const updateDonation = (donationId: number, status: EDonationStatus) => {
	if (!donationId || donationId === 0) return;
	client
		.mutate({
			mutation: UPDATE_DONATION_STATUS,
			variables: { donationId, status },
		})
		.catch((err: unknown) =>
			captureException(err, {
				tags: {
					section: 'updateDonation',
				},
			}),
		);
};

let saveDonationIteration = 0;
export async function saveDonation(props: IOnTxHash) {
	try {
		return await createDonation(props);
	} catch (error) {
		saveDonationIteration++;
		if (saveDonationIteration >= SAVE_DONATION_ITERATIONS) {
			saveDonationIteration = 0;
			throw error;
		} else return saveDonation(props);
	}
}

const createDonation = async (props: IOnTxHash) => {
	const {
		chainId,
		txHash,
		amount,
		token,
		projectId,
		anonymous,
		nonce,
		chainvineReferred,
		safeTransactionId,
		draftDonationId,
		useDonationBox,
		relevantDonationTxHash,
	} = props;
	const { address, symbol } = token;
	let donationId = 0;

	try {
		const { data } = await client.mutate({
			mutation: CREATE_DONATION,
			variables: {
				transactionId: txHash,
				transactionNetworkId: chainId,
				nonce,
				amount,
				token: symbol,
				projectId,
				tokenAddress: address,
				anonymous,
				referrerId: chainvineReferred,
				safeTransactionId,
				draftDonationId,
				useDonationBox,
				relevantDonationTxHash,
			},
		});
		donationId = data.createDonation;
	} catch (error) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.error('createDonation error: ', error);
		throw error;
	}

	return donationId;
};

export const fetchUserStreams = async (address: Address) => {
	const { data } = await gqlRequest(
		config.OPTIMISM_CONFIG.superFluidSubgraph,
		undefined,
		FETCH_USER_STREAMS,
		{ address: address.toLowerCase() },
	);
	const streams: ISuperfluidStream[] = data?.streams;

	//categorize streams by token
	const _tokenStreams: ITokenStreams = {};
	streams.forEach(stream => {
		if (!_tokenStreams[stream.token.id]) {
			_tokenStreams[stream.token.id] = [];
		}
		_tokenStreams[stream.token.id].push(stream);
	});
	return _tokenStreams;
};

interface ICreateRecurringDonationBase {
	projectId: number;
	chainId: number;
	superToken: IToken;
	flowRate: bigint;
	anonymous?: boolean;
	isBatch?: boolean;
}

export interface ICreateDraftRecurringDonation
	extends ICreateRecurringDonationBase {
	isForUpdate?: boolean;
	recurringDonationId?: string;
}

export const createDraftRecurringDonation = async ({
	chainId,
	projectId,
	flowRate,
	superToken,
	anonymous,
	isBatch,
	isForUpdate,
}: ICreateDraftRecurringDonation) => {
	let draftDonationId = 0;
	try {
		const { data } = await client.mutate({
			mutation: CREATE_DRAFT_RECURRING_DONATION,
			variables: {
				projectId,
				networkId: chainId,
				flowRate: flowRate.toString(),
				currency: superToken.underlyingToken?.symbol || 'ETH',
				anonymous,
				isBatch,
				isForUpdate,
			},
		});
		draftDonationId = parseInt(data.createDraftRecurringDonation);
		console.log('draftDonationId', draftDonationId);
		return draftDonationId;
	} catch (error) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.error('createDraftRecurringDonation error: ', error);
		throw error;
	}
};

export interface ICreateRecurringDonation extends ICreateRecurringDonationBase {
	draftDonationId: number;
	txHash: string;
}

export const createRecurringDonation = async ({
	chainId,
	txHash,
	projectId,
	flowRate,
	superToken,
	anonymous,
	isBatch,
}: ICreateRecurringDonation) => {
	let donationId = 0;
	try {
		const { data } = await client.mutate({
			mutation: CREATE_RECURRING_DONATION,
			variables: {
				projectId,
				networkId: chainId,
				txHash,
				flowRate: flowRate.toString(),
				currency: superToken.underlyingToken?.symbol || 'ETH',
				anonymous,
				isBatch,
			},
		});
		donationId = parseInt(data.createRecurringDonation.id);
		console.log('donationId', donationId);
		return donationId;
	} catch (error) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.error('createRecurringDonation error: ', error);
		throw error;
	}
};

export interface IUpdateRecurringDonation extends ICreateRecurringDonation {
	recurringDonationId?: string;
}

export const updateRecurringDonation = async (
	props: IUpdateRecurringDonation,
) => {
	let donationId = 0;
	const {
		recurringDonationId,
		chainId,
		txHash,
		projectId,
		flowRate,
		superToken,
		anonymous,
	} = props;
	try {
		const _recurringDonationId = recurringDonationId
			? parseInt(recurringDonationId)
			: undefined;
		const { data } = await client.mutate({
			mutation: recurringDonationId
				? UPDATE_RECURRING_DONATION_BY_ID
				: UPDATE_RECURRING_DONATION,
			variables: {
				recurringDonationId: _recurringDonationId,
				projectId,
				networkId: chainId,
				txHash,
				flowRate: flowRate.toString(),
				currency: superToken.underlyingToken?.symbol || 'ETH',
				anonymous,
			},
		});
		const id = recurringDonationId
			? data.updateRecurringDonationParamsById.id
			: data.updateRecurringDonationParams.id;
		donationId = parseInt(id);
		console.log('donationId', donationId);
		return donationId;
	} catch (error: any) {
		//handle the case where the recurring donation does not exist on db but it exists on the chain
		if (error?.message.toLowerCase() === 'recurring donation not found.') {
			return createRecurringDonation(props);
		}
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.error('updateRecurringDonation error: ', error);
		throw error;
	}
};

export interface IEndRecurringDonation {
	recurringDonationId: number;
	projectId: number;
	chainId: number;
	txHash: string;
	superToken: IToken;
}

export const endRecurringDonation = async ({
	chainId,
	txHash,
	projectId,
	superToken,
	recurringDonationId,
}: IEndRecurringDonation) => {
	let donationUpdateId = 0;
	try {
		const { data } = await client.mutate({
			mutation: UPDATE_RECURRING_DONATION_BY_ID,
			variables: {
				recurringDonationId,
				projectId,
				networkId: chainId,
				txHash,
				currency: superToken.underlyingToken?.symbol || 'ETH',
				status: ERecurringDonationStatus.ENDED,
			},
		});
		donationUpdateId = parseInt(data.updateRecurringDonationParamsById.id);
		return donationUpdateId;
	} catch (error: any) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.error('endRecurringDonation error: ', error);
		throw error;
	}
};

export const updateRecurringDonationStatus = async (
	donationId: number,
	status: ERecurringDonationStatus,
) => {
	try {
		const { data } = await client.mutate({
			mutation: UPDATE_RECURRING_DONATION_STATUS,
			variables: {
				donationId,
				status,
			},
		});
		return parseInt(data.updateRecurringDonationStatus.id);
	} catch (error: any) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.error('updateRecurringDonationStatus error: ', error);
		throw error;
	}
};

// This is the function you will call to check if a wallet address is sanctioned.
export async function isWalletSanctioned(
	walletAddress: string,
): Promise<boolean> {
	try {
		const baseURL = 'https://api.trmlabs.com/public/';
		const url = `${baseURL}v1/sanctions/screening`;

		// Define the address you want to screen
		const request = [{ address: walletAddress }];

		// Make the POST request using fetch
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		});

		// Parse the JSON response
		const data = await response.json();

		/** Sample response
		 * [
		 *   {
		 *     address: '0xbF7BE1D1aa31E456f09FE9316e07Ac9F15B87De8',
		 *     isSanctioned: false
		 *   },
		 *   {
		 *     address: '0x2E100055A4F7100FF9898BAa3409085150355b4f',
		 *     isSanctioned: false
		 *   },
		 *	 ...
		 * ]
		 */

		// Check the response and determine if the address is sanctioned
		const result = data && data[0];
		return Boolean(result && result.isSanctioned) || true;
	} catch (error) {
		console.error('Error checking wallet sanction status:', error);
		return false;
	}
}
