// import transakSDK from '@transak/transak-sdk'
import { captureException } from '@sentry/nextjs';
import { Address, formatUnits } from 'viem';
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
import { CREATE_RECURRING_DONATION } from '@/apollo/gql/gqlSuperfluid';

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
	amount: bigint;
	anonymous?: boolean;
}

export const createRecurringDonation = async ({
	chainId,
	txHash,
	projectId,
	amount,
	superToken,
	anonymous,
}: ICreateRecurringDonation) => {
	let donationId = 0;
	const _amount = parseInt(formatUnits(amount, superToken.decimals));
	console.log('_amount', _amount);
	try {
		const { data } = await client.mutate({
			mutation: CREATE_RECURRING_DONATION,
			variables: {
				projectId,
				networkId: chainId,
				txHash,
				amount: _amount,
				currency: superToken.symbol,
				interval: 'month',
				anonymous,
			},
		});
		donationId = data.createDonation;
		console.log('donationId', donationId);
	} catch (error) {
		captureException(error, {
			tags: {
				section: SENTRY_URGENT,
			},
		});
		console.log('createRecurringDonation error: ', error);
		throw error;
	}

	return donationId;
};
