import { IconSearch, IconX } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useState } from 'react';
import ProjectsSearchDesktop from '@/components/views/projects/ProjectsSearchDesktop';
import ProjectsFiltersSwiper from '@/components/views/projects/ProjectsFiltersSwiper';
import ProjectsSubCategories from '@/components/views/projects/ProjectsSubCategories';
import {
	FiltersSection,
	IconContainer,
	StyledLine,
} from '@/components/views/projects/common.styled';
import { useProjectsContext } from '@/context/projects.context';
import ProjectsFiltersButton from '@/components/views/projects/ProjectsFiltersButton';

const ProjectsFiltersDesktop = () => {
	const { selectedMainCategory } = useProjectsContext();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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
					<ProjectsFiltersButton />
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
