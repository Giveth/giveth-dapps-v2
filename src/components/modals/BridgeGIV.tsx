import {
	brandColors,
	Button,
	ButtonLink,
	IconExternalLink,
	IconRocketInSpace32,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from './Modal';
import { mediaQueries } from '@/lib/constants/constants';
import { switchNetwork } from '@/lib/wallet';
import config from '@/configuration';
import links from '@/lib/constants/links';
import type { IModal } from '@/types/common';
import type { FC } from 'react';

interface IBridgeGIVModal extends IModal {}

export const BridgeGIVModal: FC<IBridgeGIVModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			headerIcon={<IconRocketInSpace32 />}
			headerTitle={formatMessage({
				id: 'label.stake_giv_on_gnosis_chain',
			})}
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<ModalContainer>
				<P>
					{formatMessage({
						id: 'label.giv_staking_is_available_on_gnosis_chain',
					})}
				</P>
				<P>
					{formatMessage({
						id: 'label.please_note_it_will_take_few_minutes_for_your_giv_to_bridge',
					})}
				</P>
				<BridgeButton
					isExternal
					size='medium'
					label={formatMessage({ id: 'label.bridge_your_giv' })}
					icon={<IconExternalLink size={16} />}
					href={links.GIV_BRIDGE}
					target='_blank'
				/>
				<DescContainer>
					{formatMessage({
						id: 'label.if_you_already_bridged_your_giv_please_switch_network',
					})}
				</DescContainer>
				<SwitchNetworkButton
					buttonType='texty'
					size='medium'
					label={formatMessage({ id: 'label.switch_network' })}
					onClick={() => switchNetwork(config.XDAI_NETWORK_NUMBER)}
				/>
			</ModalContainer>
		</Modal>
	);
};

const ModalContainer = styled.div`
	padding: 32px 24px 24px;
	${mediaQueries.tablet} {
		width: 462px;
	}
`;

const DescContainer = styled.div`
	color: ${neutralColors.gray[100]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.mustard[800]};
	border-radius: 8px;
	padding: 16px;
	margin-top: 16px;
	margin-bottom: 16px;
	text-align: left;
`;

const BridgeButton = styled(ButtonLink)`
	width: fit-content;
	margin: 16px auto 32px;
`;

const SwitchNetworkButton = styled(Button)`
	width: 316px;
	margin: 0 auto;
`;
