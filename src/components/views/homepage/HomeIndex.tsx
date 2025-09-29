import { FC, Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import HomeFromBlog from '@/components/views/homepage/HomeFromBlog';
import WhyGiveth from '@/components/views/homepage/whyGiveth';
import ProjectsCampaignBlock from '@/components/views/homepage/ProjectsCampaignBlock';
import IntroBlock from '@/components/views/homepage/introBlock';
import VideoBlock from '@/components/views/homepage/videoBlock';
import { CampaignsBlock } from '@/components/views/homepage/campaignsBlock/CampaignsBlock';
import HomePartners from '@/components/views/homepage/partners';
import GetUpdates from '@/components/GetUpdates';
import { useAppSelector } from '@/features/hooks';
import { client } from '@/apollo/apolloClient';
import { LatestUpdatesBlock } from '@/components/views/homepage/latestUpdates/LatestUpdatesBlock';
import { IHomeRoute } from '../../../../pages';
import { FETCH_CAMPAIGNS } from '@/apollo/gql/gqlHomePage';

const HomeIndex: FC<IHomeRoute> = props => {
	const { campaigns: campaignsFromServer, latestUpdates, ...rest } = props;
	const [campaigns, setCampaigns] = useState(campaignsFromServer);
	const featuredProjectsCampaigns = campaigns.filter(
		campaign => campaign.isFeatured && campaign.relatedProjects?.length > 0,
	);
	const newCampaigns = campaigns.filter(campaign => campaign.isNew);
	const userData = useAppSelector(state => state.user.userData);

	useEffect(() => {
		if (!userData?.id) return;
		async function fetchCampaigns() {
			const { data } = await client.query({
				query: FETCH_CAMPAIGNS,
				variables: {
					connectedWalletUserId: Number(userData?.id),
				},
				fetchPolicy: 'no-cache',
			});
			const _campaigns = data.campaigns;

			_campaigns && setCampaigns(_campaigns);
		}
		fetchCampaigns();
	}, [userData?.id]);

	return (
		<Wrapper>
			<IntroBlock />
			<Separator />
			<Separator />
			{featuredProjectsCampaigns.length > 0
				? featuredProjectsCampaigns.map(campaign => (
						<Fragment key={campaign.id}>
							<ProjectsCampaignBlock campaign={campaign} />
							<Separator />
						</Fragment>
					))
				: []}
			{newCampaigns && newCampaigns.length > 0 ? (
				<CampaignsBlock campaigns={newCampaigns} />
			) : null}
			<Separator />
			<WhyGiveth {...rest} />
			<Separator />
			<VideoBlock />
			<Separator />
			<Separator />
			<HomePartners />
			<Separator />
			<HomeFromBlog />
			<GetUpdates />
			<LatestUpdatesBlock updates={latestUpdates} />
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
