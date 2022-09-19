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

interface IApprovePowerBoostModal extends IModal {
	boostId: string;
	saveBoosts: (id: string) => Promise<boolean>;
}

export const ApprovePowerBoostModal: FC<IApprovePowerBoostModal> = ({
	setShowModal,
	boostId,
	saveBoosts,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const onSave = async () => {
		saveBoosts(boostId);
		closeModal();
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={'Are you sure?'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<ApprovePowerBoostModalContainer>
				<Content>
					You changed the allocation and about to save this changes.
				</Content>
				<>
					<CustomButton label='Save changes' onClick={onSave} />
					<CustomButton
						buttonType='texty-primary'
						label='Cancel'
						onClick={closeModal}
					/>
				</>
			</ApprovePowerBoostModalContainer>
		</Modal>
	);
};

const ApprovePowerBoostModalContainer = styled.div`
	width: 100%;
	${mediaQueries.tablet} {
		width: 450px;
	}
	padding: 24px;
`;

const Content = styled(Lead)`
	margin-bottom: 48px;
`;

export const CustomButtonLink = styled(ButtonLink)`
	width: 300px;
	display: block;
	margin: 8px auto;
`;

export const GetButton = styled(CustomButtonLink)`
	margin: 42px auto 12px;
`;

export const CustomButton = styled(Button)`
	width: 300px;
	margin: 8px auto;
`;
