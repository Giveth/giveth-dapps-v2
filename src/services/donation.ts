// import transakSDK from '@transak/transak-sdk'
import { captureException } from '@sentry/nextjs';
import {
	CREATE_DONATION,
	UPDATE_DONATION_STATUS,
} from '@/apollo/gql/gqlDonations';
import { client } from '@/apollo/apolloClient';
import { ICreateDonation } from '@/components/views/donate/helpers';
import { EDonationStatus } from '@/apollo/types/gqlEnums';

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
			},
		});
		donationId = data.createDonation;
	} catch (error) {
		captureException(error, {
			tags: {
				section: 'createDonation',
			},
		});
		console.log('createDonation error: ', error);
		throw error;
	}

	console.log('DONATION ID: ', { donationId });
	return donationId;
};
