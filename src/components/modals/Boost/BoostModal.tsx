import { IconRocketInSpace32 } from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';

import { useModalAnimation } from '@/hooks/useModalAnimation';
import 'rc-slider/assets/index.css';
import { ZeroGivpowerModal } from './ZeroGivpowerModal';
import { BoostModalContainer } from './BoostModal.sc';
import BoostedInnerModal from './BoostedInnerModal';
import BoostInnerModal from './BoostInnerModal';
import { BN } from '@/helpers/number';
import { client } from '@/apollo/apolloClient';
import { FETCH_POWER_BOOSTING_INFO } from '@/apollo/gql/gqlPowerBoosting';
import { IPowerBoosting } from '@/apollo/types/types';
import { useAppSelector } from '@/features/hooks';

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
	const [loading, setLoading] = useState(false);
	const [isFirst, setIsFirst] = useState(false);
	const user = useAppSelector(state => state.user.userData);

	useEffect(() => {
		if (!user) return;

		const fetchUserBoosts = async () => {
			setLoading(true);
			const { data } = await client.query({
				query: FETCH_POWER_BOOSTING_INFO,
				variables: {
					take: 1,
					skip: 0,
					userId: parseFloat(user.id || '') || -1,
				},
			});
			setLoading(false);
			if (data?.getPowerBoosting) {
				const powerBoostings: IPowerBoosting[] =
					data.getPowerBoosting.powerBoostings;
				setIsFirst(powerBoostings.length === 0);
			}
		};
		fetchUserBoosts().then();
	}, [user]);

	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.xDaiValues),
	);
	const givPower = sdh.getUserGIVPowerBalance();

	if (givPower.balance == '0') {
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
