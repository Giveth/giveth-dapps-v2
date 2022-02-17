import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import { Shadow } from '@/components/styled-components/Shadow';
import CategoryBadge from '@/components/badges/CategoryBadge';
import Routes from '@/lib/constants/Routes';
import { slugToProjectDonate, mediaQueries } from '@/lib/helpers';
import InfoBadge from '@/components/badges/InfoBadge';
import { IProject } from '@/apollo/types/types';
import links from '@/lib/constants/links';
import {
	Button,
	brandColors,
	GLink,
	neutralColors,
	OulineButton,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
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

interface IProjectDonateCard {
	project: IProject;
	isActive: boolean;
	setIsActive: Dispatch<SetStateAction<boolean>>;
}

const ProjectDonateCard = ({
	project,
	isActive,
	setIsActive,
}: IProjectDonateCard) => {
	const {
		state: { user, isSignedIn },
		actions: { signIn },
	} = useUser();

	// const { project } = props;
	const { categories, slug, description, adminUser, id } = project;
	const [reaction, setReaction] = useState<IReaction | undefined>(undefined);

	const [heartedByUser, setHeartedByUser] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showSigninModal, setShowSigninModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [deactivateModal, setDeactivateModal] = useState<boolean>(false);

	const isCategories = categories.length > 0;

	const router = useRouter();

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

		if (project.id) {
			setLoading(true);

			try {
				if (!reaction) {
					const newReaction = await likeProject(project.id);
					setReaction(newReaction);
				} else {
					const successful = await unlikeProject(reaction.id);
					if (successful) setReaction(undefined);
				}
			} catch (e) {
				console.error('Error on like/unlike project ', e);
			} finally {
				setLoading(false);
			}
		}
	};

	const fetchProjectReaction = async () => {
		if (user?.id) {
			try {
				const { data } = await client.query({
					query: FETCH_PROJECT_REACTION_BY_ID,
					variables: {
						id: Number(project.id),
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
	};

	useEffect(() => {
		fetchProjectReaction();
	}, [user]);

	useEffect(() => {
		setHeartedByUser(!!reaction?.id);
	}, [project, reaction]);

	useEffect(() => {
		if (adminUser?.walletAddress === user?.walletAddress) {
			setIsAdmin(true);
		}
	}, [user, adminUser]);

	const handleProjectStatus = async () => {
		if (isActive) {
			setDeactivateModal(true);
		} else {
			if (!isSignedIn && !!signIn) {
				await signIn();
			}
			const { data } = await client.mutate({
				mutation: ACTIVATE_PROJECT,
				variables: {
					projectId: Number(id),
				},
			});
			setIsActive(data.activateProject);
		}
	};

	return (
		<>
			{showModal && (
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
			<Wrapper>
				{isAdmin ? (
					<>
						<FullButton
							buttonType='primary'
							label='EDIT'
							disabled
						/>
						<FullOutlineButton
							buttonType='primary'
							label='VERIFY YOUR PROJECT'
						/>
					</>
				) : (
					<FullButton
						onClick={() => router.push(slugToProjectDonate(slug))}
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
				<GivBackNotif>
					<GLink size='Medium' color={brandColors.giv[300]}>
						When you donate to verified projects, you get GIV back.
					</GLink>
					<InfoBadge />
				</GivBackNotif>
				{isCategories && (
					<CategoryWrapper>
						{categories.map(i => (
							<CategoryBadge key={i.name} category={i} />
						))}
					</CategoryWrapper>
				)}
				<Link href={Routes.Projects} passHref>
					<Links>View similar projects</Links>
				</Link>
				<br />
				<Links
					target='_blank'
					href={links.REPORT_ISSUE}
					rel='noreferrer noopener'
				>
					Report an issue
				</Links>
				{isAdmin && (
					<ArchiveButton
						buttonType='texty'
						size='small'
						label={`${isActive ? 'DE' : ''}ACTIVATE PROJECT`}
						icon={<Image src={ArchiveIcon} alt='Archive icon.' />}
						onClick={() => handleProjectStatus()}
					/>
				)}
			</Wrapper>
		</>
	);
};

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
	display: flex;
	justify-content: center;
	padding: 16px;
	background: rgba(231, 225, 255, 0.4);
	border-radius: 8px;
	border: 1px solid ${brandColors.giv[300]};
	margin-top: 24px;
	color: ${brandColors.giv[300]};
`;

const BadgeWrapper = styled.div`
	display: flex;
	margin-top: 16px;
	justify-content: space-between;
`;

const Wrapper = styled.div`
	margin-right: 26px;
	margin-top: -32px;
	background: white;
	padding: 32px;
	overflow: hidden;
	width: 326px;
	max-height: 470px;
	height: fit-content;
	border-radius: 40px;
	position: relative;
	box-shadow: ${Shadow.Neutral['400']};
	flex-shrink: 0;
	z-index: 20;

	${mediaQueries['xl']} {
		position: sticky;
		position: -webkit-sticky;
		align-self: flex-start;
		top: 168px;
	}
`;

const FullButton = styled(Button)`
	width: 100%;

	&:disabled {
		background-color: ${neutralColors.gray[600]};
		color: ${neutralColors.gray[100]};
	}
`;

const FullOutlineButton = styled(OulineButton)`
	width: 100%;
	margin-top: 8px;
`;

const ArchiveButton = styled(Button)`
	width: 100%;
	margin: 12px 0px;
	color: ${brandColors.giv[500]};

	&:hover {
		color: ${brandColors.giv[500]};
		background-color: transparent;
	}
`;

export default ProjectDonateCard;
