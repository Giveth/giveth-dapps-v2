import { FC, Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import HomeFromBlog from './HomeFromBlog';
import WhyGiveth from '@/components/views/homepage/whyGiveth';
import ProjectsCampaignBlock from '@/components/views/homepage/ProjectsCampaignBlock';
import IntroBlock from './introBlock';
import VideoBlock from './videoBlock';
import AboutGiveconomy from './aboutGiveconomy';
import { HOME_QUERY_VARIABLES, IHomeRoute } from '../../../../pages';
import InformationBlock from '@/components/views/homepage/InformationBlock';
import { CampaignsBlock } from './campaignsBlock/CampaignsBlock';
import HomePartners from './partners';
import GetUpdates from '@/components/GetUpdates';
import { ProjectUpdatesBlock } from './projectUpdatesBlock/ProjectUpdatesBlock';
import { useAppSelector } from '@/features/hooks';
import { client } from '@/apollo/apolloClient';
import { FETCH_HOMEPAGE_DATA } from '@/apollo/gql/gqlHomePage';
import { LatestUpdatesBlock } from './latestUpdates/LatestUpdatesBlock';

const HomeIndex: FC<IHomeRoute> = props => {
	const {
		campaigns: campaignsFromServer,
		featuredProjects: featuredProjectsFromServer,
		latestUpdates,
		...rest
	} = props;
	const [campaigns, setCampaigns] = useState(campaignsFromServer);
	const [featuredProjects, setFeaturedProjects] = useState(
		featuredProjectsFromServer,
	);
	const featuredProjectsCampaigns = campaigns.filter(
		campaign => campaign.isFeatured && campaign.relatedProjects?.length > 0,
	);
	const newCampaigns = campaigns.filter(campaign => campaign.isNew);
	const userData = useAppSelector(state => state.user.userData);

	useEffect(() => {
		if (!userData?.id) return;
		async function fetchFeaturedUpdateProjects() {
			const { data } = await client.query({
				query: FETCH_HOMEPAGE_DATA,
				variables: {
					...HOME_QUERY_VARIABLES,
					connectedWalletUserId: Number(userData?.id),
				},
				fetchPolicy: 'no-cache',
			});
			const _campaigns = data.campaigns;
			const _featuredProjects = data.featuredProjects.projects;

			_campaigns && setCampaigns(_campaigns);
			_featuredProjects && setFeaturedProjects(_featuredProjects);
		}
		fetchFeaturedUpdateProjects();
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
			<HomeFromBlog />
			<GetUpdates />
			{featuredProjects && featuredProjects.length > 0 ? (
				<ProjectUpdatesBlock projects={featuredProjects} />
			) : null}
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
