import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
	Button,
	brandColors,
	neutralColors,
	OulineButton,
	Overline,
	ButtonText,
	Caption,
	IconHelp,
} from '@giveth/ui-design-system';
import { motion } from 'framer-motion';

import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import { Shadow } from '@/components/styled-components/Shadow';
import CategoryBadge from '@/components/badges/CategoryBadge';
import { showToastError } from '@/lib/helpers';
import { IProject } from '@/apollo/types/types';
import links from '@/lib/constants/links';
import useUser from '@/context/UserProvider';
import ShareModal from '@/components/modals/ShareModal';
import { IReaction } from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_REACTION_BY_ID } from '@/apollo/gql/gqlProjects';
import SignInModal from '@/components/modals/SignInModal';
import { likeProject, unlikeProject } from '@/lib/reaction';
import DeactivateProjectModal from '@/components/modals/DeactivateProjectModal';
import ArchiveIcon from '../../../../public/images/icons/archive.svg';
import { ACTIVATE_PROJECT } from '@/apollo/gql/gqlProjects';
import { idToProjectEdit, slugToProjectDonate } from '@/lib/routeCreators';
import { VerificationModal } from '@/components/modals/VerificationModal';
import { mediaQueries } from '@/utils/constants';

interface IProjectDonateCard {
	project?: IProject;
	isActive?: boolean;
	isMobile: boolean;
	setIsActive: Dispatch<SetStateAction<boolean>>;
	isDraft?: boolean;
	setIsDraft: Dispatch<SetStateAction<boolean>>;
	setCreationSuccessful: Dispatch<SetStateAction<boolean>>;
}

