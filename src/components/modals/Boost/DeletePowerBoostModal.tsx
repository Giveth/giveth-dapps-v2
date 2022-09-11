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

interface IDeletePowerBoostModal extends IModal {
	boostId: string;
	deleteBoost: (id: string) => Promise<boolean>;
	canDelete: boolean;
}

export const DeletePowerBoostModal: FC<IDeletePowerBoostModal> = ({
	setShowModal,
	boostId,
	deleteBoost,
	canDelete,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const onDelete = async () => {
		deleteBoost(boostId);
		closeModal();
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={canDelete ? 'Are you sure?' : 'Ooops!'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<DeletePowerBoostModalContainer>
				{canDelete ? (
					<Lead>
						By removing project boosting, your GIVpower will
						distribute to your other projects.
					</Lead>
				) : (
					<Lead>
						You can’t remove this project boosting because this is
						the only boosting that you have!
					</Lead>
				)}
				{canDelete ? (
					<>
						<CustomButton label='cancel' onClick={closeModal} />
						<CustomButton
							buttonType='texty-primary'
							label='Remove the boosting'
							onClick={onDelete}
						/>
					</>
				) : (
					<CustomButton
						buttonType='texty-primary'
						label='Dismiss'
						onClick={closeModal}
					/>
				)}
			</DeletePowerBoostModalContainer>
		</Modal>
	);
};

const DeletePowerBoostModalContainer = styled.div`
	width: 100%;
	${mediaQueries.tablet} {
		width: 450px;
	}
	padding: 24px;
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
