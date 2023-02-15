import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { neutralColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import { Container, Row } from '@/components/Grid';
import { SwiperPagination } from '@/components/SwiperPagination';
import { BlockHeader, BlockTitle } from '../common';
import { ICampaign } from '@/apollo/types/types';
import { CampaignsSlide } from './CampaignsSlide';
import TrazadoPink from '/public/images/trazado-pink.svg';

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
					<TrazadoPinkWrapper>
						<Image
							src={TrazadoPink}
							width={216}
							height={38}
							alt='wave'
						/>
					</TrazadoPinkWrapper>
				</BlockHeader>
				<SwiperWrapper>
					<Swiper
						slidesPerView={1}
						onSwiper={setSwiper}
						spaceBetween={24}
					>
						{campaigns.map(campaign => (
							<SwiperSlide key={campaign.id}>
								<CampaignsSlide campaign={campaign} />
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

const TrazadoPinkWrapper = styled.div`
	position: absolute;
	top: -44px;
	left: -151px;
`;
