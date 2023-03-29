import { FC } from 'react';
import { Modal } from './Modal';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';

enum ClaimState {
	UNKNOWN,
	WAITING,
	SUBMITTING,
	CLAIMED,
	ERROR,
}

interface IClaimModal extends IModal {
	claimState: ClaimState;
	network: number;
	txStatus: any;
}

export const ClaimModal: FC<IClaimModal> = ({
	setShowModal,
	claimState,
	network,
	txStatus,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
			{claimState === ClaimState.WAITING && (
				<SubmittedInnerModal
					title='Waiting confirmation.'
					txHash={txStatus?.hash}
				/>
			)}
			{claimState === ClaimState.SUBMITTING && (
				<SubmittedInnerModal
					title='Submitting transaction.'
					txHash={txStatus?.hash}
				/>
			)}
			{claimState === ClaimState.CLAIMED && (
				<ConfirmedInnerModal
					title='Successful transaction.'
					txHash={txStatus?.hash}
				/>
			)}
			{claimState === ClaimState.ERROR && (
				<ErrorInnerModal
					title='Something went wrong.'
					txHash={txStatus?.hash}
				/>
			)}
		</Modal>
	);
};
