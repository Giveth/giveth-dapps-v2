import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import config from '@/configuration';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { Zero, AddressZero } from '@ethersproject/constants';
import { useSubgraph } from '@/context/subgraph.context';
import { useWeb3React } from '@web3-react/core';
import { StreamType } from '@/types/config';

export interface IRegenTokenDistroHelpers {
	[key: string]: TokenDistroHelper;
}
export interface ITokenDistroContext {
	givTokenDistroHelper: TokenDistroHelper;
	regenTokenDistroHelpers: IRegenTokenDistroHelpers;
	getTokenDistroHelper: (
		streamType: StreamType | undefined,
	) => TokenDistroHelper;
}

const defaultTokenDistroHelper = new TokenDistroHelper({
	contractAddress: AddressZero,
	initialAmount: Zero,
	lockedAmount: Zero,
	totalTokens: Zero,
	startTime: new Date(),
	cliffTime: new Date(),
	endTime: new Date(),
});

export const BalanceContext = createContext<ITokenDistroContext>({
	givTokenDistroHelper: defaultTokenDistroHelper,
	regenTokenDistroHelpers: {},
	getTokenDistroHelper: () => defaultTokenDistroHelper,
});

export const TokenDistroProvider: FC = ({ children }) => {
	const { chainId } = useWeb3React();

	const { mainnetValues, xDaiValues } = useSubgraph();

	const [currentGivTokenDistroInfo, setCurrentGivTokenDistroInfo] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [mainnetGivTokenDistro, setMainnetGivTokenDistro] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [xDaiGivTokenDistro, setXDaiGivTokenDistro] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);

	const [currentRegenTokenDistroHelpers, setCurrentRegenTokenDistroHelpers] =
		useState<IRegenTokenDistroHelpers>({});
	const [mainnetRegenTokenHelpers, setMainnetRegenTokenHelpers] =
		useState<IRegenTokenDistroHelpers>({});
	const [xDaiRegenTokenDistroHelpers, setXDaiRegenTokenDistroHelpers] =
		useState<IRegenTokenDistroHelpers>({});

	useEffect(() => {
		if (mainnetValues?.tokenDistroInfo)
			setMainnetGivTokenDistro(
				new TokenDistroHelper(mainnetValues.tokenDistroInfo),
			);
		let newRegenTokenDistroHelpers: IRegenTokenDistroHelpers = {};
		config.MAINNET_CONFIG.regenStreams.forEach(({ type }) => {
			const tokenDistroInfo = mainnetValues[type];
			newRegenTokenDistroHelpers[type] = tokenDistroInfo
				? new TokenDistroHelper(tokenDistroInfo, type)
				: defaultTokenDistroHelper;
		});
		setMainnetRegenTokenHelpers(newRegenTokenDistroHelpers);
	}, [mainnetValues]);

	useEffect(() => {
		if (xDaiValues.tokenDistroInfo)
			setXDaiGivTokenDistro(
				new TokenDistroHelper(xDaiValues.tokenDistroInfo),
			);
		let newRegenTokenDistroHelpers: IRegenTokenDistroHelpers = {};
		config.XDAI_CONFIG.regenStreams.forEach(({ type }) => {
			const tokenDistroInfo = xDaiValues[type];
			if (tokenDistroInfo) {
				newRegenTokenDistroHelpers[type] = new TokenDistroHelper(
					tokenDistroInfo,
					type,
				);
			}
		});
		setXDaiRegenTokenDistroHelpers(newRegenTokenDistroHelpers);
	}, [xDaiValues]);

	useEffect(() => {
		switch (chainId) {
			case config.XDAI_NETWORK_NUMBER:
				setCurrentGivTokenDistroInfo(xDaiGivTokenDistro);
				setCurrentRegenTokenDistroHelpers(xDaiRegenTokenDistroHelpers);
				break;

			case config.MAINNET_NETWORK_NUMBER:
			default:
				setCurrentGivTokenDistroInfo(mainnetGivTokenDistro);
				setCurrentRegenTokenDistroHelpers(mainnetRegenTokenHelpers);
		}
	}, [
		mainnetGivTokenDistro,
		xDaiGivTokenDistro,
		chainId,
		xDaiRegenTokenDistroHelpers,
		mainnetRegenTokenHelpers,
	]);

	const getTokenDistroHelper = useCallback(
		(streamType: StreamType | undefined) => {
			if (!streamType) return currentGivTokenDistroInfo;
			return currentRegenTokenDistroHelpers[streamType];
		},
		[currentGivTokenDistroInfo, currentRegenTokenDistroHelpers],
	);

	return (
		<BalanceContext.Provider
			value={{
				givTokenDistroHelper: currentGivTokenDistroInfo,
				regenTokenDistroHelpers: currentRegenTokenDistroHelpers,
				getTokenDistroHelper,
			}}
		>
			{children}
		</BalanceContext.Provider>
	);
};

export function useTokenDistro() {
	const context = useContext(BalanceContext);

	if (!context) {
		throw new Error('Token balance context not found!');
	}

	return context;
}
