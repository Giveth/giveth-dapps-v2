import BigNumber from 'bignumber.js';
import { FETCH_USERS_GIVPOWER_BY_ADDRESS } from '@/apollo/gql/gqlUser';
import { gqlRequest } from '@/helpers/requests';
import config from '@/configuration';

export const getGIVpowerBalanceByAddress = async (users: string[]) => {
	//get users balance
	const _networkConfigs = config.NETWORKS_CONFIG;
	const queries = [];
	for (const key in _networkConfigs) {
		if (Object.prototype.hasOwnProperty.call(_networkConfigs, key)) {
			const networkConfig = _networkConfigs[key];
			if (
				networkConfig.GIVPOWER?.LM_ADDRESS &&
				networkConfig.subgraphAddress
			)
				queries.push(
					gqlRequest(
						networkConfig.subgraphAddress,
						false,
						FETCH_USERS_GIVPOWER_BY_ADDRESS,
						{
							addresses: users,
							contract:
								networkConfig.GIVPOWER.LM_ADDRESS.toLowerCase(),
							length: users.length,
						},
					),
				);
		}
	}
	const res = await Promise.all(queries);

	const unipoolBalancesObj: { [key: string]: string } = {};
	for (let i = 0; i < res.length; i++) {
		const unipoolBalances = res[i].data.unipoolBalances;
		for (let i = 0; i < unipoolBalances.length; i++) {
			const unipoolBalance = unipoolBalances[i];
			let currentBalance = unipoolBalancesObj[unipoolBalance.user.id];
			unipoolBalancesObj[unipoolBalance.user.id] = !currentBalance
				? unipoolBalance.balance
				: new BigNumber(currentBalance)
						.plus(unipoolBalance.balance)
						.toString();
		}
	}

	return unipoolBalancesObj;
};
