import styled from 'styled-components';
import { brandColors, H1, Lead } from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import ExternalLink from '@/components/ExternalLink';
import { client } from '@/apollo/apolloClient';
import { FETCH_CAMPAIGNS } from '@/apollo/gql/gqlCampaign';
import { ICampaign } from '@/apollo/types/types';
import ProjectsCampaignBlock from '@/components/views/homepage/ProjectsCampaignBlock';

const ImpactDenver = () => {
	const [campaign, setCampaign] = useState<ICampaign>();

	useEffect(() => {
		const getCampaigns = async () => {
			const { data } = await client.query({
				query: FETCH_CAMPAIGNS,
				fetchPolicy: 'no-cache',
			});
			console.log(data);
			setCampaign(data?.campaigns[0]);
		};
		getCampaigns().catch(console.log);
	}, []);

	return (
		<Wrapper>
			<H1 weight={700}>Impact @ Denver</H1>
			<Lead size='large'>
				We’re all about supporting real world impact at Giveth. If
				you’re feeling generous and want to take part in our{' '}
				<ExternalLink
					color={brandColors.pinky[500]}
					href=''
					title='Impact Quests'
				/>
				, discover some of our favorite on-the-ground projects in the
				Denver area.
			</Lead>
			{campaign && <ProjectsCampaignBlock campaign={campaign} />}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 0 40px;
	margin: 40px 0 80px;
	> h1 {
		margin-bottom: 40px;
	}
`;

export default ImpactDenver;
