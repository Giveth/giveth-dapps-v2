import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { brandColors, neutralColors, P } from '@giveth/ui-design-system';
import Link from 'next/link';

import { useIntl } from 'react-intl';
import { Container } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import ProfileDonationsTab from './donationsTab/ProfileDonationsTab';
import ProfileLikedTab from './ProfileLikedTab';
import ProfileProjectsTab from './projectsTab/ProfileProjectsTab';
import ProfileOverviewTab from './ProfileOverviewTab';
import { IUserProfileView } from './UserProfile.view';
import { ProfileBoostedTab } from './boostedTab/ProfileBoostedTab';
import { profileTabs } from '@/lib/constants/Routes';
import { removeQueryParam } from '@/helpers/url';

enum EProfile {
	OVERVIEW,
	GIVPOWER,
	PROJECTS,
	DONATIONS,
	LIKED,
}

interface ITab {
	active: boolean;
}

const ProfileContributes: FC<IUserProfileView> = ({ user, myAccount }) => {
	const router = useRouter();
	const [tab, setTab] = useState(EProfile.OVERVIEW);
	const { formatMessage } = useIntl();

	useEffect(() => {
		const tab = router?.query?.tab;
		switch (tab) {
			case 'overview':
				setTab(EProfile.OVERVIEW);
				break;
			case 'givpower':
				setTab(EProfile.GIVPOWER);
				break;
			case 'projects':
				setTab(EProfile.PROJECTS);
				break;
			case 'donations':
				setTab(EProfile.DONATIONS);
				break;
			case 'liked':
				setTab(EProfile.LIKED);
				break;
			default:
				setTab(EProfile.OVERVIEW);
		}
	}, [router?.query?.tab]);

	const pathname = removeQueryParam(router.asPath, ['tab'], true);

	return (
		<Container>
			<ProfileTabsContainer>
				<Link href={pathname + profileTabs.overview}>
					<ProfileTab active={tab === EProfile.OVERVIEW}>
						{formatMessage({ id: 'label.overview' })}
					</ProfileTab>
				</Link>
				<Link href={pathname + profileTabs.givpower}>
					<ProfileTab active={tab === EProfile.GIVPOWER}>
						{`${
							myAccount
								? formatMessage({ id: 'label.my_givpower' })
								: 'GIVpower'
						}`}
						{myAccount && user?.boostedProjectsCount !== 0 && (
							<Count active={tab === EProfile.GIVPOWER}>
								{user?.boostedProjectsCount}
							</Count>
						)}
					</ProfileTab>
				</Link>
				<Link href={pathname + profileTabs.projects}>
					<ProfileTab active={tab === EProfile.PROJECTS}>
						{`${
							myAccount
								? formatMessage({ id: 'label.my_projects' })
								: formatMessage({ id: 'label.projects' })
						}`}
						{myAccount && user?.projectsCount != 0 && (
							<Count active={tab === EProfile.PROJECTS}>
								{user?.projectsCount}
							</Count>
						)}
					</ProfileTab>
				</Link>
				<Link href={pathname + profileTabs.donations}>
					<ProfileTab active={tab === EProfile.DONATIONS}>
						{`${
							myAccount
								? formatMessage({
										id: 'label.my_donations',
								  })
								: formatMessage({ id: 'label.donations' })
						}`}
						{myAccount && user?.donationsCount != 0 && (
							<Count active={tab === EProfile.DONATIONS}>
								{user?.donationsCount}
							</Count>
						)}
					</ProfileTab>
				</Link>
				<Link href={pathname + profileTabs.likedProjects}>
					<ProfileTab
						active={tab === EProfile.LIKED}
						onClick={() => setTab(EProfile.LIKED)}
					>
						{formatMessage({ id: 'label.liked_projects' })}
						{myAccount && !!user.likedProjectsCount && (
							<Count active={tab === EProfile.LIKED}>
								{user?.likedProjectsCount}
							</Count>
						)}
					</ProfileTab>
				</Link>
			</ProfileTabsContainer>
			{tab === EProfile.OVERVIEW && (
				<ProfileOverviewTab user={user} myAccount={myAccount} />
			)}
			{tab === EProfile.GIVPOWER && (
				<ProfileBoostedTab user={user} myAccount={myAccount} />
			)}
			{tab === EProfile.PROJECTS && (
				<ProfileProjectsTab user={user} myAccount={myAccount} />
			)}
			{tab === EProfile.DONATIONS && (
				<ProfileDonationsTab user={user} myAccount={myAccount} />
			)}
			{tab === EProfile.LIKED && (
				<ProfileLikedTab user={user} myAccount={myAccount} />
			)}
		</Container>
	);
};

const ProfileTabsContainer = styled(Flex)`
	padding: 37px 0;
	gap: 16px;
	overflow: auto;
`;

const ProfileTab = styled(P)<ITab>`
	display: flex;
	align-items: center;
	padding: 9px 10px;
	word-break: break-word;
	white-space: nowrap;
	cursor: pointer;
	color: ${(props: ITab) =>
		props.active ? brandColors.deep[600] : brandColors.pinky[500]};
	${props =>
		props.active &&
		`
		background: ${neutralColors.gray[100]};
		box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
		border-radius: 50px;
	`}
`;

const Count = styled.div`
	background-color: ${(props: ITab) =>
		props.active ? neutralColors.gray[500] : brandColors.pinky[500]};
	color: white;
	width: 24px;
	height: 24px;
	text-align: center;
	border-radius: 50%;
	font-size: 12px;
	margin-left: 4px;
`;

export default ProfileContributes;
