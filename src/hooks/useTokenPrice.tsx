import BigNumber from 'bignumber.js';
import { useState, useEffect } from 'react';
import { type Address, useNetwork } from 'wagmi';
import { fetchETCPrice, fetchPrice } from '@/services/token';
import { fetchEthPrice } from '@/features/price/price.services';
import { useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';

const ethereumChain = config.MAINNET_CONFIG;
const gnosisChain = config.GNOSIS_CONFIG;
const stableCoins = [
	gnosisChain.nativeCurrency.symbol.toUpperCase(),
	'DAI',
	'USDT',
];

export const useTokenPrice = (token: IProjectAcceptedToken) => {
	const [tokenPrice, setTokenPrice] = useState<number>();

	const { chain } = useNetwork();
	const chainId = chain?.id;
	const givPrice = useAppSelector(state => state.price.givPrice);
	const givTokenPrice = new BigNumber(givPrice).toNumber();
	const isMainnet = chainId === config.MAINNET_NETWORK_NUMBER;

	useEffect(() => {
		const setPrice = async () => {
			if (
				token?.symbol &&
				stableCoins.includes(token.symbol.toUpperCase())
			) {
				setTokenPrice(1);
			} else if (token?.symbol === 'GIV') {
				setTokenPrice(givTokenPrice || 0);
			} else if (token?.symbol === ethereumChain.nativeCurrency.symbol) {
				const ethPrice = await fetchEthPrice();
				setTokenPrice(ethPrice || 0);
			} else if (token?.address) {
				// ETC is not supported by coingecko with contract address, so we should use this function to fetch the price
				if (token.symbol === 'ETC') {
					const fetchedETCPrice = await fetchETCPrice();
					setTokenPrice(fetchedETCPrice || 0);
					return;
				}

				let tokenAddress = token.address;
				// Coingecko doesn't have these tokens in Gnosis Chain, so fetching price from ethereum
				if (!isMainnet && token.mainnetAddress) {
					tokenAddress =
						(token.mainnetAddress as Address) || ('' as Address);
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
			setPrice().catch(() => setTokenPrice(0));
		}
	}, [token]);
	return tokenPrice;
};
