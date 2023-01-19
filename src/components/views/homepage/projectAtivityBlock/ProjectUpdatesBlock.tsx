import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';

export const ProjectUpdatesBlock = () => {
	const swiperRef = useRef<SwiperType>();
	return (
		<Swiper
			slidesPerView={1}
			onSlideChange={() => console.log('slide change')}
			// onSwiper={swiper => (swiperRef.current = swiper)}
			onBeforeInit={swiper => (swiperRef.current = swiper)}
		>
			<SwiperSlide>Slide 1</SwiperSlide>
			<SwiperSlide>Slide 2</SwiperSlide>
			<SwiperSlide>Slide 3</SwiperSlide>
			<SwiperSlide>Slide 4</SwiperSlide>
			...
		</Swiper>
	);
};
