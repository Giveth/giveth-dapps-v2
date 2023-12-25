import styled from 'styled-components';
import { FC } from 'react';
import { IconBulbOutline32, P, brandColors } from '@giveth/ui-design-system';
import { useNetwork } from 'wagmi';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import config from '@/configuration';

const AlloProtocolModal: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { chain } = useNetwork();
	const isOnOptimism = chain
		? chain.id === config.OPTIMISM_NETWORK_NUMBER
		: false;

	console.log('Rendering AlloProtocolModal');
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconBulbOutline32 />}
			headerTitle='Set up Allo Protocol Registry'
			headerTitlePosition='left'
		>
			<Container>
				{isOnOptimism ? 'On Optimism' : 'Not On Optimism'}
				<P>Set up your profile on the Allo protocol Registry </P>
				<br />
				<ItemContainer>
					<P>
						Your project will be included in a shared registry of
						public goods projects with Gitcoin and others. You will
						also set up your project to receive recurring donations.
					</P>
					<Ellipse />
				</ItemContainer>
				<br />
				<ItemContainer>
					<P>
						There will be one extra transaction you need to sign to
						enable recurring donations for this project on Optimism.
					</P>
					<Ellipse />
				</ItemContainer>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	padding: 24px;
	text-align: left;
	max-width: 500px;
`;

const ItemContainer = styled.div`
	position: relative;
	padding-left: 8px;
`;

const Ellipse = styled.div`
	position: absolute;
	top: 8px;
	left: -8px;
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background-color: ${brandColors.giv[600]};
	box-shadow: 0 0 0 4px ${brandColors.giv[100]};
`;

export default AlloProtocolModal;
