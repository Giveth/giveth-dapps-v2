import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useNetwork } from 'wagmi';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { fetchEthPrice } from '@/features/price/price.services';
import { fetchETCPrice, fetchPrice } from '@/services/token';
import config from '@/configuration';
import { useAppSelector } from '@/features/hooks';

const ethereumChain = config.MAINNET_CONFIG;

const useTokenPrice = (token?: IProjectAcceptedToken) => {
	const [tokenPrice, setTokenPrice] = useState<number>();

	const { chain } = useNetwork();
	const chainId = chain?.id;
	const givPrice = useAppSelector(state => state.price.givPrice);
	const givTokenPrice = new BigNumber(givPrice).toNumber();
	const isMainnet = chainId === config.MAINNET_NETWORK_NUMBER;

	useEffect(() => {
		const setPrice = async () => {
			// stable coins can be set in admin panel
			if (token?.isStableCoin) {
				setTokenPrice(1);
			} else if (token?.symbol === 'GIV') {
				setTokenPrice(givTokenPrice || 0);
			} else if (token?.symbol === ethereumChain.nativeCurrency.symbol) {
				const ethPrice = await fetchEthPrice();
				setTokenPrice(ethPrice || 0);
			} else if (token?.address) {
				let tokenAddress = token.address;
				// Coingecko doesn't have these tokens in Gnosis Chain, so fetching price from ethereum
				if (!isMainnet && token.mainnetAddress) {
					tokenAddress =
						(token.mainnetAddress as `0x${string}`) ||
						('' as `0x${string}`);
				}
				// ETC is not supported by coingecko with contract address, so we should use this function to fetch the price
				if (token.symbol === 'ETC') {
					const fetchedETCPrice = await fetchETCPrice();
					setTokenPrice(fetchedETCPrice || 0);
					return;
				}
				const coingeckoChainId =
					isMainnet ||
					(token.mainnetAddress && token.symbol !== 'CELO')
						? config.MAINNET_NETWORK_NUMBER
						: chainId!;
				const fetchedPrice = await fetchPrice(
					coingeckoChainId,
					tokenAddress,
				);
				setTokenPrice(fetchedPrice || 0);
			}
		};
		if (token) {
			setPrice().catch(() => {
				setTokenPrice(0);
				console.error(
					'Error fetching token price in useTokenPrice. Token name: ',
					token?.symbol,
				);
			});
		}
	}, [token]);

	return tokenPrice;
};

export default useTokenPrice;
