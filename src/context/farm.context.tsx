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
	// const [totalEarned, setTotalEarned] = useState<ITotalEarned>({});
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
			// if (network === config.MAINNET_NETWORK_NUMBER) {
			// 	setMainnetInfos(prevInfos => ({ ...prevInfos, [key]: value }));
			// } else if (network === config.GNOSIS_NETWORK_NUMBER) {
			// 	setxDaiInfos(prevInfos => ({ ...prevInfos, [key]: value }));
			// }
		},
		[],
	);

	console.log('chainsInfo', chainsInfo);

	// useEffect(() => {
	// 	let sum = ethers.constants.Zero;
	// 	for (const key in xDaiInfos) {
	// 		if (Object.prototype.hasOwnProperty.call(xDaiInfos, key)) {
	// 			const value = xDaiInfos[key];
	// 			sum = sum.add(value);
	// 		}
	// 	}
	// 	setxDaiTotalEarned(sum);
	// }, [chainsInfo]);

	useEffect(() => {
		setChainsInfo({});
		// setTotalEarned({});
	}, [account]);

	// useEffect(() => {
	// 	if (chainId === config.MAINNET_NETWORK_NUMBER) {
	// 		setxDaiInfos({});
	// 		setxDaiTotalEarned(ethers.constants.Zero);
	// 	} else if (chainId === config.GNOSIS_NETWORK_NUMBER) {
	// 		setMainnetInfos({});
	// 		setMainnetTotalEarned(ethers.constants.Zero);
	// 	}
	// }, [chainId]);

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
