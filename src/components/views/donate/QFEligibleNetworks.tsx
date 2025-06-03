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
	const { activeStartedRound, project } = useDonateData();
	const router = useRouter();
	const isQRDonation = router.query.chain === ChainType.STELLAR.toLowerCase();
	const eligibleNetworksWithoutStellar = activeStartedRound?.eligibleNetworks
		.filter(network => network !== config.STELLAR_NETWORK_NUMBER)
		.map(network => ({
			networkId: network,
			chainType: config.EVM_NETWORKS_CONFIG[network]
				? ChainType.EVM
				: ChainType.SOLANA,
		}));
	const isStellarOnlyRound =
		activeStartedRound?.eligibleNetworks?.length === 1 &&
		activeStartedRound?.eligibleNetworks[0] ===
			config.STELLAR_NETWORK_NUMBER;

	if (!activeStartedRound) return null;
	return (
		<Wrapper>
			<Caption $medium>
				{formatMessage({ id: 'label.eligible_networks_for_matching' })}
			</Caption>
			<IconsWrapper>
				{activeStartedRound?.eligibleNetworks?.map(network => {
					// Check if project has an address for this network
					const hasProjectAddress = project?.addresses?.some(
						address =>
							address.networkId === network &&
							address.isRecipient,
					);

					// Only render if project has an address for this network
					return hasProjectAddress ? (
						<IconWithTooltip
							icon={
								<TooltipIconWrapper>
									{config.NETWORKS_CONFIG_WITH_ID[
										network
									]?.chainLogo(24)}
								</TooltipIconWrapper>
							}
							direction='top'
							align='top'
							key={network}
						>
							<SublineBold>
								{config.NETWORKS_CONFIG_WITH_ID[network]?.name}
							</SublineBold>
						</IconWithTooltip>
					) : null;
				})}
			</IconsWrapper>
			{!isQRDonation && isConnected && !isStellarOnlyRound && (
				<ButtonsWrapper>
					<OutlineButton
						onClick={() => setShowModal(true)}
						size='medium'
						icon={<IconNetwork24 />}
						label={formatMessage({
							id: 'label.switch_network',
						})}
					/>
					<ExternalLink href={links.ACROSS_BRIDGE}>
						<OutlineButton
							size='medium'
							icon={<IconExternalLink24 />}
							label={formatMessage({
								id: 'label.bridge_tokens',
							})}
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
	flex-wrap: wrap; /* Allow content to wrap to the next line */
	max-width: 100%; /* Ensure the content does not exceed the width of the parent */
	max-height: 100%; /* Ensure the content does not exceed the height of the parent */
	gap: 4px;
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
