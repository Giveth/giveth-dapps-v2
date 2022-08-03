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
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from './Modal';
import { mediaQueries } from '@/lib/constants/constants';
import type { IModal } from '@/types/common';
import type { FC } from 'react';

interface IBridgeGIVModal extends IModal {}

export const BridgeGIVModal: FC<IBridgeGIVModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			headerIcon={<IconRocketInSpace32 />}
			headerTitle='Stake GIV on Gnosis Chain'
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			<ModalContainer>
				<P>
					GIV staking is available on Gnosis Chain. Please bridge your
					GIV to Gnosis Chain, then switch network and stake to earn
					rewards.
				</P>
				<P>
					Please note, it will take few minutes for your GIV to
					bridge.
				</P>
				<BridgeButton
					size='medium'
					label='Bridge your GIV'
					icon={<IconExternalLink size={16} />}
				/>
				<DescContainer>
					If you already bridged your GIV, please switch network to
					stake for GIVpower!
				</DescContainer>
				<SwitchNetworkButton
					buttonType='texty'
					size='medium'
					label='Switch network'
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
