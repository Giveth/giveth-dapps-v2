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
import { useAppDispatch } from '@/features/hooks';
import { decrementBoostedProjectsCount } from '@/features/user/user.slice';

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
	const dispatch = useAppDispatch();

	const onDelete = async () => {
		deleteBoost(boostId);
		dispatch(decrementBoostedProjectsCount());
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
			<ConfirmPowerBoostModalContainer>
				{canDelete ? (
					<Content>
						By removing your boost to this project your GIVpower
						will be distributed to other projects you have boosted.
					</Content>
				) : (
					<Content>
						You can’t remove this project boost because this is the
						only boost that you have!
					</Content>
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
			</ConfirmPowerBoostModalContainer>
		</Modal>
	);
};

export const ConfirmPowerBoostModalContainer = styled.div`
	width: 100%;
	${mediaQueries.tablet} {
		width: 450px;
	}
	padding: 24px;
`;

export const Content = styled(Lead)`
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
