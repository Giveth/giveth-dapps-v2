import { IconSearch, IconX } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
	const router = useRouter();

	useEffect(() => {
		if (router.query.term) setIsSearchOpen(true);
	}, [router.query.term]);

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
					<BiggerIconContainer onClick={toggleSearch}>
						{isSearchOpen ? <IconX /> : <IconSearch />}
					</BiggerIconContainer>
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

const BiggerIconContainer = styled(IconContainer)`
	width: 50px;
	height: 50px;
`;

export default ProjectsFiltersDesktop;
