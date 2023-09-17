import {
	IconArchiving,
	IconChevronDown24,
	IconEdit16,
	IconShare16,
	IconVerifiedBadge16,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useProjectContext } from '@/context/project.context';
import { VerificationModal } from '@/components/modals/VerificationModal';
import DeactivateProjectModal from '@/components/modals/deactivateProject/DeactivateProjectIndex';
import { client } from '@/apollo/apolloClient';
import { ACTIVATE_PROJECT } from '@/apollo/gql/gqlProjects';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { capitalizeAllWords, showToastError } from '@/lib/helpers';
import { Dropdown, IOption, OptionType } from '@/components/Dropdown';
import { idToProjectEdit } from '@/lib/routeCreators';
import ShareModal from '@/components/modals/ShareModal';
import ShareRewardedModal from '@/components/modals/ShareRewardedModal';
import { EContentType } from '@/lib/constants/shareContent';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Modal } from '@/components/modals/Modal';

interface IMobileActionsModalProps {
	setShowModal: (value: boolean) => void;
	children: React.ReactNode;
}

export const AdminActions = () => {
	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const [deactivateModal, setDeactivateModal] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const [showMobileActionsModal, setShowMobileActionsModal] = useState(false);
	const { projectData, isActive, fetchProjectBySlug } = useProjectContext();
	const project = projectData!;
	const { slug, id: projectId, verified } = project;
	const { formatMessage } = useIntl();
	const { isSignedIn } = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const isMobile = !useMediaQuery(device.tablet);

	const activeProject = async () => {
		try {
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
				return;
			}
			await client.mutate({
				mutation: ACTIVATE_PROJECT,
				variables: { projectId: Number(projectId || '') },
			});
			await fetchProjectBySlug();
		} catch (e) {
			showToastError(e);
			captureException(e, {
				tags: {
					section: 'handleProjectStatus',
				},
			});
		}
	};

	const options: IOption[] = [
		{
			label: formatMessage({
				id: 'label.edit_project',
			}),
			type: OptionType.ITEM,
			icon: <IconEdit16 />,
			cb: () => router.push(idToProjectEdit(projectData?.id || '')),
		},
		{
			label: capitalizeAllWords(
				formatMessage({
					id: 'label.verify_your_project',
				}),
			),
			type: OptionType.ITEM,
			icon: <IconVerifiedBadge16 />,
			cb: () => setShowVerificationModal(true),
			disabled: verified,
		},
		{
			label: capitalizeAllWords(
				formatMessage({
					id: isActive
						? 'label.deactivate_project'
						: 'label.activate_project',
				}),
			),
			type: OptionType.ITEM,
			icon: <IconArchiving size={16} />,
			cb: () => {
				console.log('verify');
				isActive ? setDeactivateModal(true) : activeProject();
			},
		},
		{
			label: formatMessage({
				id: verified ? 'label.share_and_get_rewarded' : 'label.share',
			}),
			type: OptionType.ITEM,
			icon: <IconShare16 />,
			cb: () => setShowShareModal(true),
		},
	];

	const dropdownStyle = {
		padding: '10px 16px',
		background: neutralColors.gray[300],
		borderRadius: '8px',
	};

	return !isMobile ? (
		<Wrapper>
			<Dropdown
				style={dropdownStyle}
				label='Project Actions'
				options={isActive ? options : [options[0], options[2]]}
			/>
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
			{showShareModal &&
				(verified ? (
					<ShareRewardedModal
						contentType={EContentType.thisProject}
						setShowModal={setShowShareModal}
						projectHref={slug}
						projectTitle={project.title}
					/>
				) : (
					<ShareModal
						contentType={EContentType.thisProject}
						setShowModal={setShowShareModal}
						projectHref={slug}
					/>
				))}
		</Wrapper>
	) : (
		<MobileWrapper
			gap='4px'
			onClick={() => setShowMobileActionsModal(true)}
		>
			<div>Project Actions</div>
			<IconChevronDown24 />
			{showMobileActionsModal && (
				<MobileActionsModal setShowModal={setShowMobileActionsModal}>
					{options.map(option => (
						<MobileActionModalItem
							key={option.label}
							onClick={option.cb}
						>
							<Flex gap='8px'>
								<Flex alignItems='center'>{option.icon}</Flex>
								<div>{option.label}</div>
							</Flex>
						</MobileActionModalItem>
					))}
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
					{showShareModal &&
						(verified ? (
							<ShareRewardedModal
								contentType={EContentType.thisProject}
								setShowModal={setShowShareModal}
								projectHref={slug}
								projectTitle={project.title}
							/>
						) : (
							<ShareModal
								contentType={EContentType.thisProject}
								setShowModal={setShowShareModal}
								projectHref={slug}
							/>
						))}
				</MobileActionsModal>
			)}
		</MobileWrapper>
	);
};

const MobileActionsModal: FC<IMobileActionsModalProps> = ({
	setShowModal,
	children,
}) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition='left'
		>
			{children}
		</Modal>
	);
};

const Wrapper = styled.div`
	order: 1;
	margin-bottom: 16px;
	${mediaQueries.tablet} {
		margin-bottom: unset;
		order: unset;
	}
`;

const MobileWrapper = styled(FlexCenter)`
	padding: 10px 16px;
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
`;

const MobileActionModalItem = styled(Flex)`
	padding: 16px 24px;
	border-bottom: ${neutralColors.gray[400]} 1px solid;
`;
