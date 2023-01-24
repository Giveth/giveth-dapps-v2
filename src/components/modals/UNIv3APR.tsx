import { FC } from 'react';
import styled from 'styled-components';
import { P, Button } from '@giveth/ui-design-system';
import { Modal } from './Modal';
import { PoolStakingConfig } from '@/types/config';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { mediaQueries } from '@/lib/constants/constants';

interface IUniV3APRModal extends IModal {
	poolStakingConfig: PoolStakingConfig;
}

export const UniV3APRModal: FC<IUniV3APRModal> = ({
	setShowModal,
	poolStakingConfig,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
			<APRModalContainer>
				<P>
					Concentrate your liquidity for higher APRs. The narrower
					your price range, the more GIV you get.
				</P>
				<OKButton
					onClick={() => {
						window.open(poolStakingConfig.provideLiquidityLink);
						closeModal();
					}}
					label='OK'
					buttonType='primary'
				/>
			</APRModalContainer>
		</Modal>
	);
};

const APRModalContainer = styled.div`
	padding: 48px 32px 16px;
	margin-bottom: 22px;
	width: 100%;
	${mediaQueries.tablet} {
		width: 370px;
	}
`;

const OKButton = styled(Button)`
	margin-top: 24px;
	width: 100%;
`;
