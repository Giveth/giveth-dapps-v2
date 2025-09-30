import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	ButtonLink,
	mediaQueries,
	semanticColors,
	Flex,
	IconBookmarkFilled16,
	IconBookmark16,
	brandColors,
} from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { EProjectType } from '@/apollo/types/gqlEnums';
import useDetectDevice from '@/hooks/useDetectDevice';
import ShareModal from '@/components/modals/ShareModal';
import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import { EContentType, EContentTypeCause } from '@/lib/constants/shareContent';
import { useProjectContext } from '@/context/project.context';
import { useAppSelector } from '@/features/hooks';
import { isSSRMode, showToastError } from '@/lib/helpers';
import { useModalCallback } from '@/hooks/useModalCallback';

import { bookmarkProject, unBookmarkProject } from '@/lib/reaction';
import { FETCH_PROJECT_REACTION_BY_ID } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import {
	slugToCauseDonate,
	slugToProjectDonate,
	slugToProjectDonateStellar,
} from '@/lib/routeCreators';
import { BadgeButton } from '@/components/project-card/ProjectCardBadgeButtons';
import config from '@/configuration';
import { getActiveRound } from '@/helpers/qf';

export const ProjectPublicActions = () => {
	const [showModal, setShowShareModal] = useState<boolean>(false);
	const { projectData, isActive, isCause } = useProjectContext();
	const project = projectData!;
	const { slug, id: projectId } = project;
	const [reaction, setReaction] = useState(project.reaction);
	const { isMobile } = useDetectDevice();
	const [likeLoading, setLikeLoading] = useState(false);
	const {
		isSignedIn,
		userData: user,
		isEnabled,
	} = useAppSelector(state => state.user);
	const { formatMessage } = useIntl();
	const { open: openConnectModal } = useWeb3Modal();
	const { activeStartedRound } = getActiveRound(projectData?.qfRounds);

	// Check if the project has only one address and it is a Stellar address
	const isOnlyStellar =
		project?.addresses?.length === 1 &&
		project?.addresses[0]?.chainType === 'STELLAR';

	const isStellarOnlyRound =
		activeStartedRound?.eligibleNetworks?.length === 1 &&
		activeStartedRound?.eligibleNetworks[0] ===
			config.STELLAR_NETWORK_NUMBER;

	useEffect(() => {
		const fetchProjectReaction = async () => {
			if (user?.id && project.id) {
				try {
					const { data } = await client.query({
						query: FETCH_PROJECT_REACTION_BY_ID,
						variables: {
							id: Number(project.id),
							connectedWalletUserId: Number(user?.id),
						},
						fetchPolicy: 'no-cache',
					});
					const _reaction = data?.projectById?.reaction;
					setReaction(_reaction);
				} catch (e) {
					showToastError(e);
					captureException(e, {
						tags: {
							section: 'fetchProjectReaction',
						},
					});
				}
			} else {
				setReaction(undefined);
			}
		};
		fetchProjectReaction();
	}, [project.id, user?.id]);

	const likeUnlikeProject = async () => {
		if (projectId) {
			setLikeLoading(true);

			try {
				if (!reaction) {
					const newReaction = await bookmarkProject(projectId);
					setReaction(newReaction);
				} else if (reaction?.userId === user?.id) {
					const successful = await unBookmarkProject(reaction.id);
					if (successful) {
						setReaction(undefined);
					}
				}
			} catch (e) {
				showToastError(e);
				captureException(e, {
					tags: {
						section: 'likeUnlikeProject',
					},
				});
			} finally {
				setLikeLoading(false);
			}
		}
	};

	const { modalCallback: signInThenLike } =
		useModalCallback(likeUnlikeProject);

	const checkSignInThenLike = () => {
		if (isSSRMode) return;
		if (!isEnabled) {
			openConnectModal?.();
		} else if (!isSignedIn) {
			signInThenLike();
		} else {
			likeUnlikeProject();
		}
	};

	return (
		<ProjectPublicActionsWrapper gap='16px'>
			<Link
				id='Donate_Project'
				href={
					isActive
						? isStellarOnlyRound
							? slugToProjectDonateStellar(slug || '')
							: isCause
								? slugToCauseDonate(slug || '')
								: isOnlyStellar
									? slugToProjectDonateStellar(slug || '')
									: slugToProjectDonate(slug || '')
						: '#'
				}
				onClick={e => !isActive && e.preventDefault()}
				style={{ pointerEvents: !isActive ? 'none' : 'auto' }}
			>
				<DonateButton
					label={formatMessage({ id: 'label.donate' })}
					disabled={!isActive}
					linkType='primary'
				/>
			</Link>
			<BadgeWrapper gap='4px'>
				<ShareLikeBadge
					onClick={() => isActive && setShowShareModal(true)}
					isSimple={isMobile}
				/>
				<StyledBadgeButton
					$isLoading={likeLoading}
					onClick={likeLoading ? undefined : checkSignInThenLike}
				>
					{reaction?.userId && reaction?.userId === user?.id ? (
						<IconBookmarkFilled16 color={brandColors.pinky[500]} />
					) : (
						<IconBookmark16 color='#525f7f' />
					)}
				</StyledBadgeButton>
			</BadgeWrapper>
			{showModal && slug && (
				<ShareModal
					contentType={
						project.projectType === EProjectType.CAUSE
							? EContentTypeCause.detailsPage
							: EContentType.thisProject
					}
					isCause={project.projectType === EProjectType.CAUSE}
					numberOfProjects={project.causeProjects?.length || 0}
					setShowModal={setShowShareModal}
					projectHref={slug}
				/>
			)}
		</ProjectPublicActionsWrapper>
	);
};

const ProjectPublicActionsWrapper = styled(Flex)`
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	${mediaQueries.tablet} {
		flex-direction: row-reverse;
		justify-content: space-between;
	}
	${mediaQueries.laptopS} {
		flex-direction: column;
	}
`;

const AlreadyDonatedWrapper = styled(Flex)`
	margin: 4px 0;
	gap: 8px;
	color: ${semanticColors.jade[500]};
`;

const DonateButton = styled(ButtonLink)`
	min-width: 220px;
`;

const BadgeWrapper = styled(Flex)`
	justify-content: space-between;
`;

const StyledBadgeButton = styled(BadgeButton)`
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	width: 48px;
	border-radius: 24px;
	padding: 0 16px;
	&::after {
		border-radius: 24px;
	}
`;
