import {
	Subline,
	brandColors,
	P,
	neutralColors,
	mediaQueries,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useProjectContext } from '@/context/project.context';
import Routes from '@/lib/constants/Routes';
import { EProjectPageTabs } from './ProjectIndex';
import { Shadow } from '@/components/styled-components/Shadow';

interface IProjectTabs {
	activeTab: number;
	slug: string;
	verified?: boolean;
}

const badgeCount = (count?: number) => {
	return count || null;
};

const ProjectTabs = (props: IProjectTabs) => {
	const { activeTab, slug, verified } = props;
	const { projectData, totalDonationsCount, boostersData } =
		useProjectContext();
	const { totalProjectUpdates } = projectData || {};
	const { formatMessage } = useIntl();

	const tabsArray = [
		{ title: 'label.about' },
		{
			title: 'label.updates',
			badge: totalProjectUpdates,
			query: EProjectPageTabs.UPDATES,
		},
		{
			title: 'label.donations',
			badge: totalDonationsCount,
			query: EProjectPageTabs.DONATIONS,
		},
	];

	if (projectData?.verified)
		tabsArray.push({
			title: 'label.givpower',
			badge: boostersData?.powerBoostings.length,
			query: EProjectPageTabs.GIVPOWER,
		});

	return (
		<Wrapper>
			<InnerWrapper>
				{tabsArray.map((i, index) => (
					<Link
						key={i.title}
						href={`${Routes.Project}/${slug}${
							i.query ? `?tab=${i.query}` : ''
						}`}
						scroll={false}
						onClick={e => {
							if (
								!verified &&
								i.query === EProjectPageTabs.UPDATES
							) {
								e.preventDefault(); // Prevent the link from navigating from unverified users
							}
						}}
					>
						<Tab
							className={activeTab === index ? 'active' : ''}
							$unverified={
								!verified &&
								i.query === EProjectPageTabs.UPDATES
							}
						>
							{formatMessage({ id: i.title })}
							{badgeCount(i.badge) && (
								<Badge
									className={
										activeTab === index ? 'active' : ''
									}
									color='white'
								>
									{i.badge}
								</Badge>
							)}
						</Tab>
					</Link>
				))}
			</InnerWrapper>
		</Wrapper>
	);
};

const InnerWrapper = styled(Flex)`
	margin: 0 auto;
	max-width: 1200px;
	align-items: center;
	gap: 24px;
	padding: 0 24px;
	${mediaQueries.desktop} {
		padding: 0;
	}
`;

const Badge = styled(Subline)`
	background: ${neutralColors.gray[800]};
	color: #ffffff;
	border-radius: 40px;
	height: 22px;
	padding: 0 9px;
	display: flex;
	align-items: center;
	margin-left: 6px;
	&.active {
		background: ${brandColors.pinky[500]};
	}
`;

interface TabProps {
	$unverified?: boolean;
}

const Tab = styled(P)<TabProps>`
	display: flex;
	padding: 9px 24px;
	border-radius: 48px;
	cursor: pointer;
	&.active {
		font-weight: 500;
		color: ${brandColors.pinky[500]};
		background: ${neutralColors.gray[200]};
	}
	opacity: ${({ $unverified }) => ($unverified ? '0.5' : '1')};
`;

const Wrapper = styled.div`
	width: 100%;
	padding: 16px 0;
	color: ${neutralColors.gray[800]};
	height: min-content;
	margin-top: 24px;
	position: relative;
	background-color: white;
	overflow-x: auto;
	box-shadow: ${Shadow.Neutral[400]};
`;

export default ProjectTabs;
