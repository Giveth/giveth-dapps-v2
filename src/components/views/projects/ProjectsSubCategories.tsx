import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ICategory } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import 'swiper/css';
import { useProjectsContext } from '@/context/projects.context';

function ProjectsSubCategories({
	subCategories,
}: {
	subCategories: ICategory[];
}) {
	const { variables, setVariables } = useProjectsContext();

	return (
		<Flex>
			<CustomizedSwiper slidesPerView='auto' spaceBetween={24}>
				{subCategories.map(subCategory => {
					return (
						<SwiperSlide key={subCategory.value}>
							<SubCategoryItem
								isSelected={
									variables?.category ===
									subCategory.value?.toLowerCase()
								}
								onClick={() =>
									setVariables(prevVariables => {
										return {
											...prevVariables,
											category:
												subCategory.value?.toLowerCase(),
										};
									})
								}
							>
								{subCategory.name}
							</SubCategoryItem>
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
	border-bottom: ${props => (props.isSelected ? '2px solid black' : 'none')};
	cursor: pointer;
`;

const CustomizedSwiper = styled(Swiper)`
	margin-left: 0;
`;
