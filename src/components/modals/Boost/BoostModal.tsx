import { IconRocketInSpace32 } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';

import { useModalAnimation } from '@/hooks/useModalAnimation';
import 'rc-slider/assets/index.css';
import { ZeroGivpowerModal } from './ZeroGivpowerModal';
import { BoostModalContainer } from './BoostModal.sc';
import BoostedInnerModal from './BoostedInnerModal';
import BoostInnerModal from './BoostInnerModal';

interface IBoostModalProps extends IModal {}

export enum EBoostModalState {
	BOOSTING,
	BOOSTED,
}

const BoostModal: FC<IBoostModalProps> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [percentage, setPercentage] = useState(0);
	const [isChanged, setIsChanged] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isBoosted, setIsBoosted] = useState(EBoostModalState.BOOSTING);

	let totalGIVpower = '392743000000000000000000';
	// totalGIVpower = '0';

	if (totalGIVpower == '0') {
		return <ZeroGivpowerModal setShowModal={setShowModal} />;
	}

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={'Boost'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<BoostModalContainer state={isBoosted}>
				{isBoosted ? (
					<BoostedInnerModal percentage={10} />
				) : (
					<BoostInnerModal />
				)}
			</BoostModalContainer>
		</Modal>
	);
};

export default BoostModal;
