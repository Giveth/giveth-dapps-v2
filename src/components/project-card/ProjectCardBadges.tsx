import { useEffect, useState } from 'react';
import { Row } from '../styled-components/Grid';
import VerificationBadge from '../badges/VerificationBadge';
import { IReaction } from '../../apollo/types/types';
import useUser from '@/context/UserProvider';
import {
	brandColors,
	IconHeart16,
	IconHeartOutline16,
	IconShare16,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import ShareModal from '../modals/ShareModal';
import { likeProject, unlikeProject } from '@/lib/reaction';

interface IBadgeWrapper {
	width?: string;
}

interface IProjectCardBadges {
	reaction?: IReaction;
	totalReactions?: number;
	verified?: boolean;
	traceable?: boolean;
	likes?: number;
	projectHref: string;
	projectDescription?: string;
	projectId?: string | number;
	noHearts?: boolean;
}

const ProjectCardBadges = (props: IProjectCardBadges) => {
	const {
		state: { user, isSignedIn },
		actions: {
			signIn,
			incrementLikedProjectsCount,
			decrementLikedProjectsCount,
		},
	} = useUser();

	const [showModal, setShowModal] = useState<boolean>(false);
	const {
		verified,
		traceable,
		projectHref,
		projectDescription,
		projectId,
		noHearts,
	} = props;

	const [reaction, setReaction] = useState(props.reaction);
	const [totalReactions, setTotalReactions] = useState(props.totalReactions);
	const [loading, setLoading] = useState(false);

	const likeUnlikeProject = async () => {
		if (!isSignedIn) {
			if (signIn) {
				const success = await signIn();
				if (!success) return;
			} else {
				console.error('Sign in is not possible');
			}
			// setShowSigninModal(true);
			// return;
		}
		if (loading) return;

		if (projectId) {
			setLoading(true);

			try {
				if (!reaction) {
					const newReaction = await likeProject(projectId);
					setReaction(newReaction);
					if (newReaction) {
						setTotalReactions((totalReactions || 0) + 1);
						incrementLikedProjectsCount();
					}
				} else if (reaction?.userId === user?.id) {
					const successful = await unlikeProject(reaction.id);
					if (successful) {
						setReaction(undefined);
						setTotalReactions((totalReactions || 1) - 1);
						decrementLikedProjectsCount();
					}
				}
			} catch (e) {
				console.error('Error on like/unlike project ', e);
			} finally {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		setReaction(props.reaction);
	}, [props.reaction]);

	return (
		<>
			{showModal && (
				<ShareModal
					showModal={showModal}
					setShowModal={setShowModal}
					projectHref={projectHref}
					projectDescription={projectDescription}
				/>
			)}
			<BadgeWrapper>
				<BadgeContainer>
					{verified && <VerificationBadge verified />}
					{traceable && <VerificationBadge trace />}
				</BadgeContainer>
				{!noHearts && (
					<BadgeContainer>
						<BadgeButtonContainer>
							<BadgeButton onClick={likeUnlikeProject}>
								{Number(totalReactions) > 0 && (
									<LikeCount>{totalReactions}</LikeCount>
								)}
								{reaction?.userId &&
								reaction?.userId === user?.id ? (
									<IconHeart16
										color={brandColors.pinky[500]}
									/>
								) : (
									<IconHeartOutline16 />
								)}
							</BadgeButton>
							<BadgeButton onClick={() => setShowModal(true)}>
								<IconShare16 />
							</BadgeButton>
						</BadgeButtonContainer>
					</BadgeContainer>
				)}
			</BadgeWrapper>
		</>
	);
};

const BadgeContainer = styled.div`
	display: flex;
`;

const BadgeButtonContainer = styled(Row)`
	gap: 3px;
`;

const BadgeButton = styled(Row)`
	gap: 3px;
	padding: 6px 7px;
	background: ${neutralColors.gray[100]};
	align-items: center;
	border-radius: 16px;
	cursor: pointer;
	transition: color 0.3s ease;
	color: ${neutralColors.gray[800]};
	box-shadow: 0px 3px 20px ${brandColors.giv[400]}21;
	&:hover {
		color: ${neutralColors.gray[900]};
	}
`;

const LikeCount = styled(Subline)``;

const BadgeWrapper = styled.div<IBadgeWrapper>`
	width: 100%;
	position: absolute;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	padding: 16px;
`;

export default ProjectCardBadges;
