import React, {
	Dispatch,
	FC,
	Fragment,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
	Button,
	brandColors,
	neutralColors,
	OutlineButton,
	IconArchiving,
	Caption,
	IconRocketInSpace,
	ButtonText,
	IconRocketInSpace24,
	Subline,
	IconHelpFilled16,
} from '@giveth/ui-design-system';
import { motion } from 'framer-motion';
import { captureException } from '@sentry/nextjs';

import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import { Shadow } from '@/components/styled-components/Shadow';
import { compareAddresses, showToastError } from '@/lib/helpers';
import { EVerificationStatus, IProject } from '@/apollo/types/types';
import links from '@/lib/constants/links';
import ShareModal from '@/components/modals/ShareModal';
import { IReaction } from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_REACTION_BY_ID } from '@/apollo/gql/gqlProjects';
import { likeProject, unlikeProject } from '@/lib/reaction';
import DeactivateProjectModal from '@/components/modals/deactivateProject/DeactivateProjectIndex';
import { ACTIVATE_PROJECT } from '@/apollo/gql/gqlProjects';
import {
	idToProjectEdit,
	slugToProjectDonate,
	slugToVerification,
} from '@/lib/routeCreators';
import { VerificationModal } from '@/components/modals/VerificationModal';
import { mediaQueries } from '@/lib/constants/constants';
import ProjectCardOrgBadge from '../../../project-card/ProjectCardOrgBadge';
import ExternalLink from '@/components/ExternalLink';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import {
	incrementLikedProjectsCount,
	decrementLikedProjectsCount,
} from '@/features/user/user.slice';
import { EProjectVerificationStatus } from '@/apollo/types/gqlEnums';
import VerificationStatus from '@/components/views/project/projectDonateCard/VerificationStatus';
import useDetectDevice from '@/hooks/useDetectDevice';
import GIVbackToast from '@/components/views/project/projectDonateCard/GIVbackToast';
import {
	Flex,
	FlexCenter,
	FlexSpacer,
} from '@/components/styled-components/Flex';
import BoostModal from '@/components/modals/Boost/BoostModal';
import CategoryBadge from '@/components/badges/CategoryBadge';
import { mapCategoriesToMainCategories } from '@/helpers/singleProject';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { CurrentRank, NextRank } from '@/components/GIVpowerRank';

interface IProjectDonateCard {
	project: IProject;
	isActive?: boolean;
	setIsActive: Dispatch<SetStateAction<boolean>>;
	isDraft?: boolean;
	setIsDraft: Dispatch<SetStateAction<boolean>>;
	setCreationSuccessful: Dispatch<SetStateAction<boolean>>;
}

const ProjectDonateCard: FC<IProjectDonateCard> = ({
	project,
	isActive,
	setIsActive,
	isDraft,
	setIsDraft,
	setCreationSuccessful,
}) => {
	const dispatch = useAppDispatch();
	const { isSignedIn, userData: user } = useAppSelector(state => state.user);
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
	} = project || {};

	const convertedCategories = mapCategoriesToMainCategories(categories);

	const [heartedByUser, setHeartedByUser] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [deactivateModal, setDeactivateModal] = useState<boolean>(false);
	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const [showBoost, setShowBoost] = useState(false);
	const [reaction, setReaction] = useState<IReaction | undefined>(
		project?.reaction,
	);

	const { isMobile } = useDetectDevice();

	const isCategories = categories?.length > 0;
	const verStatus = verified
		? EVerificationStatus.VERIFIED
		: verificationFormStatus;

	const isVerDraft = verStatus === EVerificationStatus.DRAFT;
	const isRevoked = verificationStatus === EProjectVerificationStatus.REVOKED;

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
						section: 'likeUnlike Project Donate Card',
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

	const handleBoostClick = () => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		} else {
			setShowBoost(true);
		}
	};

	useEffect(() => {
		fetchProjectReaction().then();
	}, [user?.id]);

	useEffect(() => {
		setHeartedByUser(!!reaction?.id && reaction?.userId === user?.id);
	}, [project, reaction, user?.id]);

	useEffect(() => {
		setIsAdmin(
			compareAddresses(adminUser?.walletAddress, user?.walletAddress),
		);
	}, [user, adminUser]);

	useEffect(() => {
		const handleResize = () =>
			setWrapperHeight(wrapperRef?.current?.clientHeight || 0);
		if (isMobile) {
			handleResize();
			window.addEventListener('resize', handleResize);
		}
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [project, isMobile]);

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
					onClose={() => setShowVerificationModal(false)}
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
			{showBoost && project?.id && (
				<BoostModal
					projectId={project.id}
					setShowModal={setShowBoost}
				/>
			)}
			<Wrapper
				ref={wrapperRef}
				height={wrapperHeight}
				drag={isMobile ? 'y' : false}
				dragElastic={0}
				dragConstraints={{ top: -(wrapperHeight - 165), bottom: 120 }}
			>
				{isMobile && <BlueBar />}
				<ProjectCardOrgBadge
					organization={organization?.label}
					isHover={false}
					isProjectView={true}
				/>
				<BoostWrapper>
					<Flex gap='8px' alignItems='center'>
						<IconRocketInSpace24 />
						<Subline>GIVPOWER RANK</Subline>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction={'bottom'}
						>
							<BoostTooltip>
								Boost this project with GIVpower to improve its
								rank! Rank is updated at the beginning of every
								GIVbacks round. You can see the projected rank
								for next round as well below.
							</BoostTooltip>
						</IconWithTooltip>
					</Flex>
					<Flex gap='8px' alignItems='flex-end'>
						<CurrentRank projectPower={projectPower} />
						<NextRank
							projectPower={projectPower}
							projectFuturePower={projectFuturePower}
						/>
						<FlexSpacer />
						<BoostButton1 onClick={handleBoostClick}>
							<IconRocketInSpace />
							<BoostButtonText>Boost</BoostButtonText>
						</BoostButton1>
					</Flex>
				</BoostWrapper>
				<DonateWrapper>
					{isAdmin ? (
						<>
							<FullButton
								buttonType='primary'
								label='EDIT'
								disabled={!isActive && !isDraft}
								onClick={() =>
									router.push(
										idToProjectEdit(project?.id || ''),
									)
								}
							/>
							{!isRevoked &&
								!verified &&
								!isDraft &&
								!verStatus && (
									<FullOutlineButton
										buttonType='primary'
										label='VERIFY YOUR PROJECT'
										disabled={!isActive}
										onClick={() =>
											setShowVerificationModal(true)
										}
									/>
								)}
							{isVerDraft && (
								<ExternalLink href={slugToVerification(slug)}>
									<FullOutlineButton
										buttonType='primary'
										label={
											isRevoked
												? 'Re-apply'
												: 'RESUME VERIFICATION'
										}
									/>
								</ExternalLink>
							)}
							<VerificationStatus status={verStatus} />
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
							buttonType='primary'
							disabled={!isActive}
						/>
					)}
					<BadgeWrapper>
						<ShareLikeBadge
							type='share'
							onClick={() => isActive && setShowModal(true)}
							isSimple={verified && isMobile}
						/>
						<ShareLikeBadge
							type='like'
							active={heartedByUser}
							onClick={() => isActive && likeUnlikeProject()}
							isSimple={verified && isMobile}
						/>
						{verified && isMobile && (
							<BoostButton onClick={handleBoostClick}>
								<BoostButtonText>Boost</BoostButtonText>
								<IconRocketInSpace
									color={brandColors.giv[500]}
								/>
							</BoostButton>
						)}
					</BadgeWrapper>
					{!isAdmin && verified && <GIVbackToast />}
					{isCategories && (
						<MainCategoryWrapper flexDirection='column'>
							{Object.entries(convertedCategories)?.map(
								([mainCategory, subcategories]) => (
									<Fragment key={mainCategory}>
										<MainCategory>
											{mainCategory}
										</MainCategory>
										<CategoryWrapper>
											{subcategories.map(subcategory => (
												<CategoryBadge
													key={subcategory.name}
													category={subcategory.value}
												/>
											))}
										</CategoryWrapper>
									</Fragment>
								),
							)}
						</MainCategoryWrapper>
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
							icon={<IconArchiving size={16} />}
							onClick={() => handleProjectStatus(isActive)}
						/>
					)}
				</DonateWrapper>
			</Wrapper>
		</>
	);
};

