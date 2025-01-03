import React from 'react';
import styled from 'styled-components';
import {
	Caption,
	IconInfoFilled16,
	brandColors,
	neutralColors,
	Flex,
	FlexCenter,
	Button,
} from '@giveth/ui-design-system';
import { useSwitchChain } from 'wagmi';
import { useIntl } from 'react-intl';
import config from '@/configuration';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

export const WrongNetworkLayer = () => {
	const { switchChain } = useSwitchChain();
	const { isOnEVM, handleSingOutAndSignInWithEVM } = useGeneralWallet();
	const { formatMessage } = useIntl();

	return (
		<Overlay>
			<Toast>
				<Header>
					<Title gap='4px' $alignItems='center'>
						<IconInfoFilled16 />
						<Caption>
							{formatMessage({
								id: 'label.recurring_donations_currently_only_available_on_optimism_base',
							})}
						</Caption>
					</Title>
				</Header>
				<Desc>
					{formatMessage(
						{
							id: 'label.switch_to_network_to_continue_donating',
						},
						{
							network: (
								<>
									<ButtonLinkHolder
										buttonType='texty-primary'
										label={config.OPTIMISM_CONFIG.name}
										onClick={async () => {
											if (isOnEVM) {
												switchChain &&
													switchChain({
														chainId:
															config
																.OPTIMISM_CONFIG
																.id,
													});
											} else {
												await handleSingOutAndSignInWithEVM();
											}
										}}
									/>{' '}
									or{' '}
									<ButtonLinkHolder
										buttonType='texty-primary'
										label={config.BASE_CONFIG.name}
										onClick={async () => {
											if (isOnEVM) {
												switchChain &&
													switchChain({
														chainId:
															config.BASE_CONFIG
																.id,
													});
											} else {
												await handleSingOutAndSignInWithEVM();
											}
										}}
									/>
								</>
							),
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

const ButtonLinkHolder = styled(Button)`
	display: inline-block !important;
	padding: 0;
	& span:hover {
		color: ${neutralColors.gray[400]};
	}
`;

const Desc = styled(Caption)`
	color: ${neutralColors.gray[700]};
	margin-top: 8px;
	text-align: left;
`;
