import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FlexCenter } from '../styled-components/Grid';
import VerificationBadge from '../badges/VerificationBadge';
import grayHeartIcon from '/public//images/heart_gray.svg';
import redHeartIcon from '/public//images/heart_red.svg';
import shareIcon from '/public//images/share.svg';
import { IReaction } from '../../apollo/types/types';
import useUser from '@/context/UserProvider';
import { brandColors, Subline } from '@giveth/ui-design-system';
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
	isHover?: boolean;
	likes?: number;
	cardWidth?: string;
	projectHref: string;
	projectDescription?: string;
	projectId?: string | number;
}

const ProjectCardBadges = (props: IProjectCardBadges) => {
	const {
		state: { isSignedIn },
		actions: { signIn },
	} = useUser();

	const [showModal, setShowModal] = useState<boolean>(false);
	const {
		verified,
		isHover,
		traceable,
		projectHref,
		projectDescription,
		projectId,
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
					if (newReaction)
						setTotalReactions((totalReactions || 0) + 1);
				} else {
					const successful = await unlikeProject(reaction.id);
					if (successful) {
						setReaction(undefined);
						setTotalReactions((totalReactions || 1) - 1);
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
	}, [props]);

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
				<BadgeContainer>
					{Number(totalReactions) > 0 && (
						<LikeBadge>{totalReactions}</LikeBadge>
					)}
					<HeartWrap active={!!reaction?.id} isHover={isHover}>
						<Image
							src={reaction?.id ? redHeartIcon : grayHeartIcon}
							alt='heart icon'
							onClick={() => {
								likeUnlikeProject();
							}}
						/>
						<ShareImageButton
							src={shareIcon}
							alt='share icon'
							onClick={() => setShowModal(true)}
						/>
					</HeartWrap>
				</BadgeContainer>
			</BadgeWrapper>
		</>
	);
};

const BadgeContainer = styled.div`
	display: flex;
`;

const ShareImageButton = styled(Image)`
	cursor: pointer;
`;

const HeartWrap = styled(FlexCenter)<{ active?: boolean; isHover?: boolean }>`
	height: ${props => (props.isHover ? '72px' : '30px')};
	width: 30px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	border-radius: 56px;
	background: ${props => (props.active ? 'white' : brandColors.deep[800])};
	transition: all 0.3s ease;

	> span:nth-of-type(2) {
		display: ${props => (props.isHover ? 'unset' : 'none !important')};
	}
`;

const LikeBadge = styled(Subline)`
	color: white;
	margin-right: 6px;
	margin-top: 7px;
`;

const BadgeWrapper = styled.div<IBadgeWrapper>`
	width: 100%;
	position: absolute;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	padding: 16px;
`;

export default ProjectCardBadges;
