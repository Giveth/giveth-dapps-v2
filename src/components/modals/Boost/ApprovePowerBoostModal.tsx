import React, { FC, useState } from 'react';
import { IconRocketInSpace32 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
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
	const { formatMessage } = useIntl();

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
			headerTitle={formatMessage({ id: 'label.are_you_sure' })}
			headerIcon={<IconRocketInSpace32 />}
		>
			<ConfirmPowerBoostModalContainer>
				<Content>
					{formatMessage({
						id: 'label.you_are_about_to_save_the_changes_you_made',
					})}
				</Content>
				<>
					<CustomButton
						label={formatMessage({ id: 'label.save_changes' })}
						onClick={onSave}
						loading={loading}
						disabled={loading}
					/>
					<CustomButton
						buttonType='texty-primary'
						label={formatMessage({ id: 'label.cancel' })}
						onClick={closeModal}
					/>
				</>
			</ConfirmPowerBoostModalContainer>
		</Modal>
	);
};
