import { brandColors, neutralColors } from '@giveth/ui-design-system';

import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { RefObject } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Routes from '@/lib/constants/Routes';
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
	const { query } = useRouter();
	const handleIsSelected = (categorySlug: string) => {
		if (!query?.slug) {
			if (categorySlug === 'all') {
				return true;
			}
			return false;
		}
		if (categorySlug === query.slug) return true;
		return false;
	};
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
						<Link
							href={
								category.slug === 'all'
									? Routes.Projects
									: `/projects/${category.slug}`
							}
							passHref
						>
							<a>
								<MainCategoryItem
									isSelected={handleIsSelected(category.slug)}
								>
									{category.title}
								</MainCategoryItem>
							</a>
						</Link>
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
		color: white;
		background: ${brandColors.giv[600]};
		-webkit-transition: background-color 300ms linear, color 150ms linear;
		-ms-transition: background-color 300ms linear, color 150ms linear;
		transition: background-color 300ms linear, color 150ms linear;
	}
	font-weight: 400;
	text-align: center;
	user-select: none;
`;
