import styled from 'styled-components';
import { H1, Lead } from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import { client } from '@/apollo/apolloClient';
import { ICampaign } from '@/apollo/types/types';
import ProjectsCampaignBlock from '@/components/views/homepage/ProjectsCampaignBlock';
import { FETCH_CAMPAIGN_BY_SLUG } from '@/apollo/gql/gqlCampaign';
import { useAppSelector } from '@/features/hooks';

interface IImpactDenver {
	campaign?: ICampaign;
}

const ImpactDenver: FC<IImpactDenver> = props => {
	const [campaign, setCampaign] = useState<ICampaign | undefined>(
		props.campaign,
	);
	const { userData: user } = useAppSelector(state => state.user);

	useEffect(() => {
		if (!user?.id) return;
		const getCampaign = async () => {
			const { data } = await client.query({
				query: FETCH_CAMPAIGN_BY_SLUG,
				variables: {
					slug: 'ethDenver',
					connectedWalletUserId: Number(user?.id),
				},
				fetchPolicy: 'no-cache',
			});
			if (data.findCampaignBySlug) {
				setCampaign(data.findCampaignBySlug);
			}
		};
		getCampaign();
	}, [user?.id]);

	return (
		<Wrapper>
			<H1 weight={700}>Impact @ Denver</H1>
			<Lead size='large'>
				We’re all about supporting real world impact at Giveth. If
				you’re feeling generous and want to take part in our Impact
				Quests, discover some of our favorite on-the-ground projects in
				the Denver area.
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
