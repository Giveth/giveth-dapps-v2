import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { isAddress } from 'ethers/lib/utils';
import { fetchSubgraph } from '@/services/subgraph.service';
import config from '@/configuration';
import {
	IBalances,
	ITokenDistroInfo,
	IUnipool,
	IUniswapV2Pair,
	IUniswapV3Pool,
	IUniswapV3Position,
	ZeroBalances,
} from '@/types/subgraph';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { StakingType } from '@/types/config';
import { useWeb3React } from '@web3-react/core';

export interface ISubgraphValue {
	balances: IBalances;
	tokenDistroInfo?: ITokenDistroInfo;
	uniswapV3Pool?: IUniswapV3Pool;
	[StakingType.GIV_LM]?: IUnipool;
	[StakingType.BALANCER]?: IUnipool;
	[StakingType.SUSHISWAP]?: IUnipool;
	[StakingType.HONEYSWAP]?: IUnipool;
	[StakingType.UNISWAP]?: IUnipool;
	userNotStakedPositions: IUniswapV3Position[];
	userStakedPositions: IUniswapV3Position[];
	allPositions: IUniswapV3Position[];
	uniswapV2EthGivPair?: IUniswapV2Pair;
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

export const SubgraphProvider: FC = ({ children }) => {
	const { account, chainId } = useWeb3React();

	const [currentSubgraphValue, setCurrentSubgraphValue] =
		useState<ISubgraphValue>(defaultSubgraphValue);

	const [mainnetSubgraphValue, setMainnetSubgraphValue] =
		useState<ISubgraphValue>(defaultSubgraphValue);
	const [xDaiSubgraphValue, setXDaiSubgraphValue] =
		useState<ISubgraphValue>(defaultSubgraphValue);

	const fetchMainnetInfo = useCallback(async userAddress => {
		try {
			const response = await fetchSubgraph(
				SubgraphQueryBuilder.getMainnetQuery(userAddress),
				config.MAINNET_NETWORK_NUMBER,
			);
			setMainnetSubgraphValue(await transformSubgraphData(response));
		} catch (e) {
			console.error('Error on query mainnet subgraph:', e);
		}
	}, []);

	const fetchXDaiInfo = useCallback(async userAddress => {
		try {
			const response = await fetchSubgraph(
				SubgraphQueryBuilder.getXDaiQuery(userAddress),
				config.XDAI_NETWORK_NUMBER,
			);
			setXDaiSubgraphValue(await transformSubgraphData(response));
		} catch (e) {
			console.error('Error on query xDai subgraph:', e);
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
		if (account && isAddress(account)) {
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
		}
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
