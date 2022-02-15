import { Dispatch, SetStateAction } from 'react';
import { Shadow } from '@/components/styled-components/Shadow';
import { IProject } from '@/apollo/types/types';
import { Subline, brandColors, P } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/helpers';
import styled from 'styled-components';

interface IProjectTabs {
	project: IProject;
	activeTab: number;
	totalDonations?: number;
	setActiveTab: Dispatch<SetStateAction<number>>;
}

const badgeCount = (count?: number) => {
	return count || null;
};

const ProjectTabs = (props: IProjectTabs) => {
	const { project, activeTab, setActiveTab, totalDonations } = props;
	const { totalProjectUpdates } = project;

	const tabsArray = [
		{ title: 'About' },
		{ title: 'Updates', badge: totalProjectUpdates },
		{ title: 'Donations', badge: totalDonations },
	];

	return (
		<Wrapper>
			{tabsArray.map((i, index) => (
				<Tab
					onClick={() => setActiveTab(index)}
					key={i.title}
					className={activeTab === index ? 'active' : ''}
				>
					{i.title}
					{badgeCount(i.badge) && <Badge>{i.badge}</Badge>}
				</Tab>
			))}
		</Wrapper>
	);
};

const Badge = styled(Subline)`
	background: ${brandColors.deep[600]};
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

const Wrapper = styled.div`
	padding: 24px 0 24px 0;
	margin-bottom: 16px;
	color: ${brandColors.deep[600]};
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	position: sticky;
	top: 200px;
	z-index: 10;

	${mediaQueries['xl']} {
		padding: 8px 0 12px;
		position: sticky;
		top: 200px;
		z-index: 10;
	}
`;

export default ProjectTabs;
