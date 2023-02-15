import { FC } from 'react';
import { GLink, H2, H4 } from '@giveth/ui-design-system';
import { ICampaign } from '@/apollo/types/types';
import { Col, Row } from '@/components/Grid';

interface ICampaignsSlideProps {
	campaign: ICampaign;
}

export const CampaignsSlide: FC<ICampaignsSlideProps> = ({ campaign }) => {
	return (
		<Row>
			<Col sm={12} md={4}>
				<H2>{campaign.title}</H2>
				<H4>{campaign.description}</H4>
				<GLink>Explore </GLink>
			</Col>
		</Row>
	);
};
