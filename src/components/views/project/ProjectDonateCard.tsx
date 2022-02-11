import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import { Shadow } from '@/components/styled-components/Shadow';
import CategoryBadge from '@/components/badges/CategoryBadge';
import Routes from '@/lib/constants/Routes';
import { slugToProjectDonate, mediaQueries } from '@/lib/helpers';
import InfoBadge from '@/components/badges/InfoBadge';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
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
import DeactivateProjectModal from '@/components/modals/DeactivateProjectModal';
import ArchiveIcon from '../../../../public/images/icons/archive.svg';

const ProjectDonateCard = (props: IProjectBySlug) => {
	const {
		state: { user },
	} = useUser();

	const { project } = props;
	const { categories, slug, reactions, description, adminUser } = project;

	const [heartedByUser, setHeartedByUser] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [deactivateModal, setDeactivateModal] = useState<boolean>(false);

	const isCategories = categories.length > 0;

	const router = useRouter();

	useEffect(() => {
		if (user?.id) {
			const isHearted = !!reactions?.some(
				i => Number(i.userId) === Number(user.id),
			);
			setHeartedByUser(isHearted);
		}
	}, [reactions, user]);

	useEffect(() => {
		if (adminUser?.walletAddress === user?.walletAddress) {
			setIsAdmin(true);
		}
	}, [user, adminUser]);

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
			{deactivateModal && (
				<DeactivateProjectModal
					showModal={deactivateModal}
					setShowModal={setDeactivateModal}
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
					<ShareLikeBadge type='like' active={heartedByUser} />
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
						label='ARCHIVE PROJECT'
						icon={<Image src={ArchiveIcon} alt='Archive icon.' />}
						onClick={() => setDeactivateModal(true)}
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
