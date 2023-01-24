import ProjectsSearchTablet from '@/components/views/projects/ProjectsSearchTablet';
import { Flex } from '@/components/styled-components/Flex';
import ProjectsSubCategories from '@/components/views/projects/ProjectsSubCategories';
import ProjectsFiltersSwiper from '@/components/views/projects/ProjectsFiltersSwiper';
import { StyledLine } from '@/components/views/projects/common.styled';
import ProjectsFiltersButton from '@/components/views/projects/ProjectsFiltersButton';

const ProjectsFiltersMobile = () => {
	return (
		<>
			<ProjectsFiltersSwiper />
			<StyledLine />
			<ProjectsSubCategories />
			<Flex alignItems='center' gap='16px'>
				<ProjectsSearchTablet />
				<ProjectsFiltersButton />
			</Flex>
		</>
	);
};

export default ProjectsFiltersMobile;
