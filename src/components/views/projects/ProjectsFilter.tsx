import { brandColors, neutralColors } from '@giveth/ui-design-system';

import styled from 'styled-components';
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import { useRef } from 'react';
import { IProjectsView } from './ProjectsIndex';
import { Shadow } from '@/components/styled-components/Shadow';

function ProjectsFilter({ projectsProps }: { projectsProps: IProjectsView }) {
	const navigationPrevRef = useRef(null);
	const navigationNextRef = useRef(null);
	const mySwiper = useSwiper();
	const mySwiperSlide = useSwiperSlide();
	console.log('mySwiper', mySwiper?.allowSlideNext);
	console.log('mySwiperSlide', mySwiperSlide);
	console.log('Propss', projectsProps.mainCategories);
	console.log('Current', navigationNextRef.current);
	return (
		// <div style={{ maxWidth: '50%', display: 'flex' }}>
		<Container>
			<PrevIcon ref={navigationPrevRef}>
				<img src={'/images/caret_right.svg'} alt='caret right' />
			</PrevIcon>
			<Swiper
				modules={[Navigation]}
				onSlideChange={() => console.log('slide change')}
				navigation={{
					prevEl: navigationPrevRef.current,
					nextEl: navigationNextRef.current,
				}}
				slidesPerView='auto'
				spaceBetween={16}
				onEnded={() => console.log('ended')}
			>
				{projectsProps.mainCategories.map(category => {
					return (
						<SwiperSlide key={category.slug}>
							<MainCategoryItem>
								{category.title}
							</MainCategoryItem>
						</SwiperSlide>
					);
				})}
			</Swiper>
			<NextIcon ref={navigationNextRef}>
				<img src={'/images/caret_right.svg'} alt='caret right' />
			</NextIcon>
		</Container>
		// </div>
	);
}

export default ProjectsFilter;

const Container = styled.div`
	position: relative;
	width: 60%;
	padding-right: 60px;
`;

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

const NextIcon = styled.button<{ disabled?: boolean }>`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: white;
	box-shadow: ${Shadow.Neutral[500]};
	cursor: ${props => (props.disabled ? 'default' : 'pointer')};
	position: absolute;
	top: calc(50% - 24px);
	right: 0;
	border: none;
	z-index: 1;
	:disabled {
		display: none;
	}
`;

const PrevIcon = styled(NextIcon)<{ disabled?: boolean }>`
	-ms-transform: rotate(180deg);
	transform: rotate(180deg);
	left: 0;
	z-index: 2;
	:disabled {
		display: none;
	}
`;
