import {
	B,
	Flex,
	IconAlertTriangleOutline32,
	P,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useState, type FC } from 'react';
import styled from 'styled-components';
import { Framework } from '@superfluid-finance/sdk-core';
import { useAccount } from 'wagmi';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { ActionButton } from './ModifyStreamModal/ModifyStreamInnerModal';
import config, { isProduction } from '@/configuration';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import { getEthersProvider, getEthersSigner } from '@/helpers/ethers';
import { wagmiConfig } from '@/wagmiConfigs';
import {
	endRecurringDonation,
	reconcileRecurringDonation,
} from '@/services/donation';
import { showToastError } from '@/lib/helpers';
import {
	StreamStateUnknownError,
	getRecurringFlowState,
	runEndStreamFlow,
} from '@/helpers/recurringStream';
import { isUserRejectedError } from '@/helpers/transactionErrors';
import { isETHxToken } from '@/helpers/claimRecurringDonation';
import { findAnchorContractAddress } from '@/helpers/superfluid';

enum EEndStreamSteps {
	CONFIRM,
	ENDING,
	SUCCESS,
	// The stream was already gone on-chain (ended elsewhere or liquidated by
	// Superfluid), so no transaction was sent.
	ALREADY_ENDED,
}

export interface IEndStreamModalProps extends IModal {
	donation: IWalletRecurringDonation;
	refetch: () => void;
	recurringNetworkId: number;
}

export const EndStreamModal: FC<IEndStreamModalProps> = ({ ...props }) => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const { formatMessage } = useIntl();
	const handleCloseModal = (refetch?: boolean) => {
		if (refetch) {
			props.refetch();
		}
		closeModal();
	};

	return (
		<Modal
			closeModal={handleCloseModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.end_recurring_donation',
			})}
			headerTitlePosition='left'
			headerIcon={<IconAlertTriangleOutline32 />}
		>
			<EndStreamInnerModal {...props} closeModal={handleCloseModal} />
		</Modal>
	);
};

interface IEndStreamInnerModalProps extends IEndStreamModalProps {
	closeModal: (refetch?: boolean) => void;
	recurringNetworkId: number;
}

const EndStreamInnerModal: FC<IEndStreamInnerModalProps> = ({
	closeModal,
	donation,
	recurringNetworkId,
}) => {
	const [step, setStep] = useState(EEndStreamSteps.CONFIRM);
	const { formatMessage } = useIntl();
	const { address } = useAccount();

	const onDeleteStream = async () => {
		setStep(EEndStreamSteps.ENDING);
		try {
			if (!donation.project.anchorContracts.length) {
				throw new Error('Project Anchor contract address not found');
			}

			if (!address) {
				throw new Error('Please connect your wallet first');
			}

			const _superToken =
				recurringNetworkId === config.OPTIMISM_NETWORK_NUMBER
					? config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
							s => s.underlyingToken.symbol === donation.currency,
						)
					: config.BASE_CONFIG.SUPER_FLUID_TOKENS.find(
							s => s.underlyingToken.symbol === donation.currency,
						);

			if (!_superToken) {
				throw new Error('SuperToken not found');
			}
			const provider = await getEthersProvider(wagmiConfig);
			const signer = await getEthersSigner(wagmiConfig);
			if (!provider || !signer)
				throw new Error('Provider or signer not found');

			const _options = {
				chainId: recurringNetworkId,
				provider: provider,
				resolverAddress: isProduction
					? undefined
					: '0x554c06487bEc8c890A0345eb05a5292C1b1017Bd',
			};
			const sf = await Framework.create(_options);

			let superToken;
			if (isETHxToken(_superToken)) {
				superToken = await sf.loadNativeAssetSuperToken(_superToken.id);
			} else {
				superToken = await sf.loadWrapperSuperToken(_superToken.id);
			}

			const anchorAddress = findAnchorContractAddress(
				donation.project.anchorContracts,
				recurringNetworkId,
			);
			if (!anchorAddress) {
				throw new Error('Project Anchor contract address not found');
			}
			const recurringDonationId = parseInt(donation.id);

			const result = await runEndStreamFlow({
				getFlowState: () =>
					getRecurringFlowState(
						sf,
						_superToken.id,
						address,
						anchorAddress,
						provider,
					),
				executeDeleteFlow: () =>
					superToken
						.deleteFlow({
							sender: address,
							receiver: anchorAddress,
						})
						.exec(signer),
				endRecurringDonation: txHash =>
					endRecurringDonation({
						recurringDonationId,
						projectId: +donation.project.id,
						chainId: recurringNetworkId,
						txHash,
						superToken: _superToken,
					}),
				reconcileRecurringDonation: () =>
					reconcileRecurringDonation(recurringDonationId),
			});

			setStep(
				result.outcome === 'already_ended'
					? EEndStreamSteps.ALREADY_ENDED
					: EEndStreamSteps.SUCCESS,
			);
			if (!result.backendSynced) {
				showToastError(
					formatMessage({
						id: 'component.end_stream_modal.backend_sync_failed',
					}),
				);
			}
		} catch (error: any) {
			setStep(EEndStreamSteps.CONFIRM);
			if (error instanceof StreamStateUnknownError) {
				showToastError(
					formatMessage({
						id: 'component.end_stream_modal.ended_check_failed',
					}),
				);
			} else if (!isUserRejectedError(error)) {
				showToastError(error);
			}
			console.error('Error on recurring donation', { error });
		}
	};

	if (step === EEndStreamSteps.CONFIRM || step === EEndStreamSteps.ENDING) {
		return (
			<Wrapper>
				<InlineToast
					type={EToastType.Error}
					message={formatMessage({
						id: 'component.end_stream_modal.confirm_question',
					})}
				/>
				<Flex gap='16px'>
					<ActionButton
						label={formatMessage({ id: 'label.cancel' })}
						onClick={() => closeModal(false)}
						buttonType='texty-gray'
						disabled={step === EEndStreamSteps.ENDING}
					/>
					<ActionButton
						label={formatMessage({ id: 'label.confirm' })}
						onClick={() => onDeleteStream()}
						disabled={step === EEndStreamSteps.ENDING}
						loading={step === EEndStreamSteps.ENDING}
					/>
				</Flex>
			</Wrapper>
		);
	}

	const isAlreadyEnded = step === EEndStreamSteps.ALREADY_ENDED;
	return (
		<Wrapper>
			<CenteredB>
				{formatMessage({
					id: isAlreadyEnded
						? 'component.end_stream_modal.already_ended_title'
						: 'component.end_stream_modal.ended_title',
				})}
			</CenteredB>
			<P>
				{formatMessage(
					{
						id: isAlreadyEnded
							? 'component.end_stream_modal.already_ended_description'
							: 'component.end_stream_modal.ended_description',
					},
					{
						name: donation.project.title,
					},
				)}
			</P>
			<ActionButton
				label={formatMessage({ id: 'label.done' })}
				onClick={() => closeModal(true)}
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	text-align: left;
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	gap: 16px;
	width: 100%;
	padding: 16px 24px 24px 24px;
	${mediaQueries.tablet} {
		width: 530px;
	}
`;

const CenteredB = styled(B)`
	text-align: center;
`;
