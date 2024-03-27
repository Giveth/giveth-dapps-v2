import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	neutralColors,
	P,
	Container,
	Flex,
} from '@giveth/ui-design-system';
import Link from 'next/link';

import { useIntl } from 'react-intl';
import ProfileDonationsTab from './donationsTab/ProfileDonationsTab';
import ProfileLikedTab from './ProfileLikedTab';
import ProfileProjectsTab from './projectsTab/ProfileProjectsTab';
import ProfileOverviewTab from './ProfileOverviewTab';
import { IUserProfileView } from './UserProfile.view';
import { ProfileBoostedTab } from './boostedTab/ProfileBoostedTab';
import { PublicProfileBoostedTab } from './boostedTab/PublicProfileBoostedTab';
import { useProfileContext } from '@/context/profile.context';

enum EProfile {
	OVERVIEW,
	GIVPOWER,
	PROJECTS,
	DONATIONS,
	LIKED,
}

interface ITab {
	$active: boolean;
}

const ProfileContributes: FC<IUserProfileView> = () => {
	const router = useRouter();
	const [tab, setTab] = useState(EProfile.OVERVIEW);
	const { user, myAccount } = useProfileContext();
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
			case 'recurring-donations':
				setTab(EProfile.DONATIONS);
				break;
			case 'liked':
				setTab(EProfile.LIKED);
				break;
			default:
				setTab(EProfile.OVERVIEW);
		}
	}, [router?.query?.tab]);

	const baseQuery = myAccount ? {} : { address: router.query.address };

	return (
		<Container>
			<ProfileTabsContainer>
				<Link
					href={{
						query: {
							tab: 'overview',
							...baseQuery,
						},
					}}
				>
					<ProfileTab $active={tab === EProfile.OVERVIEW}>
						{formatMessage({ id: 'label.overview' })}
					</ProfileTab>
				</Link>
				<Link
					href={{
						query: { tab: 'givpower', ...baseQuery },
					}}
				>
					<ProfileTab $active={tab === EProfile.GIVPOWER}>
						{`${
							myAccount
								? formatMessage({ id: 'label.my_givpower' })
								: 'GIVpower'
						}`}
						{myAccount && user?.boostedProjectsCount !== 0 && (
							<Count $active={tab === EProfile.GIVPOWER}>
								{user?.boostedProjectsCount}
							</Count>
						)}
					</ProfileTab>
				</Link>
				<Link
					href={{
						query: { tab: 'projects', ...baseQuery },
					}}
				>
					<ProfileTab $active={tab === EProfile.PROJECTS}>
						{`${
							myAccount
								? formatMessage({ id: 'label.my_projects' })
								: formatMessage({ id: 'label.projects' })
						}`}
						{myAccount && user?.projectsCount != 0 && (
							<Count $active={tab === EProfile.PROJECTS}>
								{user?.projectsCount}
							</Count>
						)}
					</ProfileTab>
				</Link>
				<Link
					href={{
						query: { tab: 'donations', ...baseQuery },
					}}
				>
					<ProfileTab $active={tab === EProfile.DONATIONS}>
						{`${
							myAccount
								? formatMessage({
										id: 'label.my_donations',
									})
								: formatMessage({ id: 'label.donations' })
						}`}
						{myAccount && user?.donationsCount != 0 && (
							<Count $active={tab === EProfile.DONATIONS}>
								{user?.donationsCount}
							</Count>
						)}
					</ProfileTab>
				</Link>
				<Link
					href={{
						query: { tab: 'liked', ...baseQuery },
					}}
				>
					<ProfileTab
						$active={tab === EProfile.LIKED}
						onClick={() => setTab(EProfile.LIKED)}
					>
						{formatMessage({ id: 'label.liked_projects' })}
						{myAccount && !!user?.likedProjectsCount && (
							<Count $active={tab === EProfile.LIKED}>
								{user?.likedProjectsCount}
							</Count>
						)}
					</ProfileTab>
				</Link>
			</ProfileTabsContainer>
			{tab === EProfile.OVERVIEW && <ProfileOverviewTab />}
			{tab === EProfile.GIVPOWER &&
				(myAccount ? (
					<ProfileBoostedTab />
				) : (
					<PublicProfileBoostedTab />
				))}
			{tab === EProfile.PROJECTS && <ProfileProjectsTab />}
			{tab === EProfile.DONATIONS && <ProfileDonationsTab />}
			{tab === EProfile.LIKED && <ProfileLikedTab />}
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
		props.$active ? brandColors.deep[600] : brandColors.pinky[500]};
	${props =>
		props.$active &&
		`
		background: ${neutralColors.gray[100]};
		box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
		border-radius: 50px;
	`}
`;

const Count = styled.div<ITab>`
	background-color: ${(props: ITab) =>
		props.$active ? neutralColors.gray[500] : brandColors.pinky[500]};
	color: white;
	width: 24px;
	height: 24px;
	text-align: center;
	border-radius: 50%;
	font-size: 12px;
	margin-left: 4px;
`;

export default ProfileContributes;
