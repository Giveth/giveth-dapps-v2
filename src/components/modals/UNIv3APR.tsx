import { FC } from 'react';
import { Modal, IModal } from './Modal';
import styled from 'styled-components';
import { P, Button } from '@giveth/ui-design-system';
import { PoolStakingConfig } from '@/types/config';

interface IUniV3APRModal extends IModal {
	poolStakingConfig: PoolStakingConfig;
}

export const UniV3APRModal: FC<IUniV3APRModal> = ({
	showModal,
	setShowModal,
	poolStakingConfig,
}) => {
	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			<APRModalContainer>
				<P>
					Concentrate your liquidity for higher APRs. The narrower
					your price range, the more GIV you get.
				</P>
				<OKButton
					onClick={() => {
						window.open(poolStakingConfig.provideLiquidityLink);
						setShowModal(false);
					}}
					label='OK'
					buttonType='primary'
				/>
			</APRModalContainer>
		</Modal>
	);
};

const APRModalContainer = styled.div`
	width: 370px;
	padding: 48px 32px 16px;
	margin-bottom: 22px;
`;

const OKButton = styled(Button)`
	margin-top: 24px;
	width: 100%;
`;
