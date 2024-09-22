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

const QFEligibleNetworks = () => {
	const [showModal, setShowModal] = useState(false);
	const { formatMessage } = useIntl();
	const { activeStartedRound } = useDonateData();
	const router = useRouter();
	const isQRDonation = router.query.chain === ChainType.STELLAR.toLowerCase();
	const stellarNetworkId =
		config.NON_EVM_NETWORKS_CONFIG[ChainType.STELLAR].networkId;
	const eligibleNetworksWithChainType = activeStartedRound?.eligibleNetworks
		.filter(network => network !== stellarNetworkId)
		.map(network => ({
			networkId: network,
			chainType: ChainType.EVM,
		}));
	if (!activeStartedRound) return null;
	return (
		<Wrapper>
			<Caption $medium>
				{formatMessage({ id: 'label.eligible_networks_for_matching' })}
			</Caption>
			<IconsWrapper>
				{eligibleNetworksWithChainType?.map(network => (
					<IconWithTooltip
						icon={config.NETWORKS_CONFIG[
							network.networkId
						]?.chainLogo(24)}
						direction='top'
						align='top'
						key={network.networkId}
					>
						<SublineBold>
							{config.NETWORKS_CONFIG[network.networkId]?.name}
						</SublineBold>
					</IconWithTooltip>
				))}
			</IconsWrapper>
			{!isQRDonation && (
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
					customNetworks={eligibleNetworksWithChainType}
				/>
			)}
		</Wrapper>
	);
};

const IconsWrapper = styled.div`
	margin-top: 16px;
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
