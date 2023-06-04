import { client } from '@/apollo/apolloClient';
import { REFRESH_USER_SCORES } from '@/apollo/gql/gqlPassport';
import { getPassports } from '@/helpers/passport';
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
