import React, { FC } from 'react';
import { IconRocketInSpace32, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import { mediaQueries } from '@/lib/constants/constants';

export const ZeroGivpowerModal: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={'Oh no!'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<ZeroGivpowerModalContainer>
				<Lead>
					You don’t have any GIVpower!
					<br /> Stake and lock your GIV to get GIVpower.
				</Lead>
			</ZeroGivpowerModalContainer>
		</Modal>
	);
};

const ZeroGivpowerModalContainer = styled.div`
	width: 100%;
	${mediaQueries.tablet} {
		width: 450px;
	}
	padding: 24px;
`;
