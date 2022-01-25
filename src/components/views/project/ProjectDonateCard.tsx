import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import { Shadow } from '@/components/styled-components/Shadow';
import CategoryBadge from '@/components/badges/CategoryBadge';
import Routes from '@/lib/constants/Routes';
import { slugToProjectDonate } from '@/lib/helpers';
import InfoBadge from '@/components/badges/InfoBadge';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import links from '@/lib/constants/links';
import { Button, brandColors, GLink } from '@giveth/ui-design-system';
import styled from 'styled-components';
import useUser from '@/context/UserProvider';

const ProjectDonateCard = (props: IProjectBySlug) => {
	const {
		state: { user },
	} = useUser();

	const { project } = props;
	const { categories, slug, reactions } = project;

	const [heartedByUser, setHeartedByUser] = useState(false);

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

	return (
		<Wrapper>
			<DonateButton
				onClick={() => router.push(slugToProjectDonate(slug))}
				label='DONATE'
			></DonateButton>
			<BadgeWrapper>
				<ShareLikeBadge type='share' />
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
		</Wrapper>
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
	max-height: 450px;
	height: fit-content;
	border-radius: 40px;
	position: relative;
	box-shadow: ${Shadow.Neutral['400']};
	flex-shrink: 0;
	position: sticky;
	position: -webkit-sticky;
	align-self: flex-start;
	top: calc(22.5% - 24px);
`;

const DonateButton = styled(Button)`
	width: 100%;
`;

export default ProjectDonateCard;
