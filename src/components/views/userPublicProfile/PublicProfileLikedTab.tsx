import { client } from '@/apollo/apolloClient';
import { FETCH_USER_LIKED_PROJECTS } from '@/apollo/gql/gqlProjects';
import { FETCH_USER_PROJECTS } from '@/apollo/gql/gqlUser';
import { IUserLikedProjects } from '@/apollo/types/gqlTypes';
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
import { ProjectsContainer } from './PublicProfileProjectsTab';
import { IUserPublicProfileView } from './UserPublicProfile.view';

const PublicProfileLikedTab: FC<IUserPublicProfileView> = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<IProject[]>([]);
	useEffect(() => {
		if (!user) return;
		const fetchUserProjects = async () => {
			setLoading(true);
			const { data: userLikedProjects } = await client.query({
				query: FETCH_USER_LIKED_PROJECTS,
				variables: {
					userId: parseFloat(user.id) || -1,
					take: 100,
					skip: 0,
				},
				fetchPolicy: 'network-only',
			});
			setLoading(false);
			console.log('userLikedProjects', userLikedProjects);
			if (userLikedProjects?.likedProjectsByUserId) {
				const likedProjectsByUserId: IUserLikedProjects =
					userLikedProjects.likedProjectsByUserId;
				setProjects(likedProjectsByUserId.projects);
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

export default PublicProfileLikedTab;