const BoostButton = styled(FlexCenter)`
	border-radius: 48px;
	box-shadow: ${Shadow.Neutral[500]};
	display: flex;
	gap: 4px;
	padding-right: 22px;
	padding-left: 22px;
	color: ${brandColors.giv[500]};
	cursor: pointer;
	background: white;
	width: 100%;
`;

const BoostButton1 = styled(Flex)`
	border-radius: 48px;
	box-shadow: ${Shadow.Neutral[500]};
	display: flex;
	gap: 4px;
	padding: 16px 24px;
	color: ${brandColors.giv[900]};
	cursor: pointer;
	background: white;
	align-items: flex-end;
	transition: color 0.2s ease;
	&:hover {
		color: ${brandColors.giv[400]};
	}
`;

const BoostButtonText = styled(ButtonText)`
	font-size: 0.75em;
`;

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

const CategoryWrapper = styled(Flex)`
	flex-wrap: wrap;
	gap: 10px;
	overflow: hidden;
	margin: 8px 0;
`;

const MainCategoryWrapper = styled(Flex)`
	margin-top: 24px;
`;

const MainCategory = styled(Caption)`
	color: ${neutralColors.gray[600]};
`;

const BadgeWrapper = styled.div`
	display: flex;
	margin-top: 16px;
	justify-content: space-between;
	gap: 8px;
`;

const Wrapper = styled(motion.div)<{ height: number }>`
	margin-top: -62px;
	height: fit-content;
	z-index: 10;
	align-self: flex-start;
	width: 100%;
	position: fixed;
	bottom: ${({ height }) => `calc(165px - ${height}px)`};
	left: 0;
	${mediaQueries.tablet} {
		position: sticky;
		top: 132px;
	}
`;

const BoostWrapper = styled.div`
	background: ${brandColors.giv['000']};
	border-radius: 40px;
	padding: 24px;
	margin-bottom: 16px;
	${mediaQueries.tablet} {
		padding: 16px;
		max-width: 225px;
		border-radius: 40px;
	}

	${mediaQueries.laptopS} {
		max-width: 285px;
	}

	${mediaQueries.laptopL} {
		padding: 32px;
		max-width: 325px;
	}
`;

const DonateWrapper = styled.div`
	background: ${brandColors.giv['000']};
	box-shadow: ${Shadow.Neutral[400]};
	border-radius: 40px 40px 0 0;
	padding: 32px;
	${mediaQueries.tablet} {
		padding: 16px;
		max-width: 225px;
		border-radius: 40px;
	}

	${mediaQueries.laptopS} {
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

const FullOutlineButton = styled(OutlineButton)`
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

export const BoostTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 260px;
`;

export default ProjectDonateCard;
