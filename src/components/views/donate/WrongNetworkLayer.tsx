import React from 'react';
import styled from 'styled-components';
import {
	B,
	Caption,
	IconInfoFilled16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { useSwitchChain } from 'wagmi';
import { useIntl } from 'react-intl';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import config from '@/configuration';

export const WrongNetworkLayer = () => {
	const { switchChain } = useSwitchChain();
	const { formatMessage } = useIntl();

	return (
		<Overlay>
			<Toast>
				<Header>
					<Title gap='4px' alignItems='center'>
						<IconInfoFilled16 />
						<Caption>
							{formatMessage({
								id: 'label.recurring_donations_currently_only_available_on_optimism',
							})}
						</Caption>
					</Title>
					<SwitchButton
						onClick={() =>
							switchChain &&
							switchChain({
								chainId: config.OPTIMISM_NETWORK_NUMBER,
							})
						}
					>
						{formatMessage({
							id: 'label.switch_network',
						})}
					</SwitchButton>
				</Header>
				<Desc>
					{formatMessage(
						{
							id: 'label.switch_to_network_to_continue_donating',
						},
						{
							network: <b>{config.OPTIMISM_CONFIG.name}</b>,
						},
					)}
				</Desc>
			</Toast>
		</Overlay>
	);
};

const Overlay = styled(FlexCenter)`
	position: absolute;
	z-index: 100;
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.7);
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	backdrop-filter: blur(2px);
`;

const Toast = styled.div`
	padding: 16px;
	border-radius: 8px;
	border: 1px solid ${brandColors.giv[500]};
	background: #fff;
`;

const Header = styled(Flex)`
	padding-bottom: 4px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
	gap: 16px;
	flex-wrap: wrap;
`;

const Title = styled(Flex)`
	color: ${brandColors.giv[500]};
`;

const SwitchButton = styled(B)`
	cursor: pointer;
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[600]};
	}
`;

const Desc = styled(Caption)`
	color: ${neutralColors.gray[700]};
	margin-top: 8px;
	text-align: left;
`;
