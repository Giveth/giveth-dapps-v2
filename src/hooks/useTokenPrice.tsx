import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { fetchPrice, fetchPriceWithCoingeckoId } from '@/services/token';
import config from '@/configuration';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';
import { useFetchGIVPrice } from './useGivPrice';

const ethereumChain = config.MAINNET_CONFIG;
const gnosisChain = config.GNOSIS_CONFIG;
const stableCoins = [
	gnosisChain.nativeCurrency.symbol.toUpperCase(),
	'DAI',
	'USDT',
	'USDC',
	'USDCT',
];

interface ITokenPrice {
	symbol: string;
	address?: Address;
	id?: Address | string;
	mainnetAddress?: Address;
	isStableCoin?: boolean;
	coingeckoId?: string;
}

export const useTokenPrice = (token?: ITokenPrice) => {
	const [tokenPrice, setTokenPrice] = useState<number>();
	const { walletChainType } = useGeneralWallet();
	const { chain } = useAccount();
	const chainId = chain?.id;
	const { data: givPrice } = useFetchGIVPrice();
	const givTokenPrice = givPrice ? new BigNumber(givPrice).toNumber() : 0;
	const isMainnet = chainId === config.MAINNET_NETWORK_NUMBER;

	useEffect(() => {
		const setPrice = async () => {
			if (
				token?.isStableCoin ||
				(token?.symbol &&
					stableCoins.includes(token.symbol.toUpperCase()))
			) {
				setTokenPrice(1);
			} else if (token?.symbol === 'GIV' && givTokenPrice) {
				setTokenPrice(givTokenPrice);
			} else if (token?.coingeckoId) {
				setTokenPrice(
					(await fetchPriceWithCoingeckoId(token.coingeckoId)) || 0,
				);
			} else if (token?.address || token?.id) {
				// ETC is not supported by coingecko with contract address, so we should use this function to fetch the price
				let tokenAddress = token.address || token.id;
				// Coingecko doesn't have these tokens in Gnosis Chain, so fetching price from ethereum
				if (!isMainnet && token.mainnetAddress) {
					tokenAddress =
						(token.mainnetAddress as Address) || ('' as Address);
				}
				const coingeckoChainId =
					isMainnet ||
					(token.mainnetAddress && token.symbol !== 'CELO')
						? config.MAINNET_NETWORK_NUMBER
						: walletChainType && walletChainType !== ChainType.EVM
							? walletChainType
							: chainId!;
				const fetchedPrice = await fetchPrice(
					coingeckoChainId,
					tokenAddress,
				);
				setTokenPrice(fetchedPrice || 0);
			}
		};
		if (token) {
			setPrice().catch(e => {
				console.error(
					'Error fetching token price in useTokenPrice. Token name: ',
					token?.symbol,
					e,
				);
				setTokenPrice(0);
			});
		}
	}, [token]);
	return tokenPrice;
};
