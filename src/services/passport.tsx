import { client } from '@/apollo/apolloClient';
import { REFRESH_USER_SCORES } from '@/apollo/gql/gqlPassport';
import config from '@/configuration';
import { getPassports } from '@/helpers/passport';
import { getRequest, postRequest } from '@/helpers/requests';
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
	} catch (error) {
		//remove user's info from local storage
		const passports = getPassports();
		delete passports[account!];
		localStorage.setItem(StorageLabel.PASSPORT, JSON.stringify(passports));
	}
};

export const connectPassport = async (account: string, library: any) => {
	//Get Nonce and Message
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

	passports[account] = {
		jwt,
		expiration,
		publicAddress,
	};

	localStorage.setItem(StorageLabel.PASSPORT, JSON.stringify(passports));

	fetchPassportScore(account);
};
