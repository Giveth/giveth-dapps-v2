import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { B, brandColors, mediaQueries, P } from '@giveth/ui-design-system';
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
	qty: number;
	nftPrice: number;
}

export const MintModal: FC<IMintModalProps> = ({
	qty,
	nftPrice,
	setShowModal,
}) => {
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
						<StakeStepTitle>
							{' '}
							{formatMessage({ id: 'label.approve' })}
						</StakeStepTitle>
						<StakeStepNumber>1</StakeStepNumber>
					</StakeStep>
					<StakeStep>
						<StakeStepTitle disable={step !== MintStep.MINT}>
							{formatMessage({ id: 'label.mint' })}
						</StakeStepTitle>
						<StakeStepNumber disable={step !== MintStep.MINT}>
							2
						</StakeStepNumber>
					</StakeStep>
				</StakeStepsContainer>
				<Desc>
					You are Minting {qty} Giver NFT {qty > 1 && 's'} for{' '}
				</Desc>
				<Price>{qty * nftPrice}</Price>
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

const Desc = styled(P)`
	margin-top: 24px;
	margin-bottom: 8px;
	color: ${brandColors.giv[300]};
`;

const Price = styled(B)`
	margin-bottom: 32px;
	color: ${brandColors.giv['000']};
`;
