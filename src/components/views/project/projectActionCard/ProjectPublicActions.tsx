import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	Button,
	ButtonLink,
	IconHeartFilled16,
	IconHeartOutline16,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import useDetectDevice from '@/hooks/useDetectDevice';
import ShareModal from '@/components/modals/ShareModal';
import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import ShareRewardedModal from '@/components/modals/ShareRewardedModal';
import { EContentType } from '@/lib/constants/shareContent';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { isSSRMode, showToastError } from '@/lib/helpers';
import { useModalCallback } from '@/hooks/useModalCallback';
import {
	incrementLikedProjectsCount,
	decrementLikedProjectsCount,
} from '@/features/user/user.slice';
import { likeProject, unlikeProject } from '@/lib/reaction';
import { FETCH_PROJECT_REACTION_BY_ID } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { slugToProjectDonate } from '@/lib/routeCreators';

export const ProjectPublicActions = () => {
	const [showModal, setShowShareModal] = useState<boolean>(false);
	const { projectData, isActive } = useProjectContext();
	const project = projectData!;
	const { slug, id: projectId, verified } = project;
	const [reaction, setReaction] = useState(project.reaction);
	const [totalReactions, setTotalReactions] = useState(
		project.totalReactions,
	);
	const { isMobile } = useDetectDevice();
	const [likeLoading, setLikeLoading] = useState(false);
	const {
		isSignedIn,
		userData: user,
		isEnabled,
	} = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();
	const { openConnectModal } = useConnectModal();

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
					const _totalReactions = data?.projectById?.totalReactions;
					const _reaction = data?.projectById?.reaction;
					setTotalReactions(_totalReactions);
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
					const newReaction = await likeProject(projectId);
					setReaction(newReaction);
					if (newReaction) {
						setTotalReactions(
							_totalReactions => (_totalReactions || 0) + 1,
						);
						dispatch(incrementLikedProjectsCount());
					}
				} else if (reaction?.userId === user?.id) {
					const successful = await unlikeProject(reaction.id);
					if (successful) {
						setReaction(undefined);
						setTotalReactions(
							_totalReactions => (_totalReactions || 1) - 1,
						);
						dispatch(decrementLikedProjectsCount());
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
			<Link href={slugToProjectDonate(slug || '')}>
				<DonateButton
					label={formatMessage({ id: 'label.donate' })}
					disabled={!isActive}
					linkType='primary'
				/>
			</Link>
			<BadgeWrapper gap='4px'>
				<ShareLikeBadge
					type={verified ? 'reward' : 'share'}
					onClick={() => isActive && setShowShareModal(true)}
					isSimple={isMobile}
				/>
				<StyledButton
					label={totalReactions.toString()}
					onClick={() => isActive && checkSignInThenLike()}
					buttonType='texty-gray'
					icon={
						reaction?.userId && reaction?.userId === user?.id ? (
							<IconHeartFilled16 />
						) : (
							<IconHeartOutline16 />
						)
					}
					loading={likeLoading}
					disabled={likeLoading}
					size='small'
				/>
			</BadgeWrapper>
			{showModal &&
				slug &&
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

const DonateButton = styled(ButtonLink)`
	min-width: 220px;
`;

const BadgeWrapper = styled(Flex)`
	justify-content: space-between;
`;

const StyledButton = styled(Button)`
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	flex-direction: row-reverse;
	gap: 8px;
	padding: 16px 10px;
	& > div[loading='1'] > div {
		left: 0;
	}
	color: ${neutralColors.gray[700]};
	&:hover {
		color: ${neutralColors.gray[800]};
	}
`;
