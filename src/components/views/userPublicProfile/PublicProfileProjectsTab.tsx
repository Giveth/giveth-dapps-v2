import { client } from '@/apollo/apolloClient';
import { FETCH_USER_PROJECTS } from '@/apollo/gql/gqlUser';
import { IUserProjects } from '@/apollo/types/gqlTypes';
import { IProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';
import { mediaQueries } from '@/lib/helpers';
import {
	brandColors,
	Container,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row } from '../../styled-components/Grid';
import { IUserPublicProfileView } from './UserPublicProfile.view';

const PublicProfileProjectsTab: FC<IUserPublicProfileView> = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<IProject[]>([]);
	useEffect(() => {
		if (!user) return;
		const fetchUserProjects = async () => {
			setLoading(true);
			const { data: userProjects } = await client.query({
				query: FETCH_USER_PROJECTS,
				variables: {
					userId: parseFloat(user.id) || -1,
					take: 100,
					skip: 0,
				},
				fetchPolicy: 'network-only',
			});
			setLoading(false);
			if (userProjects?.projectsByUserId) {
				const projectsByUserId: IUserProjects =
					userProjects.projectsByUserId;
				setProjects(projectsByUserId.projects);
			}
		};
		fetchUserProjects();
	}, [user]);

	console.log('projects', projects);

	return (
		<>
			{loading && <div>Loading</div>}
			<ProjectsContainer>
				{projects.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
			</ProjectsContainer>
		</>
	);
};

export default PublicProfileProjectsTab;

export const ProjectsContainer = styled(Container)`
	display: grid;
	gap: 25px;
	margin-bottom: 64px;
	padding: 0;

	${mediaQueries['lg']} {
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries['xl']} {
		grid-template-columns: repeat(3, 1fr);
	}

	${mediaQueries['xxl']} {
		grid-template-columns: repeat(3, 1fr);
	}
`;
