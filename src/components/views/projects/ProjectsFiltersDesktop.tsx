import { IconOptions16, IconSearch, IconX } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { MouseEvent, useRef, useState } from 'react';
import ProjectsSearchDesktop from '@/components/views/projects/ProjectsSearchDesktop';
import ProjectsFiltersSwiper from '@/components/views/projects/ProjectsFiltersSwiper';
import { FilterMenu } from '@/components/menu/FilterMenu';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import ProjectsSubCategories from '@/components/views/projects/ProjectsSubCategories';
import {
	FiltersButton,
	FiltersSection,
	IconContainer,
	StyledLine,
} from '@/components/views/projects/common.styled';
import { useProjectsContext } from '@/context/projects.context';

const ProjectsFiltersDesktop = () => {
	const { selectedMainCategory } = useProjectsContext();

	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const filterMenuRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(filterMenuRef, () => setIsFilterOpen(false));

	const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

	const handleFilterClose = (e: MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setIsFilterOpen(false);
	};

	return (
		<>
			<FiltersSection>
				{isSearchOpen ? (
					<ProjectsSearchDesktop />
				) : (
					<ProjectsFiltersSwiper />
				)}
				<FilterAndSearchContainer>
					<IconContainer onClick={toggleSearch}>
						{isSearchOpen ? <IconX /> : <IconSearch />}
					</IconContainer>
					<FiltersButton onClick={() => setIsFilterOpen(true)}>
						Filters
						<IconOptions16 />
					</FiltersButton>
					{isFilterOpen && (
						<FilterMenu
							handleClose={handleFilterClose}
							ref={filterMenuRef}
						/>
					)}
				</FilterAndSearchContainer>
			</FiltersSection>
			{selectedMainCategory && <StyledLine />}
			<ProjectsSubCategories />
		</>
	);
};

const FilterAndSearchContainer = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	gap: 16px;
`;

export default ProjectsFiltersDesktop;
