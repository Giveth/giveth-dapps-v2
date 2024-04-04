// import transakSDK from '@transak/transak-sdk'
import { captureException } from '@sentry/nextjs';
import { Address } from 'viem';
import {
	CREATE_DONATION,
	UPDATE_DONATION_STATUS,
} from '@/apollo/gql/gqlDonations';
import { client } from '@/apollo/apolloClient';
import { ICreateDonation } from '@/components/views/donate/helpers';
import { EDonationStatus } from '@/apollo/types/gqlEnums';
import { FETCH_USER_STREAMS } from '@/apollo/gql/gqlUser';
import { ITokenStreams } from '@/context/donate.context';
import { gqlRequest } from '@/helpers/requests';
import { ISuperfluidStream, IToken } from '@/types/superFluid';
import config, { SENTRY_URGENT } from '@/configuration';
import {
	CREATE_RECURRING_DONATION,
	UPDATE_RECURRING_DONATION,
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
			},
		});
		donationId = data.createDonation;
	} catch (error) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.log('createDonation error: ', error);
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

export interface ICreateRecurringDonation {
	projectId: number;
	chainId: number;
	txHash: string;
	superToken: IToken;
	flowRate: bigint;
	anonymous?: boolean;
	isBatch?: boolean;
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
		donationId = data.createRecurringDonation.id;
		console.log('donationId', donationId);
		return donationId;
	} catch (error) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.log('createRecurringDonation error: ', error);
		throw error;
	}
};

export const updateRecurringDonation = async (
	props: ICreateRecurringDonation,
) => {
	let donationId = 0;
	const { chainId, txHash, projectId, flowRate, superToken, anonymous } =
		props;
	try {
		const { data } = await client.mutate({
			mutation: UPDATE_RECURRING_DONATION,
			variables: {
				projectId,
				networkId: chainId,
				txHash,
				flowRate: flowRate.toString(),
				currency: superToken.underlyingToken?.symbol || 'ETH',
				anonymous,
			},
		});
		donationId = data.updateRecurringDonationParams.id;
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
		console.log('updateRecurringDonation error: ', error);
		throw error;
	}
};

export interface IEndRecurringDonation {
	projectId: number;
	chainId: number;
	txHash: string;
	superToken: IToken;
}

export const endRecurringDonation = async (props: IEndRecurringDonation) => {
	let donationId = 0;
	const { chainId, txHash, projectId, superToken } = props;
	try {
		const { data } = await client.mutate({
			mutation: UPDATE_RECURRING_DONATION,
			variables: {
				projectId,
				networkId: chainId,
				txHash,
				currency: superToken.underlyingToken?.symbol || 'ETH',
				status: ERecurringDonationStatus.ENDED,
			},
		});
		donationId = data.updateRecurringDonationParams.id;
		return donationId;
	} catch (error: any) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.log('endRecurringDonation error: ', error);
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
		return data.updateRecurringDonationStatus.id;
	} catch (error: any) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.log('updateRecurringDonationStatus error: ', error);
		throw error;
	}
};
