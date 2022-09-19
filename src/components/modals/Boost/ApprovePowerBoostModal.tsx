import React, { FC } from 'react';
import { IconRocketInSpace32 } from '@giveth/ui-design-system';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';
import {
	ConfirmPowerBoostModalContainer,
	Content,
	CustomButton,
} from './DeletePowerBoostModal';

interface IApprovePowerBoostModal extends IModal {
	onSaveBoosts: () => Promise<boolean>;
}

export const ApprovePowerBoostModal: FC<IApprovePowerBoostModal> = ({
	setShowModal,
	onSaveBoosts,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const onSave = async () => {
		const isSaved = await onSaveBoosts();
		if (isSaved) closeModal();
	};

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={'Are you sure?'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<ConfirmPowerBoostModalContainer>
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
			</ConfirmPowerBoostModalContainer>
		</Modal>
	);
};
