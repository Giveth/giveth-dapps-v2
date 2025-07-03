import { ICauseProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';

export const CauseProjectsTab = ({
	causeProjects,
}: {
	causeProjects: ICauseProject[];
}) => {
	// list proejct cards
	return (
		<>
			{causeProjects.map(causeProject => (
				<ProjectCard
					key={causeProject.id}
					project={causeProject.project}
				/>
			))}
		</>
	);
};
