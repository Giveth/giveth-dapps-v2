import { useEffect, useState } from 'react';
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
import { showToastError } from '@/lib/helpers';
import useModal from '@/context/ModalProvider';
import { Flex } from '../styled-components/Flex';
import VerificationBadge from '../badges/VerificationBadge';
import { IProject } from '@/apollo/types/types';
import useUser from '@/context/UserProvider';

interface IProjectCardBadges {
	project: IProject;
}

const ProjectCardBadges = (props: IProjectCardBadges) => {
	const {
		state: { user, isSignedIn },
		actions: { incrementLikedProjectsCount, decrementLikedProjectsCount },
	} = useUser();

	const {
		actions: { showSignWithWallet },
	} = useModal();

	const [showModal, setShowModal] = useState<boolean>(false);

	const { project } = props;
	const { verified, traceCampaignId, slug, id: projectId } = project;

	const [reaction, setReaction] = useState(project.reaction);
	const [totalReactions, setTotalReactions] = useState(
		project.totalReactions,
	);
	const [loading, setLoading] = useState(false);

	const likeUnlikeProject = async () => {
		if (!isSignedIn) {
			showSignWithWallet();
			return;
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
				showToastError(e);
			} finally {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		setReaction(project.reaction);
	}, [project.reaction]);

	useEffect(() => {
		setTotalReactions(project.totalReactions);
	}, [project.totalReactions]);

	return (
		<>
			{showModal && (
				<ShareModal setShowModal={setShowModal} projectHref={slug} />
			)}
			<BadgeWrapper>
				<Flex>
					{verified && <VerificationBadge verified />}
					{traceCampaignId && <VerificationBadge trace />}
				</Flex>
				<Flex gap='3px'>
					<BadgeButton onClick={likeUnlikeProject}>
						{Number(totalReactions) > 0 && (
							<Subline>{totalReactions}</Subline>
						)}
						{reaction?.userId && reaction?.userId === user?.id ? (
							<IconHeart16 color={brandColors.pinky[500]} />
						) : (
							<IconHeartOutline16 />
						)}
					</BadgeButton>
					<BadgeButton onClick={() => setShowModal(true)}>
						<IconShare16 />
					</BadgeButton>
				</Flex>
			</BadgeWrapper>
		</>
	);
};

const BadgeButton = styled(Flex)`
	gap: 3px;
	padding: 6px 7px;
	background: ${neutralColors.gray[100]};
	align-items: center;
	border-radius: 16px;
	cursor: pointer;
	transition: color 0.3s ease;
	color: ${neutralColors.gray[800]};
	box-shadow: 0 3px 20px ${brandColors.giv[400]}21;
	&:hover {
		color: ${neutralColors.gray[900]};
	}
`;

const BadgeWrapper = styled.div`
	width: 100%;
	position: absolute;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	padding: 16px;
`;

export default ProjectCardBadges;
