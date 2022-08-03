import { brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { RefObject } from 'react';
import { useRouter } from 'next/router';

import Routes from '@/lib/constants/Routes';
import { IMainCategory } from '@/apollo/types/types';
import InternalLink from '@/components/InternalLink';

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
	const projectsRoute = Routes.Projects + '/';
	const { query } = useRouter();
	const handleIsSelected = (categorySlug: string) => {
		if (!query?.slug) {
			return categorySlug === 'all';
		}
		return categorySlug === query.slug;
	};

	return (
		<Swiper
			modules={[Navigation]}
			navigation={{
				nextEl: navigationNextRef.current,
				prevEl: navigationPrevRef.current,
			}}
			onInit={swiper => {
				if (
					typeof swiper.params.navigation !== 'boolean' &&
					typeof swiper.params.navigation !== 'boolean' &&
					swiper.params !== undefined &&
					swiper.params.navigation !== undefined
				) {
					swiper.params.navigation.prevEl = navigationPrevRef.current;
					swiper.params.navigation.nextEl = navigationNextRef.current;
					swiper.navigation.init();
					swiper.navigation.update();
				}
			}}
			slidesPerView='auto'
			spaceBetween={16}
		>
			{mainCategories.map(category => (
				<SwiperSlide key={category.slug}>
					<InternalLink
						href={
							category.slug === 'all'
								? projectsRoute
								: projectsRoute + category.slug
						}
					>
						<MainCategoryItem
							isSelected={handleIsSelected(category.slug)}
						>
							{category.title}
						</MainCategoryItem>
					</InternalLink>
				</SwiperSlide>
			))}
		</Swiper>
	);
}

const MainCategoryItem = styled.div<{ isSelected?: boolean }>`
	cursor: pointer;
	border-radius: 50px;
	background: ${props =>
		!props.isSelected ? neutralColors.gray[300] : brandColors.giv[600]};
	color: ${props => (!props.isSelected ? 'black' : 'white')};
	padding: 16px;
	:hover {
		color: white;
		background: ${brandColors.giv[600]};
		transition: background-color 300ms linear, color 150ms linear;
	}
	font-weight: 400;
	text-align: center;
	user-select: none;
`;

export default ProjectsMainCategories;
