import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	B,
	brandColors,
	Button,
	mediaQueries,
	P,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { IModal } from '@/types/common';
import { Modal } from './Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import {
	StakeStepsContainer,
	StakeStep,
	StakeStepTitle,
	StakeStepNumber,
} from './StakeLock/StakeSteps.sc';
import { formatWeiHelper } from '@/helpers/number';

export enum MintStep {
	APPROVE,
	APPROVING,
	MINT,
	MINTING,
}

interface IMintModalProps extends IModal {
	qty: number;
	nftPrice: BigNumber;
}

export const MintModal: FC<IMintModalProps> = ({
	qty,
	nftPrice,
	setShowModal,
}) => {
	const [step, setStep] = useState(MintStep.APPROVE);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const { account, library } = useWeb3React();

	async function onApprove() {
		if (qty === 0) return;
		if (!library) {
			console.error('library is null');
			return;
		}

		setStep(MintStep.APPROVING);

		const signer = library.getSigner();

		const userAddress = await signer.getAddress();

		// const isApproved = await approveERC20tokenTransfer(
		// 	amount,
		// 	userAddress,
		// 	LM_ADDRESS,
		// 	POOL_ADDRESS,
		// 	library,
		// );

		// if (isApproved) {
		// 	setStep(MintStep.MINT);
		// } else {
		// 	setStep(MintStep.APPROVE);
		// }
	}

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
				<Price>{formatWeiHelper(nftPrice.multipliedBy(qty))} DAI</Price>
				<StyledButton
					size='small'
					label={formatMessage({
						id: 'label.approve',
					})}
					buttonType='primary'
					disabled={step === MintStep.APPROVING}
				/>
				<StyledButton
					size='small'
					label={formatMessage({
						id: 'label.cancel',
					})}
					buttonType='texty'
					disabled={step === MintStep.MINTING}
				/>
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

const StyledButton = styled(Button)`
	width: 100%;
	margin-bottom: 8px;
`;
