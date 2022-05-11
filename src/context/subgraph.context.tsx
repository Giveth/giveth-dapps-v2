import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { captureException } from '@sentry/nextjs';
import { fetchSubgraph } from '@/services/subgraph.service';
import config from '@/configuration';
import {
	IBalances,
	IInfinitePositionReward,
	ITokenDistroInfo,
	IUnipool,
	IUniswapV2Pair,
	IUniswapV3Pool,
	IUniswapV3Position,
	ZeroBalances,
} from '@/types/subgraph';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { RegenFarmType, StakingType, StreamType } from '@/types/config';

export interface ISubgraphValue {
	balances: IBalances;
	tokenDistroInfo?: ITokenDistroInfo;
	uniswapV3Pool?: IUniswapV3Pool;
	[StakingType.GIV_LM]?: IUnipool;
	[StakingType.BALANCER]?: IUnipool;
	[StakingType.SUSHISWAP]?: IUnipool;
	[StakingType.HONEYSWAP]?: IUnipool;
	[StakingType.UNISWAPV2]?: IUnipool;
	[StakingType.UNISWAPV3]?: IUnipool;
	userNotStakedPositions: IUniswapV3Position[];
	userStakedPositions: IUniswapV3Position[];
	allPositions: IUniswapV3Position[];
	uniswapV2EthGivPair?: IUniswapV2Pair;
	infinitePositionReward?: IInfinitePositionReward;
	infinitePosition?: IUniswapV3Position;
	[StreamType.FOX]?: ITokenDistroInfo;
	[RegenFarmType.FOX_HNY]?: IUnipool;
	[StreamType.CULT]?: ITokenDistroInfo;
	[RegenFarmType.CULT_ETH]?: IUnipool;
}

export interface ISubgraphContext {
	currentValues: ISubgraphValue;
	mainnetValues: ISubgraphValue;
	xDaiValues: ISubgraphValue;
}
const defaultSubgraphValue: ISubgraphValue = {
	balances: ZeroBalances,
	userNotStakedPositions: [],
	userStakedPositions: [],
	allPositions: [],
};

export const SubgraphContext = createContext<ISubgraphContext>({
	currentValues: defaultSubgraphValue,
	mainnetValues: defaultSubgraphValue,
	xDaiValues: defaultSubgraphValue,
});

SubgraphContext.displayName = 'SubgraphContext';

export const SubgraphProvider: FC = ({ children }) => {
	const { account, chainId } = useWeb3React();

	const [currentSubgraphValue, setCurrentSubgraphValue] =
		useState<ISubgraphValue>(defaultSubgraphValue);

	const [mainnetSubgraphValue, setMainnetSubgraphValue] =
		useState<ISubgraphValue>(defaultSubgraphValue);
	const [xDaiSubgraphValue, setXDaiSubgraphValue] =
		useState<ISubgraphValue>(defaultSubgraphValue);

	const fetchMainnetInfo = useCallback(async (userAddress = '') => {
		try {
			const response = await fetchSubgraph(
				SubgraphQueryBuilder.getMainnetQuery(userAddress),
				config.MAINNET_NETWORK_NUMBER,
			);
			setMainnetSubgraphValue(transformSubgraphData(response));
		} catch (e) {
			console.error('Error on query mainnet subgraph:', e);
			captureException(e, {
				tags: {
					section: 'fetchMainnetSubgraph',
				},
			});
		}
	}, []);

	const fetchXDaiInfo = useCallback(async (userAddress = '') => {
		try {
			const response = await fetchSubgraph(
				SubgraphQueryBuilder.getXDaiQuery(userAddress),
				config.XDAI_NETWORK_NUMBER,
			);
			setXDaiSubgraphValue(transformSubgraphData(response));
		} catch (e) {
			console.error('Error on query xDai subgraph:', e);
			captureException(e, {
				tags: {
					section: 'fetchxDaiSubgraph',
				},
			});
		}
	}, []);

	useEffect(() => {
		if (chainId === config.XDAI_NETWORK_NUMBER) {
			setCurrentSubgraphValue(xDaiSubgraphValue);
		} else {
			setCurrentSubgraphValue(mainnetSubgraphValue);
		}
	}, [mainnetSubgraphValue, xDaiSubgraphValue, chainId]);

	useEffect(() => {
		fetchMainnetInfo(account);
		fetchXDaiInfo(account);
		const interval = setInterval(() => {
			if (chainId === config.XDAI_NETWORK_NUMBER) {
				fetchXDaiInfo(account);
			} else {
				fetchMainnetInfo(account);
			}
		}, config.SUBGRAPH_POLLING_INTERVAL);
		return () => {
			clearInterval(interval);
		};
	}, [account, fetchMainnetInfo, fetchXDaiInfo, chainId]);

	return (
		<SubgraphContext.Provider
			value={{
				currentValues: currentSubgraphValue,
				mainnetValues: mainnetSubgraphValue,
				xDaiValues: xDaiSubgraphValue,
			}}
		>
			{children}
		</SubgraphContext.Provider>
	);
};

export function useSubgraph() {
	const context = useContext(SubgraphContext);

	if (!context) {
		throw new Error('Token balance context not found!');
	}

	return context;
}
