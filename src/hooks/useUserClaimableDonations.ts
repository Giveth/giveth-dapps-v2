import { useAccount } from 'wagmi';
import { gqlRequest } from '@/helpers/requests';
import config from '@/configuration';
import { FETCH_USER_STREAMS_BY_ADDRESS } from '@/apollo/gql/gqlUser';

export const useUserClaimableDonations = () => {
	const { address } = useAccount();

	if (address) {
		gqlRequest(
			config.OPTIMISM_CONFIG.superFluidSubgraph,
			undefined,
			FETCH_USER_STREAMS_BY_ADDRESS,
			{ address: address.toLowerCase() },
		).then(({ data }) => {
			console.log('Dataaa', data);
		});
	}
	return {};
};
