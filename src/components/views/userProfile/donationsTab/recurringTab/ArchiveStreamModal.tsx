import {
	B,
	Flex,
	IconAlertTriangleOutline32,
	Lead,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useState, type FC } from 'react';
import styled from 'styled-components';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { ActionButton } from './ModifyStreamModal/ModifyStreamInnerModal';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import config from '@/configuration';
import { UPDATE_RECURRING_DONATION } from '@/apollo/gql/gqlSuperfluid';
import { client } from '@/apollo/apolloClient';

enum EArchiveStreamSteps {
	CONFIRM,
	ARCHIVING,
	SUCCESS,
}

export interface IArchiveStreamModalProps extends IModal {
	donation: IWalletRecurringDonation;
	refetch: () => void;
}

export const ArchiveStreamModal: FC<IArchiveStreamModalProps> = ({
	...props
}) => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const [step, setStep] = useState(EArchiveStreamSteps.CONFIRM);
	const { formatMessage } = useIntl();
	const handleCloseModal = () => {
		if (step === EArchiveStreamSteps.SUCCESS) {
			props.refetch();
			closeModal();
		} else {
			closeModal();
		}
	};
	return (
		<Modal
			closeModal={handleCloseModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.archive_stream',
			})}
			headerTitlePosition='left'
			headerIcon={<IconAlertTriangleOutline32 />}
		>
			<ArchiveStreamInnerModal step={step} setStep={setStep} {...props} />
		</Modal>
	);
};

interface IArchiveStreamInnerModalProps extends IArchiveStreamModalProps {
	step: EArchiveStreamSteps;
	setStep: (step: EArchiveStreamSteps) => void;
}

const ArchiveStreamInnerModal: FC<IArchiveStreamInnerModalProps> = ({
	setShowModal,
	donation,
	refetch,
	step,
	setStep,
}) => {
	const { formatMessage } = useIntl();

	const onArchive = async () => {
		setStep(EArchiveStreamSteps.ARCHIVING);
		try {
			const { data } = await client.mutate({
				mutation: UPDATE_RECURRING_DONATION,
				variables: {
					projectId: +donation.project.id,
					networkId: config.OPTIMISM_NETWORK_NUMBER,
					currency: donation.currency,
					isArchived: true,
				},
			});
			console.log('data', data);
			setStep(EArchiveStreamSteps.SUCCESS);
		} catch (error) {
			setStep(EArchiveStreamSteps.CONFIRM);
		}
	};

	return step === EArchiveStreamSteps.CONFIRM ||
		step === EArchiveStreamSteps.ARCHIVING ? (
		<Wrapper>
			<Lead>
				{formatMessage({
					id: 'component.archive_stream_modal.confirm_question',
				})}
			</Lead>
			<Flex gap='16px'>
				<ActionButton
					label={formatMessage({ id: 'label.cancel' })}
					onClick={() => setShowModal(false)}
					buttonType='texty-gray'
					disabled={step === EArchiveStreamSteps.ARCHIVING}
				/>
				<ActionButton
					label={formatMessage({
						id: 'component.archive_stream_modal.confirm_button',
					})}
					onClick={() => onArchive()}
					disabled={step === EArchiveStreamSteps.ARCHIVING}
					loading={step === EArchiveStreamSteps.ARCHIVING}
				/>
			</Flex>
		</Wrapper>
	) : (
		<Wrapper>
			<CenteredB>
				{formatMessage({
					id: 'component.archive_stream_modal.archived_title',
				})}
			</CenteredB>
			<ActionButton
				label={formatMessage({ id: 'label.done' })}
				onClick={() => {
					refetch();
					setShowModal(false);
				}}
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