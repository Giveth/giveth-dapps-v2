import ProjectsSearchTablet from '@/components/views/projects/ProjectsSearchTablet';
import { Flex } from '@/components/styled-components/Flex';
import ProjectsSubCategories from '@/components/views/projects/ProjectsSubCategories';
import ProjectsFiltersSwiper from '@/components/views/projects/filter/ProjectsFiltersSwiper';
import { StyledLine } from '@/components/views/projects/common.styled';
import ProjectsFiltersButton from '@/components/views/projects/filter/ProjectsFiltersButton';
import { useProjectsContext } from '@/context/projects.context';

const ProjectsFiltersMobile = () => {
	const { isQF } = useProjectsContext();

	return (
		<>
			<ProjectsFiltersSwiper />
			{!isQF && <StyledLine />}
			{!isQF && <ProjectsSubCategories />}
			<Flex $alignItems='center' gap='16px'>
				<ProjectsSearchTablet />
				<ProjectsFiltersButton />
			</Flex>
		</>
	);
};

export default ProjectsFiltersMobile;
