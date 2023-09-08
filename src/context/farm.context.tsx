import {
	createContext,
	FC,
	useContext,
	useEffect,
	useState,
	useCallback,
	ReactNode,
} from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { formatWeiHelper } from '@/helpers/number';

export interface FarmContext {
	chainsInfo: IChainsInfo;
	setChainInfo: (
		network: number,
		key: string,
		value: ethers.BigNumber,
	) => void;
}

export const FarmContext = createContext<FarmContext>({
	chainsInfo: {},
	setChainInfo: (network: number, key: string, value: ethers.BigNumber) => {
		console.log('The setChainInfo function has not been implemented yet.');
	},
});

FarmContext.displayName = 'FarmContext';

interface IInfo {
	[key: string]: ethers.BigNumber;
	totalInfo: ethers.BigNumber;
}

interface IFarmProvider {
	children: ReactNode;
}

export interface IChainsInfo {
	[key: number]: IInfo;
}

export interface ITotalEarned {
	[key: string]: ethers.BigNumber;
}

export const FarmProvider: FC<IFarmProvider> = ({ children }) => {
	const [chainsInfo, setChainsInfo] = useState<IChainsInfo>({});
	const { account } = useWeb3React();

	const setChainInfo = useCallback(
		(network: number, key: string, value: ethers.BigNumber) => {
			console.log('network', network, key, value);
			const chainInfo = chainsInfo[network] || {};
			const totalInfo = (chainInfo.totalInfo || ethers.constants.Zero)
				.sub(chainInfo[key] || ethers.constants.Zero)
				.add(value);
			console.log(
				'totalInfo',
				formatWeiHelper(chainInfo.totalInfo),
				formatWeiHelper(value),
				formatWeiHelper(totalInfo),
			);
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
		throw new Error('Token balance context not found!');
	}

	return context;
}
