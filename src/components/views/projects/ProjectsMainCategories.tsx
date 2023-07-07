import { brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';
import Routes from '@/lib/constants/Routes';
import { IMainCategory } from '@/apollo/types/types';
import InternalLink from '@/components/InternalLink';
import { useProjectsContext } from '@/context/projects.context';

interface IProjectsFilterProps {
	mainCategories: IMainCategory[];
}

function ProjectsMainCategories({ mainCategories }: IProjectsFilterProps) {
	const { isQF } = useProjectsContext();
	const projectsRoute = (isQF ? Routes.QFProjects : Routes.Projects) + '/';
	const { query } = useRouter();
	const { formatMessage } = useIntl();

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
				nextEl: '#nextIcon',
				prevEl: '#prevIcon',
			}}
			slidesPerView='auto'
			spaceBetween={16}
			onInit={swiper => {
				let _index = 0;
				const selectedItemIndex = mainCategories.findIndex(
					element => element.slug === query?.slug,
				);
				if (selectedItemIndex !== -1) {
					_index = selectedItemIndex;
					_index !== 0 && swiper.slideTo(_index);
				}
			}}
		>
			{mainCategories.map(category => (
				<SwiperSlide key={category.slug} style={{ width: 'auto' }}>
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
							{formatMessage({ id: category.slug })}
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
		background: ${neutralColors.gray[400]};
		transition: background-color 300ms linear, color 150ms linear;
	}
	font-weight: 400;
	text-align: center;
	user-select: none;
`;

export default ProjectsMainCategories;
