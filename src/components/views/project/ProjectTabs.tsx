import {
	Subline,
	brandColors,
	P,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import Link from 'next/link';
import { mediaQueries } from '@/lib/constants/constants';
import { Shadow } from '@/components/styled-components/Shadow';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { EProjectPageTabs } from './ProjectIndex';

interface IProjectTabs {
	activeTab: number;
	slug: string;
	totalDonations?: number;
}

const badgeCount = (count?: number) => {
	return count || null;
};

const ProjectTabs = (props: IProjectTabs) => {
	const { activeTab, slug, totalDonations } = props;
	const { projectData } = useProjectContext();
	const { totalProjectUpdates } = projectData || {};
	const { formatMessage } = useIntl();
	const { boostersData } = useProjectContext();

	const tabsArray = [
		{ title: 'label.about' },
		{
			title: 'label.updates',
			badge: totalProjectUpdates,
			query: EProjectPageTabs.UPDATES,
		},
		{
			title: 'label.donations',
			badge: totalDonations,
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
			{tabsArray.map((i, index) => (
				<Link
					key={i.title}
					href={`${Routes.Project}/${slug}${
						i.query ? `?tab=${i.query}` : ''
					}`}
					scroll={false}
				>
					<Tab className={activeTab === index ? 'active' : ''}>
						{formatMessage({ id: i.title })}
						{badgeCount(i.badge) && <Badge>{i.badge}</Badge>}
					</Tab>
				</Link>
			))}
		</Wrapper>
	);
};

const Badge = styled(Subline)`
	background: ${brandColors.pinky[500]};
	color: white;
	border-radius: 40px;
	height: 22px;
	padding: 0 9px;
	display: flex;
	align-items: center;
	margin-left: 6px;
`;

const Tab = styled(P)`
	display: flex;
	padding: 10px 35px;
	color: ${brandColors.pinky[500]};
	border-radius: 48px;
	cursor: pointer;

	&.active {
		color: ${brandColors.deep[600]};
		background: white;
		box-shadow: ${Shadow.Neutral[400]};
	}
`;

const Wrapper = styled(Flex)`
	padding: 24px 0 24px;
	margin-bottom: 14px;
	color: ${brandColors.deep[600]};
	align-items: center;
	z-index: 1;
	background-color: ${neutralColors.gray[100]};
	flex-wrap: nowrap;
	overflow-x: auto;

	${mediaQueries.tablet} {
		padding: 16px 0 24px;
		position: sticky;
		top: 220px;
	}
`;

export default ProjectTabs;
