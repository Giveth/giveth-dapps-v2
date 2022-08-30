import React, { FC } from 'react';
import {
	Button,
	ButtonLink,
	IconRocketInSpace32,
	Lead,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import { mediaQueries } from '@/lib/constants/constants';
import Routes from '@/lib/constants/Routes';
import { StakingType } from '@/types/config';

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
				<GetButton
					label='Get GIVpower'
					size='small'
					href={`${Routes.GIVfarm}/?open=${StakingType.GIV_LM}&chain=gnosis`}
				/>
				<NoButton
					buttonType='texty'
					label='Not Now'
					onClick={closeModal}
				></NoButton>
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

const GetButton = styled(ButtonLink)`
	width: 300px;
	margin: 42px auto 12px;
`;

const NoButton = styled(Button)`
	width: 300px;
	margin: auto;
`;
