import { brandColors, neutralColors } from '@giveth/ui-design-system';

import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import { RefObject } from 'react';
import { IProjectsView } from './ProjectsIndex';

interface IProjectsFilterProps {
	projectsProps: IProjectsView;
	navigationPrevRef: RefObject<HTMLButtonElement>;
	navigationNextRef: RefObject<HTMLButtonElement>;
}

function ProjectsFilter({
	projectsProps,
	navigationPrevRef,
	navigationNextRef,
}: IProjectsFilterProps) {
	return (
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
						<MainCategoryItem>{category.title}</MainCategoryItem>
					</SwiperSlide>
				);
			})}
		</Swiper>
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
	user-select: none;
`;
