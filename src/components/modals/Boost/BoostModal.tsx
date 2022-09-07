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
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

interface IBoostModalProps extends IModal {
	projectId: string;
}

export enum EBoostModalState {
	BOOSTING,
	BOOSTED,
}

const BoostModal: FC<IBoostModalProps> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const [percentage, setPercentage] = useState(0);
	const [state, setState] = useState(EBoostModalState.BOOSTING);
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.xDaiValues),
	);
	const givPower = sdh.getUserGIVPowerBalance();

	if (givPower.balance == '0') {
		return <ZeroGivpowerModal setShowModal={setShowModal} />;
	}

	const title = state === EBoostModalState.BOOSTING ? 'Boost' : 'Well done!';

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
						totalGIVpower={BN(givPower.balance)}
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
