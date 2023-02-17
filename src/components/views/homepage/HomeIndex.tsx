import { FC } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import HomeFromBlog from './HomeFromBlog';
import HomeGetUpdates from './HomeGetUpdates';
import WhyGiveth from '@/components/views/homepage/whyGiveth';
import CampaignBlock from '@/components/views/homepage/CampaignBlock';
import IntroBlock from './introBlock';
import VideoBlock from './videoBlock';
import AboutGiveconomy from './aboutGiveconomy';
import { ProjectUpdatesBlock } from './projectUpdatesBlock/ProjectUpdatesBlock';
import { LatestUpdatesBlock } from './latestUpdates/LatestUpdatesBlock';
import { IHomeRoute } from '../../../../pages';
import InformationBlock from '@/components/views/homepage/InformationBlock';
import HomePartners from './partners';

const HomeIndex: FC<IHomeRoute> = props => {
	const { projects, ...rest } = props;
	return (
		<Wrapper>
			<IntroBlock />
			<Separator />
			<CampaignBlock projects={projects} />
			<Separator />
			<WhyGiveth {...rest} />
			<Separator />
			<VideoBlock />
			<Separator />
			<AboutGiveconomy />
			<Separator />
			<HomePartners />
			<Separator />
			<ProjectUpdatesBlock projects={projects} />
			<LatestUpdatesBlock latestUpdates={props.latestUpdates} />
			<Separator />
			<HomeFromBlog />
			<InformationBlock />
			<HomeGetUpdates />
		</Wrapper>
	);
};

const Separator = styled.div`
	width: 100%;
	height: 40px;
	background: ${neutralColors.gray[200]};
`;

const Wrapper = styled.div`
	background: white;
`;

export default HomeIndex;
