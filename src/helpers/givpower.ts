import BigNumber from 'bignumber.js';
import { getNowUnixMS } from './time';
import { IGIVpower } from '@/types/subgraph';
import { IPowerBoosting } from '@/apollo/types/types';
import {
	EPowerBoostingOrder,
	IBoostedOrder,
} from '@/components/views/userProfile/boostedTab/ProfileBoostedTab';
import { EDirection } from '@/apollo/types/gqlEnums';
import Routes from '@/lib/constants/Routes';
import { GIVpowerUniPoolConfig, StakingType } from '@/types/config';
import config from '@/configuration';
import { ISubgraphState } from '@/features/subgraph/subgraph.types';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

export const getTotalGIVpower = (
	values: { [key: string]: ISubgraphState },
	onChain?: {
		chainId: number;
		balance: BigNumber;
	},
) => {
	const res = [];
	let sum = new BigNumber('0');
	for (const key in values) {
		if (Object.prototype.hasOwnProperty.call(values, key)) {
			if (key === 'currentValues') continue;
			if (onChain && onChain.chainId === values[key].networkNumber) {
				sum = sum.plus(onChain.balance);
				res.push(onChain);
			} else {
				const value = values[key];
				const sdh = new SubgraphDataHelper(value);
				const userGIVPowerBalance = sdh.getUserGIVPowerBalance();
				sum = sum.plus(userGIVPowerBalance.balance);
				res.push({
					chainId: value.networkNumber,
					balance: userGIVPowerBalance.balance,
				});
			}
		}
	}
	return { total: sum.toString(), byChain: res };
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
	const { nextRoundDate, roundDuration } = givPowerInfo;
	return Number(nextRoundDate) + rounds * roundDuration * 1000;
};

export const avgAPR = (
	apr: BigNumber | null,
	gGIV?: string,
	unipoolBalance?: string,
) => {
	if (
		!apr ||
		apr.isZero() ||
		!gGIV ||
		gGIV === '0' ||
		!unipoolBalance ||
		unipoolBalance === '0'
	)
		return new BigNumber(0);
	const avg = new BigNumber(unipoolBalance).dividedBy(gGIV);
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
	const [stakeType, chain] =
		chainId && 'GIVPOWER' in config.NETWORKS_CONFIG[chainId]
			? [
					(config.NETWORKS_CONFIG[chainId] as GIVpowerUniPoolConfig)
						.GIVPOWER.type,
					chainId,
			  ]
			: [StakingType.GIV_GARDEN_LM, config.GNOSIS_NETWORK_NUMBER];
	return `${Routes.GIVfarm}/?open=${stakeType}&chain=${chain}`;
};
