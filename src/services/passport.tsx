import { client } from '@/apollo/apolloClient';
import { REFRESH_USER_SCORES } from '@/apollo/gql/gqlPassport';
import config from '@/configuration';
import { getPassports } from '@/helpers/passport';
import { getRequest, postRequest } from '@/helpers/requests';
import { showToastError } from '@/lib/helpers';
import StorageLabel from '@/lib/localStorage';

export const fetchPassportScore = async (account: string) => {
	try {
		const { data } = await client.query({
			query: REFRESH_USER_SCORES,
			variables: {
				address: account?.toLowerCase(),
			},
			fetchPolicy: 'no-cache',
		});
		return data;
	} catch (error) {
		console.log('error', error);
		//remove user's info from local storage
		const passports = getPassports();
		delete passports[account.toLowerCase()];
		localStorage.setItem(StorageLabel.PASSPORT, JSON.stringify(passports));
	}
};

export const connectPassport = async (
	account: string,
	library: any,
	singin: boolean,
) => {
	//Get Nonce and Message
	try {
		const { nonce, message } = await getRequest(
			`${config.MICROSERVICES.authentication}/passportNonce`,
			true,
			{},
		);
		const signer = library.getSigner();

		//sign message
		const signature = await signer.signMessage(message);

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
			console.log('Use Passport token to sign in to the giveth');
			localStorage.setItem(StorageLabel.USER, account.toLowerCase());
			localStorage.setItem(StorageLabel.TOKEN, jwt);
		}
		return true;
	} catch (error) {
		console.log('error', error);
		showToastError(error);
		return false;
	}
};
