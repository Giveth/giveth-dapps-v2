import { FC, Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import HomeFromBlog from '@/components/views/homepage/HomeFromBlog';
import WhyGiveth from '@/components/views/homepage/whyGiveth';
import ProjectsCampaignBlock from '@/components/views/homepage/ProjectsCampaignBlock';
import IntroBlock from '@/components/views/homepage/introBlock';
import VideoBlock from '@/components/views/homepage/videoBlock';
import AboutGiveconomy from '@/components/views/homepage/aboutGiveconomy';
import InformationBlock from '@/components/views/homepage/InformationBlock';
import { CampaignsBlock } from '@/components/views/homepage/campaignsBlock/CampaignsBlock';
import HomePartners from '@/components/views/homepage/partners';
import GetUpdates from '@/components/GetUpdates';
import { ProjectUpdatesBlock } from '@/components/views/homepage/projectUpdatesBlock/ProjectUpdatesBlock';
import { useAppSelector } from '@/features/hooks';
import { client } from '@/apollo/apolloClient';
import { FETCH_CAMPAIGNS_AND_FEATURED_PROJECTS } from '@/apollo/gql/gqlHomePage';
import { LatestUpdatesBlock } from '@/components/views/homepage/latestUpdates/LatestUpdatesBlock';
import StorageLabel from '@/lib/localStorage';
import TorusBanner from '@/components/views/homepage/TorusBanner';
import { IHomeRoute } from '../../../../pages';

const HomeIndex: FC<IHomeRoute> = props => {
	const {
		campaigns: campaignsFromServer,
		featuredProjects: featuredProjectsFromServer,
		latestUpdates,
		...rest
	} = props;
	const [campaigns, setCampaigns] = useState(campaignsFromServer);
	const [showTorusBanner, setShowTorusBanner] = useState(false);
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
				query: FETCH_CAMPAIGNS_AND_FEATURED_PROJECTS,
				variables: {
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

	useEffect(() => {
		setShowTorusBanner(
			!localStorage.getItem(StorageLabel.TORUS_BANNER_VIEWED),
		);
	}, []);

	return (
		<Wrapper>
			{showTorusBanner && <TorusBanner />}
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
