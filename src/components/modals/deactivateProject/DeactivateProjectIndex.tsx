import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	Button,
	GLink,
	IconArchiving,
	semanticColors,
} from '@giveth/ui-design-system';

import { client } from '@/apollo/apolloClient';
import {
	DEACTIVATE_PROJECT,
	GET_STATUS_REASONS,
} from '@/apollo/gql/gqlProjects';
import QuestionBadge from '@/components/badges/QuestionBadge';
import FormProgress from '@/components/FormProgress';
import { Modal } from '../Modal';
import { IModal } from '@/types/common';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import DoneContent from './DoneContent';
import DeactivatingContent from './DeactivatingContent';
import WhyContent from './WhyContent';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { useProjectContext } from '@/context/project.context';

export interface ISelectObj {
	value: number;
	label: string;
}

const buttonLabels: { [key: string]: string }[] = [
	{ confirm: 'okay, do it', cancel: "nope, don't do it" },
	{ confirm: 'deactivate this project', cancel: 'cancel' },
	{ confirm: '', cancel: 'close' },
];

interface IDeactivateProjectModal extends IModal {
	projectId?: string;
}

const DeactivateProjectModal: FC<IDeactivateProjectModal> = ({
	projectId,
	setShowModal,
}) => {
	const [tab, setTab] = useState<number>(0);
	const [motive, setMotive] = useState<string>('');
	const [reasons, setReasons] = useState<ISelectObj[]>([]);
	const [selectedReason, setSelectedReason] = useState<ISelectObj | any>(
		undefined,
	);
	const dispatch = useAppDispatch();
	const isSignedIn = useAppSelector(state => state.user.isSignedIn);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { fetchProjectBySlug } = useProjectContext();

	const fetchReasons = async () => {
		const { data } = await client.query({
			query: GET_STATUS_REASONS,
			fetchPolicy: 'no-cache',
		});
		const fetchedReasons = data.getStatusReasons.map((elem: any) => ({
			label: elem.description,
			value: elem.id,
		}));
		setReasons(fetchedReasons);
	};

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target;
		setMotive(value);
	};

	const handleConfirmButton = async () => {
		if (!!tab && !!selectedReason) {
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
				return;
			}
			await client.mutate({
				mutation: DEACTIVATE_PROJECT,
				variables: {
					projectId: Number(projectId),
					reasonId: Number(selectedReason.value),
				},
			});
			await fetchProjectBySlug();
		}
		setTab(previousTab => previousTab + 1);
	};

	useEffect(() => {
		fetchReasons();
	}, [selectedReason]);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<IconArchiving />}
			headerTitle='Deactivating project'
			headerTitlePosition='left'
		>
			<Wrapper>
				<FormProgress progress={tab} steps={formSteps} />
				<TextWrapper>
					{tab === 0 && <DeactivatingContent />}
					{tab === 1 && (
						<WhyContent
							handleChange={handleChange}
							handleSelect={setSelectedReason}
							options={reasons}
							selectedOption={selectedReason}
							textInput={motive}
						/>
					)}
					{tab === 2 && <DoneContent />}
				</TextWrapper>
				<GivBackNotif>
					<QuestionBadge />
					<GLink>
						{tab < 2
							? 'You can reactivate later from your projects section under your account space!'
							: 'Your project is deactivated now, you can still find it on your own projects.'}
					</GLink>
				</GivBackNotif>
				{tab < 2 && (
					<ConfirmButton
						buttonType='secondary'
						size='small'
						label={buttonLabels[tab].confirm}
						onClick={handleConfirmButton}
						disabled={tab > 0 && !selectedReason}
					/>
				)}
				<CancelButton
					buttonType='texty'
					size='small'
					label={buttonLabels[tab].cancel}
					onClick={closeModal}
				/>
			</Wrapper>
		</Modal>
	);
};

const formSteps = ['Deactivating', 'Why?', 'Done'];

const Wrapper = styled.div`
	max-width: 500px;
	padding: 24px 24px 20px;
`;

const TextWrapper = styled.div`
	text-align: left;
	margin-top: 8px;
`;

const GivBackNotif = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 12px;
	padding: 16px;
	background: ${semanticColors.blueSky[100]};
	border-radius: 8px;
	border: 1px solid ${semanticColors.blueSky[700]};
	margin-top: 36px;
	color: ${semanticColors.blueSky[700]};
	text-align: left;
`;

const ConfirmButton = styled(Button)`
	text-transform: uppercase;
	width: 100%;
	margin-top: 12px;
`;

const CancelButton = styled(Button)`
	text-transform: uppercase;
	width: 100%;
	margin: 8px 0;

	&:hover {
		background-color: transparent;
	}
`;

export default DeactivateProjectModal;
