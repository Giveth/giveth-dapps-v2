import { IconDots, IconX } from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import ProjectsSearchTablet from '@/components/views/projects/ProjectsSearchTablet';
import ProjectsFiltersSwiper from '@/components/views/projects/ProjectsFiltersSwiper';
import { Flex } from '@/components/styled-components/Flex';
import {
	FiltersSection,
	IconContainer,
	StyledLine,
} from '@/components/views/projects/common.styled';
import ProjectsSubCategories from '@/components/views/projects/ProjectsSubCategories';
import { useProjectsContext } from '@/context/projects.context';
import ProjectsFiltersButton from '@/components/views/projects/ProjectsFiltersButton';

const ProjectsFiltersTablet = () => {
	const { selectedMainCategory } = useProjectsContext();
	const [showSearchAndFilter, setShowSearchAndFilter] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (router.query.term) setShowSearchAndFilter(true);
	}, [router.query.term]);

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
					<ProjectsFiltersButton />
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
