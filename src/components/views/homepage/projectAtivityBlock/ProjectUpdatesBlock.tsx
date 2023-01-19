import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import {
	ISwiperPaginationItem,
	SwiperPagination,
} from '@/components/SwiperPagination';

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

export const ProjectUpdatesBlock = () => {
	const [swiper, setSwiper] = useState<SwiperType>();

	return (
		<>
			<SwiperPagination swiper={swiper} items={items} />
			<Swiper slidesPerView={1} onSwiper={setSwiper}>
				<SwiperSlide>Slide 1</SwiperSlide>
				<SwiperSlide>Slide 2</SwiperSlide>
				<SwiperSlide>Slide 3</SwiperSlide>
				<SwiperSlide>Slide 4</SwiperSlide>
				...
			</Swiper>
		</>
	);
};
