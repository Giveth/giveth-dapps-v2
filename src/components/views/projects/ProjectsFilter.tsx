import { brandColors, neutralColors } from '@giveth/ui-design-system';

import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import { useRef } from 'react';

function ProjectsFilter() {
	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);

	return (
		<div style={{ maxWidth: '50%' }}>
			<Swiper
				modules={[Navigation]}
				onSlideChange={() => console.log('slide change')}
				onSwiper={swiper => console.log(swiper)}
				navigation={{
					prevEl: navigationPrevRef.current,
					nextEl: navigationNextRef.current,
				}}
				slidesPerView='auto'
				spaceBetween={16}
			>
				<button ref={navigationPrevRef}>Prev</button>
				<SwiperSlide>
					<MainCategoryItem>All</MainCategoryItem>
				</SwiperSlide>
				<SwiperSlide>
					<MainCategoryItem>Environment and Energy</MainCategoryItem>
				</SwiperSlide>
				<SwiperSlide>
					<MainCategoryItem>
						<SwiperSlide>Slide 4</SwiperSlide>
					</MainCategoryItem>
				</SwiperSlide>

				<SwiperSlide>
					<MainCategoryItem>Slide 6</MainCategoryItem>
				</SwiperSlide>

				<SwiperSlide>
					<MainCategoryItem>Slide 7</MainCategoryItem>
				</SwiperSlide>
				<SwiperSlide>
					<MainCategoryItem>Slide 8</MainCategoryItem>
				</SwiperSlide>
				<SwiperSlide>
					<MainCategoryItem>Slide 8</MainCategoryItem>
				</SwiperSlide>
				<SwiperSlide>
					<MainCategoryItem>Slide 8</MainCategoryItem>
				</SwiperSlide>
				<SwiperSlide>
					<MainCategoryItem>Slide 8</MainCategoryItem>
				</SwiperSlide>
				<button ref={navigationNextRef}>Next</button>
			</Swiper>
		</div>
	);
}

export default ProjectsFilter;

const MainCategoryItem = styled.div<{ isSelected?: boolean }>`
	border-radius: 50px;
	background: ${props =>
		!props.isSelected ? neutralColors.gray[300] : brandColors.giv[600]};
	color: ${props => (!props.isSelected ? 'black' : 'white')};
	padding: 16px;
	:hover {
		cursor: pointer;
	}
	font-weight: 400;
	text-align: center;
`;
