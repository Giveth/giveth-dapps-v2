import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { mediaQueries } from '@giveth/ui-design-system';
import { IModal } from '@/types/common';
import { Modal } from './Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import {
	StakeStepsContainer,
	StakeStep,
	StakeStepTitle,
	StakeStepNumber,
} from './StakeLock/StakeSteps.sc';

export enum MintStep {
	APPROVE,
	MINT,
}

interface IMintModalProps extends IModal {
	maxQty: number;
}

export const MintModal: FC<IMintModalProps> = (maxQty, setShowModal) => {
	const [step, setStep] = useState(MintStep.APPROVE);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({ id: 'label.mint' })}
			headerTitlePosition='left'
		>
			<MintModalContainer>
				<StakeStepsContainer>
					<StakeStep>
						<StakeStepTitle>Approve</StakeStepTitle>
						<StakeStepNumber>1</StakeStepNumber>
					</StakeStep>
					<StakeStep>
						<StakeStepTitle disable={step !== MintStep.MINT}>
							Stake
						</StakeStepTitle>
						<StakeStepNumber disable={step !== MintStep.MINT}>
							2
						</StakeStepNumber>
					</StakeStep>
				</StakeStepsContainer>
			</MintModalContainer>
		</Modal>
	);
};

const MintModalContainer = styled.div`
	padding: 16px 24px;
	margin-bottom: 22px;
	width: 100%;
	${mediaQueries.tablet} {
		width: 370px;
	}
`;
