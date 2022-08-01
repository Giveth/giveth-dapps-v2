import { IconOptions16 } from '@giveth/ui-design-system';
import { MouseEvent, useRef, useState } from 'react';
import ProjectsSearchTablet from '@/components/views/projects/ProjectsSearchTablet';
import { FilterMenu } from '@/components/menu/FilterMenu';
import { Flex } from '@/components/styled-components/Flex';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import ProjectsSubCategories from '@/components/views/projects/ProjectsSubCategories';
import ProjectsFiltersSwiper from '@/components/views/projects/ProjectsFiltersSwiper';
import {
	FiltersButton,
	StyledLine,
} from '@/components/views/projects/common.styled';

const ProjectsFiltersMobile = () => {
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const filterMenuRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(filterMenuRef, () => setIsFilterOpen(false));

	const handleFilterClose = (e: MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setIsFilterOpen(false);
	};

	return (
		<>
			<ProjectsFiltersSwiper />
			<StyledLine />
			<ProjectsSubCategories />
			<Flex alignItems='center' gap='16px'>
				<ProjectsSearchTablet />
				<FiltersButton
					onClick={() => {
						setIsFilterOpen(true);
					}}
				>
					Filters
					<IconOptions16 />
				</FiltersButton>
				{isFilterOpen && (
					<FilterMenu
						handleClose={handleFilterClose}
						ref={filterMenuRef}
					/>
				)}
			</Flex>
		</>
	);
};

export default ProjectsFiltersMobile;
