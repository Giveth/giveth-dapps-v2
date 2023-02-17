import { FC } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import HomeFromBlog from './HomeFromBlog';
import HomeGetUpdates from './HomeGetUpdates';
import WhyGiveth from '@/components/views/homepage/whyGiveth';
import ProjectsCampaignBlock from '@/components/views/homepage/ProjectsCampaignBlock';
import IntroBlock from './introBlock';
import VideoBlock from './videoBlock';
import { IHomeRoute } from '../../../../pages';
import InformationBlock from '@/components/views/homepage/InformationBlock';
import { CampaignsBlock } from './campaignsBlock/CampaignsBlock';
import HomePartners from './partners';

const HomeIndex: FC<IHomeRoute> = props => {
	const { campaigns, latestUpdates, ...rest } = props;
	const featuredProjectsCampaigns = campaigns.filter(
		campaign => campaign.isFeatured && campaign.relatedProjects.length > 0,
	);
	return (
		<Wrapper>
			<IntroBlock />
			<Separator />
			{featuredProjectsCampaigns.length > 0
				? featuredProjectsCampaigns.map(campaign => (
						<ProjectsCampaignBlock
							key={campaign.id}
							campaign={campaign}
						/>
				  ))
				: []}
			<Separator />
			<InformationBlock />
			<Separator />
			<WhyGiveth {...rest} />
			<Separator />
			<VideoBlock />
			<Separator />
			<HomePartners />
			<Separator />
			{campaigns && campaigns.length > 0 ? (
				<CampaignsBlock campaigns={campaigns} />
			) : (
				''
			)}
			<HomeFromBlog />
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