const ProjectDonateCard = ({
	project,
	isActive,
	isMobile,
	setIsActive,
	isDraft,
	setIsDraft,
	setCreationSuccessful,
}: IProjectDonateCard) => {
	const {
		state: { user, isSignedIn },
		actions: {
			showSignModal,
			incrementLikedProjectsCount,
			decrementLikedProjectsCount,
		},
	} = useUser();

	const {
		categories = [],
		slug,
		description,
		adminUser,
		id,
		givingBlocksId,
	} = project || {};
	const [reaction, setReaction] = useState<IReaction | undefined>(
		project?.reaction,
	);

	const [heartedByUser, setHeartedByUser] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showSigninModal, setShowSigninModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [deactivateModal, setDeactivateModal] = useState<boolean>(false);
	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const isCategories = categories?.length > 0;

	const router = useRouter();

	const wrapperRef = useRef<HTMLDivElement>(null);
	const [wrapperHeight, setWrapperHeight] = useState<number>(0);

	const likeUnlikeProject = async () => {
		if (!isSignedIn) {
			showSignModal();
			return;
		}
		if (loading) return;

		if (id) {
			setLoading(true);

			try {
				if (!reaction) {
					const newReaction = await likeProject(id);
					if (newReaction) {
						setReaction(newReaction);
						incrementLikedProjectsCount();
					}
				} else if (reaction?.userId === user?.id) {
					const successful = await unlikeProject(reaction.id);
					if (successful) {
						setReaction(undefined);
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

	const fetchProjectReaction = useCallback(async () => {
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
				console.error('Error on fetching project by id:', e);
			}
		} else if (reaction) {
			setReaction(undefined);
		}
	}, [id, user?.id]);

	useEffect(() => {
		fetchProjectReaction();
	}, [fetchProjectReaction]);

	useEffect(() => {
		setHeartedByUser(!!reaction?.id && reaction?.userId === user?.id);
	}, [project, reaction, user?.id]);

	useEffect(() => {
		setIsAdmin(
			!!user?.walletAddress &&
				adminUser?.walletAddress === user?.walletAddress,
		);
	}, [user, adminUser]);

	useEffect(() => {
		setWrapperHeight(wrapperRef?.current?.clientHeight || 0);
	}, [wrapperRef, project]);

	const handleProjectStatus = async () => {
		if (isActive) {
			setDeactivateModal(true);
		} else {
			try {
				if (!isSignedIn) {
					showSignModal();
					return;
				}
				const { data } = await client.mutate({
					mutation: ACTIVATE_PROJECT,
					variables: { projectId: Number(id) },
				});
				if (data.activateProject) {
					setIsActive(true);
					setIsDraft(false);
					setCreationSuccessful(true);
				}
			} catch (e: any) {
				showToastError(e);
			}
		}
	};

	return (
		<>
			{showVerificationModal && (
				<VerificationModal
					closeModal={() => setShowVerificationModal(false)}
				/>
			)}
			{showModal && slug && (
				<ShareModal
					showModal={showModal}
					setShowModal={setShowModal}
					projectHref={slug}
					projectDescription={description}
				/>
			)}
			{showSigninModal && (
				<SignInModal
					showModal={showSigninModal}
					closeModal={() => setShowSigninModal(false)}
				/>
			)}
			{deactivateModal && (
				<DeactivateProjectModal
					showModal={deactivateModal}
					setShowModal={setDeactivateModal}
					projectId={id}
					setIsActive={setIsActive}
				/>
			)}
			<Wrapper
				ref={wrapperRef}
				initialPosition={wrapperHeight}
				drag='y'
				dragConstraints={{ top: -(wrapperHeight - 168), bottom: 120 }}
			>
				{isMobile && <BlueBar />}
				{!!givingBlocksId && (
					<GivingBlocksContainer>
						<GivingBlocksText>PROJECT BY:</GivingBlocksText>
						<Image
							src='/images/thegivingblock.svg'
							alt='The Giving Block icon.'
							height={36}
							width={126}
						/>
					</GivingBlocksContainer>
				)}
				{isAdmin ? (
					<>
						<FullButton
							buttonType='primary'
							label='EDIT'
							onClick={() =>
								router.push(idToProjectEdit(project?.id || ''))
							}
						/>
						{!isDraft ? (
							<FullOutlineButton
								buttonType='primary'
								label='VERIFY YOUR PROJECT'
								onClick={() => setShowVerificationModal(true)}
							/>
						) : (
							<FullButton
								buttonType='primary'
								onClick={handleProjectStatus}
								label='PUBLISH PROJECT'
							/>
						)}
					</>
				) : (
					<FullButton
						onClick={() =>
							router.push(slugToProjectDonate(slug || ''))
						}
						label='DONATE'
					/>
				)}
				<BadgeWrapper>
					<ShareLikeBadge
						type='share'
						onClick={() => setShowModal(true)}
					/>
					<ShareLikeBadge
						type='like'
						active={heartedByUser}
						onClick={likeUnlikeProject}
					/>
				</BadgeWrapper>
				{!isDraft && (
					<GivBackNotif>
						<Caption color={brandColors.giv[300]}>
							When you donate to verified projects, you get GIV
							back.
						</Caption>
						<a
							href={links.GIVBACK_DOC}
							target='_blank'
							rel='noreferrer'
						>
							<GIVbackButton>Learn more</GIVbackButton>
							<GIVbackQuestionIcon>
								<IconHelp size={16} />
							</GIVbackQuestionIcon>
						</a>
					</GivBackNotif>
				)}
				{isCategories && (
					<CategoryWrapper>
						{categories.map(i => (
							<CategoryBadge key={i.name} category={i} />
						))}
					</CategoryWrapper>
				)}
				{!isDraft && (
					<>
						<br />
						<Links
							target='_blank'
							href={links.REPORT_ISSUE}
							rel='noreferrer noopener'
						>
							Report an issue
						</Links>
					</>
				)}

				{isAdmin && !isDraft && (
					<ArchiveButton
						buttonType='texty'
						size='small'
						label={`${isActive ? 'DE' : ''}ACTIVATE PROJECT`}
						icon={<Image src={ArchiveIcon} alt='Archive icon.' />}
						onClick={handleProjectStatus}
					/>
				)}
			</Wrapper>
		</>
	);
};

const BlueBar = styled.div`
	width: 80px;
	height: 3px;
	background-color: ${brandColors.giv[500]};
	margin: 0 auto 16px;
	position: relative;
	top: -8px;
`;

const GivingBlocksContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	margin-bottom: 12px;
`;

const GivingBlocksText = styled(Overline)`
	color: ${neutralColors.gray[600]};
	font-size: 10px;
`;

const Links = styled.a`
	font-size: 14px;
	color: ${brandColors.pinky[500]} !important;
`;

const CategoryWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 24px;
	overflow: hidden;
	max-height: 98px;
	margin-bottom: 16px;
`;

const GivBackNotif = styled.div`
	padding: 16px 16px 16px 48px;
	background: rgba(231, 225, 255, 0.4);
	border-radius: 8px;
	border: 1px solid ${brandColors.giv[300]};
	margin-top: 24px;
	color: ${brandColors.giv[300]};
	position: relative;
`;

const GIVbackQuestionIcon = styled.div`
	position: absolute;
	top: 19px;
	left: 16px;
`;

const GIVbackButton = styled(ButtonText)`
	margin-top: 16px;
	color: ${brandColors.giv[300]};
	display: block;
	text-align: right;

	&:hover {
		color: ${brandColors.giv[400]};
	}
`;

const BadgeWrapper = styled.div`
	display: flex;
	margin-top: 16px;
	justify-content: space-between;
`;

const Wrapper = styled(motion.div)<{ initialPosition: number }>`
	margin-right: 26px;
	margin-top: -32px;
	background: white;
	padding: 32px;
	overflow: hidden;
	width: 326px;
	height: fit-content;
	box-shadow: ${Shadow.Neutral['400']};
	flex-shrink: 0;
	z-index: 20;
	align-self: flex-start;

	${mediaQueries.mobileS} {
		width: 100vw;
		position: fixed;
		bottom: calc(-${props => props.initialPosition}px + 168px);
		border-radius: 40px 40px 0px 0px;
	}

	${mediaQueries.tablet} {
		max-width: 225px;
		position: sticky;
		top: 168px;
		border-radius: 40px;
	}

	${mediaQueries.laptop} {
		max-width: 285px;
	}

	${mediaQueries.laptopL} {
		max-width: 325px;
	}
`;

const FullButton = styled(Button)`
	width: 100%;
	margin-bottom: 8px;

	&:disabled {
		background-color: ${neutralColors.gray[600]};
		color: ${neutralColors.gray[100]};
	}
`;

const FullOutlineButton = styled(OulineButton)`
	width: 100%;
`;

const ArchiveButton = styled(Button)`
	width: 100%;
	margin: 12px 0 0;
	padding-bottom: 0;
	color: ${brandColors.giv[500]};

	&:hover {
		color: ${brandColors.giv[500]};
		background-color: transparent;
	}
`;

export default ProjectDonateCard;
