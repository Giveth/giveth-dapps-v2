import { brandColors, neutralColors } from '@giveth/ui-design-system';

import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import { RefObject } from 'react';
import { IMainCategory } from '@/apollo/types/types';

interface IProjectsFilterProps {
	mainCategories: IMainCategory[];
	navigationPrevRef: RefObject<HTMLButtonElement>;
	navigationNextRef: RefObject<HTMLButtonElement>;
}

function ProjectsMainCategories({
	mainCategories,
	navigationPrevRef,
	navigationNextRef,
}: IProjectsFilterProps) {
	return (
		<Swiper
			modules={[Navigation]}
			navigation={{
				prevEl: navigationPrevRef.current,
				nextEl: navigationNextRef.current,
			}}
			slidesPerView='auto'
			spaceBetween={16}
		>
			{mainCategories.map(category => {
				return (
					<SwiperSlide key={category.slug}>
						<MainCategoryItem>{category.title}</MainCategoryItem>
					</SwiperSlide>
				);
			})}
		</Swiper>
	);
}

export default ProjectsMainCategories;

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
