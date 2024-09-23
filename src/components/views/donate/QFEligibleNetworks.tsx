import styled from 'styled-components';
import {
	brandColors,
	Caption,
	IconExternalLink24,
	IconNetwork24,
	neutralColors,
	OutlineButton,
	SublineBold,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import SwitchNetwork from '@/components/modals/SwitchNetwork';
import { useDonateData } from '@/context/donate.context';
import { ChainType } from '@/types/config';
import config from '@/configuration';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

const QFEligibleNetworks = () => {
	const [showModal, setShowModal] = useState(false);
	const { isConnected } = useGeneralWallet();
	const { formatMessage } = useIntl();
	const { activeStartedRound } = useDonateData();
	const router = useRouter();
	const isQRDonation = router.query.chain === ChainType.STELLAR.toLowerCase();
	const stellarNetworkId =
		config.NON_EVM_NETWORKS_CONFIG[ChainType.STELLAR].networkId;
	const solanaNetworkId =
		config.NON_EVM_NETWORKS_CONFIG[ChainType.SOLANA].networkId;
	const eligibleNetworks = activeStartedRound?.eligibleNetworks.map(
		network => ({
			networkId: network,
			chainType: config.EVM_NETWORKS_CONFIG[network]
				? ChainType.EVM
				: network === stellarNetworkId
					? ChainType.STELLAR
					: ChainType.SOLANA,
			configId:
				network === stellarNetworkId
					? ChainType.STELLAR
					: network === solanaNetworkId
						? ChainType.SOLANA
						: network,
		}),
	);
	console.log('eligibleNetworks', eligibleNetworks, activeStartedRound);
	const eligibleNetworksWithoutStellar = eligibleNetworks?.filter(
		network => network.networkId !== stellarNetworkId,
	);
	if (!activeStartedRound) return null;
	return (
		<Wrapper>
			<Caption $medium>
				{formatMessage({ id: 'label.eligible_networks_for_matching' })}
			</Caption>
			<IconsWrapper>
				{eligibleNetworks?.map(network => (
					<IconWithTooltip
						icon={
							<TooltipIconWrapper>
								{config.NETWORKS_CONFIG[
									network.configId
								]?.chainLogo(24)}
							</TooltipIconWrapper>
						}
						direction='top'
						align='top'
						key={network.networkId}
					>
						<SublineBold>
							{config.NETWORKS_CONFIG[network.configId]?.name}
						</SublineBold>
					</IconWithTooltip>
				))}
			</IconsWrapper>
			{!isQRDonation && isConnected && (
				<ButtonsWrapper>
					<OutlineButton
						onClick={() => setShowModal(true)}
						size='medium'
						icon={<IconNetwork24 />}
						label={formatMessage({ id: 'label.switch_network' })}
					/>
					<ExternalLink href={links.ACROSS_BRIDGE}>
						<OutlineButton
							size='medium'
							icon={<IconExternalLink24 />}
							label={formatMessage({ id: 'label.bridge_tokens' })}
						/>
					</ExternalLink>
				</ButtonsWrapper>
			)}
			{showModal && (
				<SwitchNetwork
					setShowModal={setShowModal}
					customNetworks={eligibleNetworksWithoutStellar}
				/>
			)}
		</Wrapper>
	);
};

const TooltipIconWrapper = styled.div`
	margin-top: 4px;
`;

const IconsWrapper = styled.div`
	margin-top: 14px;
	display: flex;
	gap: 4px;
	img {
		filter: grayscale(100%);
		opacity: 0.4;
		transition: all 0.3s;
		&:hover {
			filter: grayscale(0);
			opacity: 1;
		}
	}
`;

const ButtonsWrapper = styled.div`
	margin-top: 16px;
	display: flex;
	gap: 16px;
	button {
		height: 32px;
		color: ${brandColors.giv[500]};
		border: 1px solid ${brandColors.giv[500]};
	}
`;

const Wrapper = styled.div`
	margin-bottom: 32px;
	border-radius: 8px;
	border: 1px solid ${neutralColors.gray[300]};
	background: ${neutralColors.gray[100]};
	padding: 16px;
	color: ${neutralColors.gray[800]};
`;

export default QFEligibleNetworks;
