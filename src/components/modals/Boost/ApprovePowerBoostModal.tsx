import React, { FC, useState } from 'react';
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
	const [loading, setLoading] = useState(false);

	const onSave = async () => {
		setLoading(true);
		const isSaved = await onSaveBoosts();
		if (isSaved) closeModal();
		setLoading(false);
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
					You changed your GIVpower allocations, do you want to save
					these changes?
				</Content>
				<>
					<CustomButton
						label='Save changes'
						onClick={onSave}
						loading={loading}
						disabled={loading}
					/>
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
