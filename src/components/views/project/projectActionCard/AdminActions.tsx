import {
	Button,
	ButtonLink,
	IconArchiving,
	IconEdit16,
	IconVerifiedBadge16,
	OutlineButton,
	brandColors,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { useProjectContext } from '@/context/project.context';
import { VerificationModal } from '@/components/modals/VerificationModal';
import DeactivateProjectModal from '@/components/modals/deactivateProject/DeactivateProjectIndex';
import { client } from '@/apollo/apolloClient';
import { ACTIVATE_PROJECT } from '@/apollo/gql/gqlProjects';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { showToastError } from '@/lib/helpers';
import { Dropdown, IOption, OptionType } from '@/components/Dropdown';
import { idToProjectEdit } from '@/lib/routeCreators';

export const AdminActions = () => {
	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const [deactivateModal, setDeactivateModal] = useState<boolean>(false);
	const [activateLoading, setActivateLoading] = useState(false);

	const { projectData, isActive, fetchProjectBySlug } = useProjectContext();
	const { formatMessage } = useIntl();
	const { isSignedIn } = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const router = useRouter();

	const activeProject = async () => {
		setActivateLoading(true);
		try {
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
				return;
			}
			await client.mutate({
				mutation: ACTIVATE_PROJECT,
				variables: { projectId: Number(projectData?.id || '') },
			});
			await fetchProjectBySlug();
		} catch (e) {
			showToastError(e);
			captureException(e, {
				tags: {
					section: 'handleProjectStatus',
				},
			});
		} finally {
			setActivateLoading(false);
		}
	};

	const options: IOption[] = [
		{
			label: formatMessage({
				id: 'label.edit',
			}),
			type: OptionType.ITEM,
			icon: <IconEdit16 />,
			cb: () => router.push(idToProjectEdit(projectData?.id || '')),
		},
		{
			label: formatMessage({
				id: 'label.verify_your_project',
			}),
			type: OptionType.ITEM,
			icon: <IconVerifiedBadge16 />,
			cb: () => setShowVerificationModal(true),
		},
		{
			label: formatMessage({
				id: isActive
					? 'label.deactivate_project'
					: 'label.activate_project',
			}),
			type: OptionType.ITEM,
			icon: <IconArchiving size={16} />,
			cb: () => {
				console.log('verify');
				isActive ? setDeactivateModal(true) : activeProject();
			},
		},
	];

	return (
		<>
			<Dropdown label='Project Actions' options={options} />
			{showVerificationModal && (
				<VerificationModal
					onClose={() => setShowVerificationModal(false)}
				/>
			)}
			{deactivateModal && (
				<DeactivateProjectModal
					setShowModal={setDeactivateModal}
					projectId={projectData?.id}
				/>
			)}
		</>
	);
};

const EditButton = styled(ButtonLink)`
	width: 100%;
	flex-direction: row-reverse;
	gap: 8px;
	box-shadow: 0px 3px 20px rgba(83, 38, 236, 0.13);
	padding: 16px 24px;
	&:hover {
		color: ${brandColors.giv[300]};
	}
	transition: color 0.3s ease;
`;

const VerifyButton = styled(OutlineButton)`
	width: 100%;
	flex-direction: row-reverse;
	gap: 8px;
	padding: 16px 24px;
	color: ${brandColors.giv[500]};
	border: 2px solid ${brandColors.giv[500]};
	&:hover {
		border: 2px solid ${brandColors.giv[300]};
		color: ${brandColors.giv[300]};
	}
`;

const ActiveButton = styled(Button)`
	width: 100%;
	flex-direction: row-reverse;
	gap: 8px;
	color: ${semanticColors.golden[700]};
	&:hover {
		color: ${semanticColors.golden[500]};
	}
	& > div[loading='1'] > div {
		left: 0;
	}
`;
