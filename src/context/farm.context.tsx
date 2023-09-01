import {
	createContext,
	FC,
	useContext,
	useEffect,
	useState,
	useCallback,
	ReactNode,
} from 'react';
import { useWeb3React } from '@web3-react/core';

export interface FarmContext {
	chainsInfo: IChainsInfo;
	setChainInfo: (network: number, key: string, value: bigint) => void;
}

export const FarmContext = createContext<FarmContext>({
	chainsInfo: {},
	setChainInfo: (network: number, key: string, value: bigint) => {
		console.log('The setChainInfo function has not been implemented yet.');
	},
});

FarmContext.displayName = 'FarmContext';

interface IFarmProvider {
	children: ReactNode;
}

interface IInfo {
	[key: string]: bigint;
	totalInfo: bigint;
}

export interface IChainsInfo {
	[key: number]: IInfo;
}

export const FarmProvider: FC<IFarmProvider> = ({ children }) => {
	const [chainsInfo, setChainsInfo] = useState<IChainsInfo>({});
	const { account } = useWeb3React();

	const setChainInfo = useCallback(
		(network: number, key: string, value: bigint) => {
			console.log('network', network, key, value);
			const chainInfo = chainsInfo[network] || {};
			const totalInfo =
				(chainInfo.totalInfo || 0n) - (chainInfo[key] || 0n) + value;

			const newChainInfo = { ...chainInfo, [key]: value, totalInfo };
			setChainsInfo(prevInfos => ({
				...prevInfos,
				[network]: newChainInfo,
			}));
		},
		[],
	);

	useEffect(() => {
		setChainsInfo({});
	}, [account]);

	return (
		<FarmContext.Provider
			value={{
				chainsInfo,
				setChainInfo,
			}}
		>
			{children}
		</FarmContext.Provider>
	);
};

export function useFarms() {
	const context = useContext(FarmContext);

	if (!context) {
		throw new Error('Farms context not found!');
	}

	return context;
}
