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
import { BN } from '@/helpers/number';

interface IBoostModalProps extends IModal {}

export enum EBoostModalState {
	BOOSTING,
	BOOSTED,
}

const BoostModal: FC<IBoostModalProps> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [percentage, setPercentage] = useState(0);
	const [state, setState] = useState(EBoostModalState.BOOSTING);

	let totalGIVpower = '392743000000000000000000';
	// totalGIVpower = '0';

	if (totalGIVpower == '0') {
		return <ZeroGivpowerModal setShowModal={setShowModal} />;
	}

	const title = EBoostModalState.BOOSTING ? 'Boost' : 'Well done!';

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={title}
			headerIcon={<IconRocketInSpace32 />}
		>
			<BoostModalContainer state={state}>
				{state === EBoostModalState.BOOSTING ? (
					<BoostInnerModal
						totalGIVpower={BN(totalGIVpower)}
						setPercentage={setPercentage}
						setState={setState}
					/>
				) : (
					<BoostedInnerModal
						percentage={percentage}
						closeModal={closeModal}
					/>
				)}
			</BoostModalContainer>
		</Modal>
	);
};

export default BoostModal;
