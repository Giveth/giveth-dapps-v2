import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { neutralColors } from '@giveth/ui-design-system';
import { Container, Row } from '@/components/Grid';
import { SwiperPagination } from '@/components/SwiperPagination';
import { BlockHeader, BlockTitle } from './common';
import { ICampaign } from '@/apollo/types/types';

interface ICampaignsBlockProps {
	campaigns: ICampaign[];
}

export const CampaignsBlock: FC<ICampaignsBlockProps> = ({ campaigns }) => {
	const [swiper, setSwiper] = useState<SwiperType>();

	return (
		<CampaignsBlockWrapper>
			<Container>
				<BlockHeader>
					<BlockTitle>What’s up on Giveth</BlockTitle>
					<SwiperPagination
						swiper={swiper}
						itemsCount={campaigns.length}
					/>
				</BlockHeader>
				<SwiperWrapper>
					<Swiper
						slidesPerView={1}
						onSwiper={setSwiper}
						spaceBetween={24}
					>
						{campaigns.map(campaign => (
							<SwiperSlide key={campaign.id}>
								<div>{campaign.title}</div>
							</SwiperSlide>
						))}
					</Swiper>
				</SwiperWrapper>
			</Container>
		</CampaignsBlockWrapper>
	);
};

const CampaignsBlockWrapper = styled.div`
	padding-top: 70px;
	padding-bottom: 110px;
	background: ${neutralColors.gray[200]};
`;
const SwiperWrapper = styled(Row)``;
