import { IconRocketInSpace32 } from '@giveth/ui-design-system';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from './Modal';
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
		>
			<div>Hi</div>
		</Modal>
	);
};
