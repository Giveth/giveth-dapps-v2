import styled from 'styled-components';
import {
	B,
	Caption,
	IconHelpFilled16,
	neutralColors,
	semanticColors,
	Subline,
} from '@giveth/ui-design-system';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import BigNumber from 'bignumber.js';
import { useNetwork } from 'wagmi';
import Divider from '@/components/Divider';
import { TooltipContent } from '@/components/modals/HarvestAll.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { FlexCenter } from '@/components/styled-components/Flex';
import { IDonationProject } from '@/apollo/types/types';
import { calculateEstimatedMatchingWithDonationAmount } from '@/helpers/qf';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import config from '@/configuration';
import { useAppSelector } from '@/features/hooks';
import { fetchEthPrice } from '@/features/price/price.services';
import { fetchPrice } from '@/services/token';
import { formatDonation } from '@/helpers/number';

interface IEstimatedMatchingToast {
	projectData: IDonationProject;
	token?: IProjectAcceptedToken;
	amountTyped?: number;
}

const ethereumChain = config.MAINNET_CONFIG;
const gnosisChain = config.GNOSIS_CONFIG;
const stableCoins = [
	gnosisChain.nativeCurrency.symbol.toUpperCase(),
	'DAI',
	'USDT',
];

const EstimatedMatchingToast = ({
	projectData,
	token,
	amountTyped,
}: IEstimatedMatchingToast) => {
	const { formatMessage, locale } = useIntl();
	const { estimatedMatching } = projectData || {};
	const { allProjectsSum, matchingPool, projectDonationsSqrtRootSum } =
		estimatedMatching || {};
	const [tokenPrice, setTokenPrice] = useState<number>();

	const { chain } = useNetwork();
	const givPrice = useAppSelector(state => state.price.givPrice);

	const chainId = chain?.id;
	const givTokenPrice = new BigNumber(givPrice).toNumber();
	const isMainnet = chainId === config.MAINNET_NETWORK_NUMBER;
	const isGnosis = chainId === config.GNOSIS_NETWORK_NUMBER;
	const isPolygon = chainId === config.POLYGON_NETWORK_NUMBER;
	const isCelo = chainId === config.CELO_NETWORK_NUMBER;

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
				let tokenAddress = token.address as `0x${string}`;
				// Coingecko doesn't have these tokens in Gnosis Chain, so fetching price from ethereum
				if (!isMainnet && token.mainnetAddress) {
					tokenAddress = token.mainnetAddress || '';
				}
				const coingeckoChainId =
					isMainnet ||
					(token.mainnetAddress && token.symbol !== 'CELO')
						? config.MAINNET_NETWORK_NUMBER
						: isGnosis
							? config.GNOSIS_NETWORK_NUMBER
							: isCelo
								? config.CELO_NETWORK_NUMBER
								: isPolygon
									? config.POLYGON_NETWORK_NUMBER
									: config.OPTIMISM_NETWORK_NUMBER;
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

	const esMatching = calculateEstimatedMatchingWithDonationAmount(
		(tokenPrice || 0) * (amountTyped || 0),
		projectDonationsSqrtRootSum,
		allProjectsSum,
		matchingPool,
	);

	return (
		<Wrapper>
			<Upper>
				<FlexCenter gap='4px'>
					<Caption medium>
						{formatMessage({
							id: 'page.donate.matching_toast.upper',
						})}
					</Caption>
					<IconWithTooltip
						icon={
							<IconHelpFilled16
								color={semanticColors.jade['700']}
							/>
						}
						direction='top'
					>
						<TooltipContent>
							{formatMessage({
								id: 'tooltip.donation.matching',
							})}
						</TooltipContent>
					</IconWithTooltip>
				</FlexCenter>
				<B>{formatDonation(esMatching, '', locale, true)}</B>
			</Upper>
			<Divider />
			<Bottom>
				{formatMessage({ id: 'page.donate.matching_toast.bottom' })}
			</Bottom>
		</Wrapper>
	);
};

const Bottom = styled(Subline)`
	color: ${neutralColors.gray['800']};
	margin-top: 4px;
`;

const Upper = styled.div`
	margin-bottom: 4px;
	color: ${semanticColors.jade['700']};
	display: flex;
	justify-content: space-between;
`;

const Wrapper = styled.div`
	border: 1px solid ${semanticColors.jade['500']};
	border-radius: 8px;
	padding: 16px;
	margin-top: 8px;
`;

export default EstimatedMatchingToast;
