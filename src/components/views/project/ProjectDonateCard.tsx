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
	Caption,
	IconHelp,
} from '@giveth/ui-design-system';
import { motion } from 'framer-motion';
import { captureException } from '@sentry/nextjs';

import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import { Shadow } from '@/components/styled-components/Shadow';
import CategoryBadge from '@/components/badges/CategoryBadge';
import { compareAddresses, showToastError } from '@/lib/helpers';
import { IProject } from '@/apollo/types/types';
import links from '@/lib/constants/links';
import ShareModal from '@/components/modals/ShareModal';
import { IReaction } from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_REACTION_BY_ID } from '@/apollo/gql/gqlProjects';
import { likeProject, unlikeProject } from '@/lib/reaction';
import DeactivateProjectModal from '@/components/modals/DeactivateProjectModal';
import ArchiveIcon from '../../../../public/images/icons/archive.svg';
import { ACTIVATE_PROJECT } from '@/apollo/gql/gqlProjects';
import { idToProjectEdit, slugToProjectDonate } from '@/lib/routeCreators';
import { VerificationModal } from '@/components/modals/VerificationModal';
import { mediaQueries } from '@/lib/constants/constants';
import ProjectCardOrgBadge from '../../project-card/ProjectCardOrgBadge';
import ExternalLink from '@/components/ExternalLink';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.sclie';
import {
	incrementLikedProjectsCount,
	decrementLikedProjectsCount,
} from '@/features/user/user.slice';

interface IProjectDonateCard {
	project?: IProject;
	isActive?: boolean;
	isMobile?: boolean;
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
	const dispatch = useAppDispatch();
	const { isSignedIn, userData: user } = useAppSelector(state => state.user);

	const {
		categories = [],
		slug,
		adminUser,
		id,
		verified,
		organization,
	} = project || {};

	const [heartedByUser, setHeartedByUser] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [deactivateModal, setDeactivateModal] = useState<boolean>(false);
	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const [reaction, setReaction] = useState<IReaction | undefined>(
		project?.reaction,
	);

	const isCategories = categories?.length > 0;

	const router = useRouter();

	const wrapperRef = useRef<HTMLDivElement>(null);
	const [wrapperHeight, setWrapperHeight] = useState<number>(0);

	const scrollToSimilarProjects = () => {
		const el = document.getElementById('similar-projects');
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	};

	const likeUnlikeProject = async () => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
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
						section: 'likeUnline Project Donate',
					},
				});
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
	}, [id, user?.id]);

	useEffect(() => {
		fetchProjectReaction().then();
	}, []);

	useEffect(() => {
		setHeartedByUser(!!reaction?.id && reaction?.userId === user?.id);
	}, [project, reaction, user?.id]);

	useEffect(() => {
		setIsAdmin(
			compareAddresses(adminUser?.walletAddress, user?.walletAddress),
		);
	}, [user, adminUser]);

	useEffect(() => {
		setWrapperHeight(wrapperRef?.current?.clientHeight || 0);
	}, [wrapperRef, project]);

	const handleProjectStatus = async (deactivate?: boolean) => {
		if (deactivate) {
			setDeactivateModal(true);
		} else {
			try {
				if (!isSignedIn) {
					dispatch(setShowSignWithWallet(true));
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
			} catch (e) {
				showToastError(e);
				captureException(e, {
					tags: {
						section: 'handleProjectStatus',
					},
				});
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
				<ShareModal setShowModal={setShowModal} projectHref={slug} />
			)}
			{deactivateModal && (
				<DeactivateProjectModal
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
				<ProjectCardOrgBadge
					organization={organization?.label}
					isHover={false}
					isProjectView={true}
				/>
				{isAdmin ? (
					<>
						<FullButton
							buttonType='primary'
							label='EDIT'
							disabled={!isActive && !isDraft}
							onClick={() =>
								router.push(idToProjectEdit(project?.id || ''))
							}
						/>
						{!verified && !isDraft && (
							<FullOutlineButton
								buttonType='primary'
								label='VERIFY YOUR PROJECT'
								disabled={!isActive}
								onClick={() => setShowVerificationModal(true)}
							/>
						)}
						{isDraft && (
							<FullButton
								buttonType='primary'
								onClick={() => handleProjectStatus(false)}
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
						disabled={!isActive}
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
				{!isAdmin && verified && (
					<GivBackNotif>
						<Caption color={brandColors.giv[300]}>
							When you donate to verified projects, you get
							GIVback.
						</Caption>
						<ExternalLink href={links.GIVBACK_DOC}>
							<IconHelp size={16} />
						</ExternalLink>
					</GivBackNotif>
				)}
				{isCategories && (
					<CategoryWrapper>
						{categories.map(i => (
							<CategoryBadge key={i.name} category={i} />
						))}
					</CategoryWrapper>
				)}
				{!isDraft && !isAdmin && (
					<Links>
						<ExternalLink
							href={links.REPORT_ISSUE}
							title='Report an issue'
						/>
						<div onClick={scrollToSimilarProjects}>
							View similar projects
						</div>
					</Links>
				)}

				{isAdmin && !isDraft && (
					<ArchiveButton
						buttonType='texty'
						size='small'
						label={`${isActive ? 'DE' : ''}ACTIVATE PROJECT`}
						icon={<Image src={ArchiveIcon} alt='Archive icon.' />}
						onClick={() => handleProjectStatus(isActive)}
					/>
				)}
			</Wrapper>
		</>
	);
};

const Links = styled.div`
	color: ${brandColors.pinky[500]};
	display: flex;
	flex-direction: column;
	gap: 8px;
	> div {
		cursor: pointer;
	}
`;

const BlueBar = styled.div`
	width: 80px;
	height: 3px;
	background-color: ${brandColors.giv[500]};
	margin: 0 auto 16px;
	position: relative;
	top: -8px;
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
	padding: 16px;
	background: rgba(231, 225, 255, 0.4);
	border-radius: 8px;
	border: 1px solid ${brandColors.giv[300]};
	margin-top: 24px;
	color: ${brandColors.giv[300]};
	display: flex;
	gap: 16px;
	max-width: 420px;

	> a:last-child {
		margin-top: 3px;
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
	height: fit-content;
	box-shadow: ${Shadow.Neutral[400]};
	flex-shrink: 0;
	z-index: 10;
	align-self: flex-start;
	width: 100vw;
	position: fixed;
	bottom: calc(-${props => props.initialPosition}px + 168px);
	border-radius: 40px 40px 0 0;

	${mediaQueries.tablet} {
		padding: 16px;
		max-width: 225px;
		position: sticky;
		top: 168px;
		border-radius: 40px;
	}

	${mediaQueries.laptop} {
		max-width: 285px;
	}

	${mediaQueries.laptopL} {
		padding: 32px;
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
