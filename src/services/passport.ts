import { signMessage } from '@wagmi/core';
import { client } from '@/apollo/apolloClient';
import {
	REFRESH_USER_SCORES,
	SCORE_ACTIVE_QF_DONOR_ADDRESS,
} from '@/apollo/gql/gqlPassport';
import config from '@/configuration';
import { getPassports } from '@/helpers/passport';
import { getRequest, postRequest } from '@/helpers/requests';
import { showToastError } from '@/lib/helpers';
import StorageLabel from '@/lib/localStorage';
import { wagmiConfig } from '@/wagmiConfigs';

export const fetchPassportScore = async (account: string) => {
	try {
		const { data } = await client.query({
			query: REFRESH_USER_SCORES,
			variables: {
				address: account?.toLowerCase(),
			},
			// TODO - Change this to back to network-only once a test case is done by QA
			fetchPolicy: 'cache-and-network',
		});
		return data;
	} catch (error) {
		console.error('error', error);
		//remove user's info from local storage
		const passports = getPassports();
		delete passports[account.toLowerCase()];
		localStorage.setItem(StorageLabel.PASSPORT, JSON.stringify(passports));
	}
};

export const connectPassport = async (account: string, singin: boolean) => {
	//Get Nonce and Message
	try {
		const { nonce, message } = await getRequest(
			`${config.MICROSERVICES.authentication}/passportNonce`,
			true,
			{},
		);

		//sign message
		const signature = await signMessage(wagmiConfig, { message });

		//auth
		const { expiration, jwt, publicAddress } = await postRequest(
			`${config.MICROSERVICES.authentication}/passportAuthentication`,
			true,
			{ message, signature, nonce },
		);

		//save the res to local storage
		const passports = getPassports();

		passports[account.toLowerCase()] = {
			jwt,
			expiration,
			publicAddress,
		};

		localStorage.setItem(StorageLabel.PASSPORT, JSON.stringify(passports));

		if (singin) {
			//use passport jwt to sign in to the giveth and create user
			localStorage.setItem(StorageLabel.USER, account.toLowerCase());
			localStorage.setItem(StorageLabel.TOKEN, jwt);
		}
		return true;
	} catch (error: any) {
		console.error('error', error);
		if (error.code === 'ACTION_REJECTED') {
			showToastError('Rejected By User');
		} else {
			showToastError(error);
		}
		return false;
	}
};

// get user's address score using the model-based detection endpoint
export const scoreUserAddress = async (address: `0x${string}` | undefined) => {
	try {
		const { data } = await client.query({
			query: SCORE_ACTIVE_QF_DONOR_ADDRESS,
			variables: {
				address: address?.toLowerCase(),
			},
		});

		return data.scoreUserAddress;
	} catch (error) {
		console.error('Failed to fetch user address score:', error);
		return null;
	}
};
