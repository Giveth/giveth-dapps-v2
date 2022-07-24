import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ICategory } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import 'swiper/css';

function ProjectsSubCategories({
	subCategories,
}: {
	subCategories: ICategory[];
}) {
	return (
		<Flex>
			<CustomizedSwiper slidesPerView='auto' spaceBetween={24}>
				{subCategories.map(category => {
					return (
						<SwiperSlide key={category.value}>
							<SubCategoryItem>{category.name}</SubCategoryItem>
						</SwiperSlide>
					);
				})}
			</CustomizedSwiper>
		</Flex>
	);
}

export default ProjectsSubCategories;

const SubCategoryItem = styled.div<{ isSelected?: boolean }>`
	text-transform: capitalize;
	user-select: none;
	padding: 0 12px 8px 12px;
	border-bottom: ${props => (props.isSelected ? '1px solid black' : 'none')};
`;

const CustomizedSwiper = styled(Swiper)`
	margin-left: 0;
`;
