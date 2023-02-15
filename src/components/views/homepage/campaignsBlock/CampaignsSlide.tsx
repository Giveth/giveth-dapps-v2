import { FC } from 'react';
import { GLink, H2, H4 } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { ICampaign } from '@/apollo/types/types';
import { Col, Row } from '@/components/Grid';

interface ICampaignsSlideProps {
	campaign: ICampaign;
}

export const CampaignsSlide: FC<ICampaignsSlideProps> = ({ campaign }) => {
	return (
		<Row>
			<ContentCol sm={12} md={5}>
				<H2>{campaign.title}</H2>
				<H4>{campaign.description}</H4>
				<GLink>Explore </GLink>
			</ContentCol>
			<Col sm={12} md={7}>
				<ImageWrapper>
					<Image
						src={
							campaign.media ||
							'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
						}
						alt='campaign image'
						fill
						style={{ objectFit: 'cover' }}
					/>
				</ImageWrapper>
			</Col>
		</Row>
	);
};

const ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 314px;
`;

const ContentCol = styled(Col)`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 24px;
	flex-direction: column;
`;
