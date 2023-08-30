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
import config from '@/configuration';

export interface FarmContext {
	totalEarned: bigint;
	setInfo: (network: number, key: string, value: bigint) => void;
}

export const FarmContext = createContext<FarmContext>({
	totalEarned: 0n,
	setInfo: (network: number, key: string, value: bigint) => {
		console.log('Not implemented!');
	},
});

FarmContext.displayName = 'FarmContext';

interface IInfos {
	[key: string]: bigint;
}

interface IFarmProvider {
	children: ReactNode;
}

export const FarmProvider: FC<IFarmProvider> = ({ children }) => {
	const [xDaiInfos, setxDaiInfos] = useState<IInfos>({});
	const [xDaiTotalEarned, setxDaiTotalEarned] = useState(0n);
	const [mainnetInfos, setMainnetInfos] = useState<IInfos>({});
	const [mainnetTotalEarned, setMainnetTotalEarned] = useState(0n);
	const { account, chainId } = useWeb3React();

	const setInfo = useCallback(
		(network: number, key: string, value: bigint) => {
			if (network === config.MAINNET_NETWORK_NUMBER) {
				setMainnetInfos(prevInfos => ({ ...prevInfos, [key]: value }));
			} else if (network === config.GNOSIS_NETWORK_NUMBER) {
				setxDaiInfos(prevInfos => ({ ...prevInfos, [key]: value }));
			}
		},
		[],
	);

	useEffect(() => {
		let sum = 0n;
		for (const key in xDaiInfos) {
			if (Object.prototype.hasOwnProperty.call(xDaiInfos, key)) {
				const value = xDaiInfos[key];
				sum += value;
			}
		}
		setxDaiTotalEarned(sum);
	}, [xDaiInfos]);

	useEffect(() => {
		let sum = 0n;
		for (const key in mainnetInfos) {
			if (Object.prototype.hasOwnProperty.call(mainnetInfos, key)) {
				const value = mainnetInfos[key];
				sum += value;
			}
		}
		setMainnetTotalEarned(sum);
	}, [mainnetInfos]);

	useEffect(() => {
		setxDaiInfos({});
		setxDaiTotalEarned(0n);
		setMainnetInfos({});
		setMainnetTotalEarned(0n);
	}, [account]);

	useEffect(() => {
		if (chainId === config.MAINNET_NETWORK_NUMBER) {
			setxDaiInfos({});
			setxDaiTotalEarned(0n);
		} else if (chainId === config.GNOSIS_NETWORK_NUMBER) {
			setMainnetInfos({});
			setMainnetTotalEarned(0n);
		}
	}, [chainId]);

	return (
		<FarmContext.Provider
			value={{
				totalEarned:
					chainId === config.MAINNET_NETWORK_NUMBER
						? mainnetTotalEarned
						: xDaiTotalEarned,
				setInfo,
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
