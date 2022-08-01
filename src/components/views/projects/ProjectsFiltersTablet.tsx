import { IconDots, IconOptions16, IconX } from '@giveth/ui-design-system';
import { MouseEvent, useRef, useState } from 'react';
import styled from 'styled-components';
import ProjectsSearchTablet from '@/components/views/projects/ProjectsSearchTablet';
import { FilterMenu } from '@/components/menu/FilterMenu';
import ProjectsFiltersSwiper from '@/components/views/projects/ProjectsFiltersSwiper';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Flex } from '@/components/styled-components/Flex';
import {
	FiltersButton,
	FiltersSection,
	IconContainer,
	StyledLine,
} from '@/components/views/projects/common.styled';
import ProjectsSubCategories from '@/components/views/projects/ProjectsSubCategories';
import { useProjectsContext } from '@/context/projects.context';

const ProjectsFiltersTablet = () => {
	const { selectedMainCategory } = useProjectsContext();

	const [showSearchAndFilter, setShowSearchAndFilter] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const filterMenuRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(filterMenuRef, () => setIsFilterOpen(false));

	const handleFilterClose = (e: MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setIsFilterOpen(false);
	};

	return (
		<>
			{showSearchAndFilter ? (
				<FilterAndSearchContainer
					justifyContent='space-between'
					alignItems='center'
					gap='16px'
					className='fadeIn'
				>
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
					<IconContainer
						onClick={() => setShowSearchAndFilter(false)}
					>
						<IconX />
					</IconContainer>
				</FilterAndSearchContainer>
			) : (
				<FiltersSection>
					<ProjectsFiltersSwiper />
					<IconContainer
						className='fadeIn'
						onClick={() => setShowSearchAndFilter(true)}
					>
						<IconDots />
					</IconContainer>
				</FiltersSection>
			)}
			{selectedMainCategory && <StyledLine />}
			<ProjectsSubCategories />
		</>
	);
};

const FilterAndSearchContainer = styled(Flex)`
	flex-grow: 1;
`;

export default ProjectsFiltersTablet;
