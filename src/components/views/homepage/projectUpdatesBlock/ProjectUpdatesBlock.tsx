import React, { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import { Navigation } from 'swiper';
import styled from 'styled-components';
import { H4, neutralColors } from '@giveth/ui-design-system';
import {
	ISwiperPaginationItem,
	SwiperPagination,
} from '@/components/SwiperPagination';
import { Flex } from '@/components/styled-components/Flex';
import { IProject } from '@/apollo/types/types';

const items: ISwiperPaginationItem[] = [
	{
		label: '1',
		page: 0,
	},
	{
		label: '2',
		page: 1,
	},
	{
		label: '3',
		page: 2,
	},
	{
		label: '4',
		page: 3,
	},
	{
		label: '5',
		page: 4,
	},
	{
		label: '6',
		page: 5,
	},
];

interface IProjectUpdatesBlockProps {
	projects: IProject[];
}

export const ProjectUpdatesBlock: FC<IProjectUpdatesBlockProps> = () => {
	const [swiper, setSwiper] = useState<SwiperType>();

	return (
		<>
			<Header>
				<BlockTitle>Awesome Project Updates</BlockTitle>
				<SwiperPagination swiper={swiper} items={items} />
			</Header>
			<Swiper
				slidesPerView={1}
				onSwiper={setSwiper}
				modules={[Navigation]}
				navigation={{
					nextEl: '#homeCampaignNext',
					prevEl: '#homeCampaignPrev',
				}}
			>
				<SwiperSlide>Slide 1</SwiperSlide>
				<SwiperSlide>Slide 2</SwiperSlide>
				<SwiperSlide>Slide 3</SwiperSlide>
				<SwiperSlide>Slide 4</SwiperSlide>
				...
			</Swiper>
		</>
	);
};

const Header = styled(Flex)`
	justify-content: space-between;
	align-items: center;
`;

const BlockTitle = styled(H4)`
	color: ${neutralColors.gray[600]};
`;
