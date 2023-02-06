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
import { Contract } from 'ethers';
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
import { approveERC20tokenTransfer } from '@/lib/stakingPool';
import config from '@/configuration';
import { GiversPFP } from '@/types/contracts';
import { abi as PFP_ABI } from '@/artifacts/pfpGiver.json';
import { EPFPMinSteps, usePFPMintData } from '@/context/pfpmint.context';

export enum MintStep {
	APPROVE,
	APPROVING,
	MINT,
	MINTING,
}

interface IMintModalProps extends IModal {
	qty: number;
	nftPrice?: BigNumber;
}

export const MintModal: FC<IMintModalProps> = ({
	qty,
	nftPrice,
	setShowModal,
}) => {
	const [step, setStep] = useState(MintStep.APPROVE);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const { library } = useWeb3React();
	const { setStep: setMintStep, setTx } = usePFPMintData();

	const price = nftPrice ? nftPrice.multipliedBy(qty) : new BigNumber(0);

	async function approveHandler() {
		if (price.isZero()) return;
		if (!library) {
			console.error('library is null');
			return;
		}
		if (!config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS) return;
		if (!config.MAINNET_CONFIG.DAI_CONTRACT_ADDRESS) return;

		setStep(MintStep.APPROVING);
		try {
			const signer = library.getSigner();

			const userAddress = await signer.getAddress();

			const isApproved = await approveERC20tokenTransfer(
				price.toString(),
				userAddress,
				config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS,
				config.MAINNET_CONFIG.DAI_CONTRACT_ADDRESS,
				library,
			);

			if (isApproved) {
				setStep(MintStep.MINT);
			} else {
				setStep(MintStep.APPROVE);
			}
		} catch (error) {
			setStep(MintStep.APPROVE);
			console.log('error on approve dai', error);
		}
	}

	async function mintHandle() {
		if (!library) {
			console.error('library is null');
			return;
		}
		if (!config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS) return;

		setStep(MintStep.MINTING);
		try {
			const signer = library.getSigner();
			const PFPContract = new Contract(
				config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS ?? '',
				PFP_ABI,
				signer,
			) as GiversPFP;
			console.log('PFPContract', PFPContract, price.toString());
			const tx = await PFPContract.mint(qty);
			setTx(tx.hash);
			console.log('tx', tx);
			const res = await tx.wait();
			console.log('res', res);

			if (res.status) {
				setMintStep(EPFPMinSteps.SUCCESS);
				closeModal();
			} else {
				setMintStep(EPFPMinSteps.FAILURE);
			}
		} catch (error) {
			setMintStep(EPFPMinSteps.FAILURE);
			console.log('error on mint', error);
		}
	}

	const isApproving =
		step === MintStep.APPROVE || step === MintStep.APPROVING;

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
						<StakeStepTitle disable={isApproving}>
							{formatMessage({ id: 'label.mint' })}
						</StakeStepTitle>
						<StakeStepNumber disable={isApproving}>
							2
						</StakeStepNumber>
					</StakeStep>
				</StakeStepsContainer>
				<Desc>
					You are Minting {qty} Giver NFT {qty > 1 && 's'} for{' '}
				</Desc>
				<Price>{formatWeiHelper(price)} DAI</Price>
				{isApproving ? (
					<StyledButton
						size='small'
						label={formatMessage({
							id: 'label.approve',
						})}
						buttonType='primary'
						loading={step === MintStep.APPROVING}
						disabled={step === MintStep.APPROVING}
						onClick={approveHandler}
					/>
				) : (
					<StyledButton
						size='small'
						label={formatMessage({
							id: 'label.mint',
						})}
						buttonType='primary'
						loading={step === MintStep.MINTING}
						disabled={step === MintStep.MINTING}
						onClick={mintHandle}
					/>
				)}
				<StyledButton
					size='small'
					label={formatMessage({
						id: 'label.cancel',
					})}
					buttonType='texty'
					onClick={closeModal}
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
