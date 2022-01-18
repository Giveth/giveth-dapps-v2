import { FC } from 'react';
import { IModal, Modal } from './Modal';
import {
	ConfirmedInnerModal,
	ErrorInnerModal,
	SubmittedInnerModal,
} from './ConfirmSubmit';

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
	showModal,
	setShowModal,
	claimState,
	network,
	txStatus,
}) => {
	return (
		<Modal showModal={showModal} setShowModal={setShowModal}>
			{claimState === ClaimState.WAITING && (
				<SubmittedInnerModal
					title='Waiting confirmation.'
					walletNetwork={network}
					txHash={txStatus?.hash}
				/>
			)}
			{claimState === ClaimState.SUBMITTING && (
				<SubmittedInnerModal
					title='Submitting transaction.'
					walletNetwork={network}
					txHash={txStatus?.hash}
				/>
			)}
			{claimState === ClaimState.CLAIMED && (
				<ConfirmedInnerModal
					title='Successful transaction.'
					walletNetwork={network}
					txHash={txStatus?.hash}
				/>
			)}
			{claimState === ClaimState.ERROR && (
				<ErrorInnerModal
					title='Something went wrong.'
					walletNetwork={network}
					txHash={txStatus?.hash}
				/>
			)}
		</Modal>
	);
};
