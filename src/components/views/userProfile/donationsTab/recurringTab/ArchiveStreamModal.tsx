import {
	Flex,
	H3,
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
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.archive_stream',
			})}
			headerTitlePosition='left'
			headerIcon={<IconAlertTriangleOutline32 />}
		>
			<ArchiveStreamInnerModal {...props} />
		</Modal>
	);
};

interface IArchiveStreamInnerModalProps extends IArchiveStreamModalProps {}

const ArchiveStreamInnerModal: FC<IArchiveStreamInnerModalProps> = ({
	setShowModal,
	donation,
	refetch,
}) => {
	const [step, setStep] = useState(EArchiveStreamSteps.CONFIRM);
	const { formatMessage } = useIntl();

	const onArchive = async () => {
		setStep(EArchiveStreamSteps.ARCHIVING);
		try {
			const { data } = await client.mutate({
				mutation: UPDATE_RECURRING_DONATION,
				variables: {
					projectId: +donation.project.id,
					chainId: config.OPTIMISM_NETWORK_NUMBER,
					currency: donation.currency,
				},
			});
			console.log('data', data);
			refetch();
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
			<H3 weight={700}>
				{formatMessage({
					id: 'component.archive_stream_modal.archived_title',
				})}
			</H3>
			<ActionButton
				label={formatMessage({ id: 'label.done' })}
				onClick={() => {
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
