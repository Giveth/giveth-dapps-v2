import BigNumber from 'bignumber.js';
import { type QueryClient } from '@tanstack/react-query';
import { Address } from 'viem';
import { getNowUnixMS } from './time';
import { IGIVpower } from '@/types/subgraph';
import { IPowerBoosting } from '@/apollo/types/types';
import { EDirection } from '@/apollo/types/gqlEnums';
import Routes from '@/lib/constants/Routes';
import { StakingType } from '@/types/config';
import config from '@/configuration';
import {
	IBoostedOrder,
	EPowerBoostingOrder,
} from '@/components/views/userProfile/boostedTab/useFetchPowerBoostingInfo';
import { Zero } from './number';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

export const getTotalGIVpower = (
	queryClient: QueryClient,
	address?: Address,
	onChain?: {
		chainId: number;
		balance: BigNumber;
	},
) => {
	if (!address) return { total: 0n, byChain: [] };
	const res: any = [];
	let sum = new BigNumber('0');
	const data = queryClient.getQueriesData({
		predicate: query =>
			query.queryKey[0] === 'subgraph' &&
			(query.queryKey[2] as string)?.toLowerCase() ===
				address.toLowerCase(),
	});
	console.log('data', data);
	for (let i = 0; i < data.length; i++) {
		const chainId = data[i][0][1];
		if (onChain && onChain.chainId === chainId) {
			sum = sum.plus(onChain.balance);
			res.push(onChain);
		} else {
			const value = data[i][1];
			const sdh = new SubgraphDataHelper(value);
			const userGIVPowerBalance = sdh.getUserGIVPowerBalance();
			console.log(userGIVPowerBalance.balance);
			sum = sum.plus(userGIVPowerBalance.balance);
			res.push({
				chainId,
				balance: userGIVPowerBalance.balance,
			});
		}
	}
	return { total: sum, byChain: res };
};

export const getGIVpowerRoundsInfo = (
	initialDate: string,
	roundDuration: number,
): {
	currentRound: number;
	nextRoundDate: string;
} => {
	if (roundDuration === 0)
		return {
			currentRound: 0,
			nextRoundDate: '0',
		};
	const currentRound = Math.floor(
		(getNowUnixMS() / 1000 - Number(initialDate)) / roundDuration,
	);
	const nextRoundDate: string = (
		(Number(initialDate) + roundDuration * (currentRound + 1)) *
		1000
	).toString();
	return { currentRound, nextRoundDate };
};

export const getUnlockDate = (givPowerInfo: IGIVpower, rounds: number) => {
	const { nextRoundDate, roundDuration } = givPowerInfo || {};
	return Number(nextRoundDate) + rounds * roundDuration * 1000;
};

export const avgAPR = (
	apr: BigNumber | null,
	gGIV?: bigint,
	unipoolBalance?: bigint,
) => {
	if (
		!apr ||
		apr.isZero() ||
		!gGIV ||
		gGIV === 0n ||
		!unipoolBalance ||
		unipoolBalance === 0n
	)
		return Zero;
	const avg = new BigNumber(unipoolBalance.toString()).div(gGIV.toString());
	return apr.multipliedBy(avg);
};

export const sortBoosts = (
	boosts: IPowerBoosting[],
	orderBy: IBoostedOrder,
) => {
	const sign = orderBy.direction === EDirection.ASC ? 1 : -1;
	if (orderBy.by === EPowerBoostingOrder.Percentage) {
		return boosts.sort((b1, b2) =>
			b1.percentage > b2.percentage ? sign : sign * -1,
		);
	} else {
		return boosts;
	}
};

export const getGIVpowerLink = (chainId?: number) => {
	const _networkConf = getGIVConfig(chainId);
	const [stakeType, chain] =
		_networkConf.GIVPOWER?.type && chainId
			? [_networkConf.GIVPOWER.type, chainId]
			: [StakingType.GIV_GARDEN_LM, config.GNOSIS_NETWORK_NUMBER];
	return `${Routes.GIVfarm}/?open=${stakeType}&chain=${chain}`;
};

export const getNetworkConfig = (defaultChianID: number, chainId?: number) => {
	const _chainId = chainId || defaultChianID;
	const _networkConf =
		config.EVM_NETWORKS_CONFIG[_chainId] ||
		config.EVM_NETWORKS_CONFIG[defaultChianID];
	return _networkConf;
};

export const getGIVConfig = (chainId?: number) => {
	return getNetworkConfig(config.GNOSIS_NETWORK_NUMBER, chainId);
};
