import { FC, Fragment } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import HomeFromBlog from './HomeFromBlog';
import WhyGiveth from '@/components/views/homepage/whyGiveth';
import ProjectsCampaignBlock from '@/components/views/homepage/ProjectsCampaignBlock';
import IntroBlock from './introBlock';
import VideoBlock from './videoBlock';
import AboutGiveconomy from './aboutGiveconomy';
import { IHomeRoute } from '../../../../pages';
import InformationBlock from '@/components/views/homepage/InformationBlock';
import { CampaignsBlock } from './campaignsBlock/CampaignsBlock';
import HomePartners from './partners';
import { EthDenverBanner } from '@/components/EthDenverBanner';

const HomeIndex: FC<IHomeRoute> = props => {
	const { campaigns, latestUpdates, ...rest } = props;
	const featuredProjectsCampaigns = campaigns.filter(
		campaign => campaign.isFeatured && campaign.relatedProjects?.length > 0,
	);
	const newCampaigns = campaigns.filter(campaign => campaign.isNew);
	return (
		<Wrapper>
			<IntroBlock />
			<Separator />
			<EthDenverBanner />
			<Separator />
			{featuredProjectsCampaigns.length > 0
				? featuredProjectsCampaigns.map(campaign => (
						<Fragment key={campaign.id}>
							<ProjectsCampaignBlock campaign={campaign} />
							<Separator />
						</Fragment>
				  ))
				: []}
			<InformationBlock />
			<Separator />
			<WhyGiveth {...rest} />
			<Separator />
			<VideoBlock />
			<Separator />
			<AboutGiveconomy />
			<Separator />
			<HomePartners />
			<Separator />
			{newCampaigns && newCampaigns.length > 0 ? (
				<CampaignsBlock campaigns={campaigns} />
			) : (
				''
			)}
			<HomeFromBlog />
			{/* <HomeGetUpdates /> */}
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
