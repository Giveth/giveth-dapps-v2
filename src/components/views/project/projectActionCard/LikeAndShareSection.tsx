import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	Button,
	IconHeartFilled16,
	IconHeartOutline16,
	IconShare16,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';
import ShareModal from '@/components/modals/ShareModal';
import { EContentType } from '@/lib/constants/shareContent';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_REACTION_BY_ID } from '@/apollo/gql/gqlProjects';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { isSSRMode, showToastError } from '@/lib/helpers';
import { IReaction } from '@/apollo/types/types';
import { useModalCallback, EModalEvents } from '@/hooks/useModalCallback';
import {
	incrementLikedProjectsCount,
	decrementLikedProjectsCount,
} from '@/features/user/user.slice';
import { likeProject, unlikeProject } from '@/lib/reaction';

export const LikeAndShareSection = () => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [heartedByUser, setHeartedByUser] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);

	const {
		isSignedIn,
		isEnabled,
		userData: user,
		isLoading: isUserLoading,
	} = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();
	const { projectData, isActive } = useProjectContext();
	const {
		categories = [],
		slug,
		adminUser,
		id,
		verified,
		verificationStatus,
		organization,
		verificationFormStatus,
		projectPower,
		projectFuturePower,
	} = projectData || {};
	const [reaction, setReaction] = useState<IReaction | undefined>(
		projectData?.reaction,
	);

	const likeUnlikeProject = async () => {
		if (loading) return;

		if (id) {
			setLoading(true);

			try {
				if (!reaction) {
					const newReaction = await likeProject(id);
					if (newReaction) {
						setReaction(newReaction);
						dispatch(incrementLikedProjectsCount());
					}
				} else if (reaction?.userId === user?.id) {
					const successful = await unlikeProject(reaction.id);
					if (successful) {
						setReaction(undefined);
						dispatch(decrementLikedProjectsCount());
					}
				}
			} catch (e) {
				showToastError(e);
				captureException(e, {
					tags: {
						section: 'likeUnlike Project Donate Card',
					},
				});
			} finally {
				setLoading(false);
			}
		}
	};

	const { modalCallback: signInThenLike } =
		useModalCallback(likeUnlikeProject);

	const { modalCallback: connectThenSignIn } = useModalCallback(
		signInThenLike,
		EModalEvents.CONNECTED,
	);

	const checkSignInThenLike = () => {
		if (isSSRMode) return;
		if (!isEnabled) {
			connectThenSignIn();
		} else if (!isSignedIn) {
			signInThenLike();
		} else {
			likeUnlikeProject();
		}
	};

	useEffect(() => {
		const fetchProjectReaction = async () => {
			if (user?.id && id) {
				// Already fetched
				if (user?.id === reaction?.userId) return;

				try {
					const { data } = await client.query({
						query: FETCH_PROJECT_REACTION_BY_ID,
						variables: {
							id: Number(id),
							connectedWalletUserId: Number(user?.id),
						},
						fetchPolicy: 'no-cache',
					});
					setReaction(data?.projectById?.reaction);
				} catch (e) {
					showToastError(e);
					captureException(e, {
						tags: {
							section: 'fetchProjectReaction',
						},
					});
				}
			} else if (reaction) {
				setReaction(undefined);
			}
		};
		fetchProjectReaction();
	}, [id, reaction, user?.id]);

	useEffect(() => {
		setHeartedByUser(!!reaction?.id && reaction?.userId === user?.id);
	}, [projectData, reaction, user?.id]);

	return (
		<>
			<BadgeWrapper gap='8px'>
				{/* <ShareLikeBadge
					type='share'
					onClick={() => isActive && setShowModal(true)}
				/>
				<ShareLikeBadge
					type='like'
					active={heartedByUser}
					isSimple={isMobile}
				/> */}
				<StyledButton
					label={formatMessage({ id: 'label.share' })}
					onClick={() => setShowModal(true)}
					buttonType='texty-gray'
					icon={<IconShare16 />}
					size='small'
				/>
				<StyledButton
					label={formatMessage({ id: 'label.like' })}
					onClick={() => isActive && checkSignInThenLike()}
					buttonType='texty-gray'
					icon={
						heartedByUser ? (
							<IconHeartFilled16 />
						) : (
							<IconHeartOutline16 />
						)
					}
					size='small'
				/>
			</BadgeWrapper>
			{showModal && slug && (
				<ShareModal
					contentType={EContentType.thisProject}
					setShowModal={setShowModal}
					projectHref={slug}
				/>
			)}
		</>
	);
};

const BadgeWrapper = styled(Flex)`
	margin: 16px 0;
	justify-content: space-between;
`;

const StyledButton = styled(Button)`
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	flex-direction: row-reverse;
	gap: 8px;
	padding: 16px 24px;
`;
