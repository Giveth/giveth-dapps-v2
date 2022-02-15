import { client } from '@/apollo/apolloClient';
import { FETCH_USER_LIKED_PROJECTS } from '@/apollo/gql/gqlProjects';
import { IUserLikedProjects } from '@/apollo/types/gqlTypes';
import { IProject } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import ProjectCard from '@/components/project-card/ProjectCard';
import { FC, useEffect, useState } from 'react';
import { Loading, ProjectsContainer } from './PublicProfileProjectsTab';
import { IUserPublicProfileView } from './UserPublicProfile.view';

const itemPerPage = 6;

const PublicProfileLikedTab: FC<IUserPublicProfileView> = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<IProject[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [page, setPage] = useState(0);

	useEffect(() => {
		if (!user) return;
		const fetchUserProjects = async () => {
			setLoading(true);
			const { data: userLikedProjects } = await client.query({
				query: FETCH_USER_LIKED_PROJECTS,
				variables: {
					userId: parseFloat(user.id) || -1,
					take: itemPerPage,
					skip: page * itemPerPage,
				},
			});
			setLoading(false);
			if (userLikedProjects?.likedProjectsByUserId) {
				const likedProjectsByUserId: IUserLikedProjects =
					userLikedProjects.likedProjectsByUserId;
				setProjects(likedProjectsByUserId.projects);
				setTotalCount(likedProjectsByUserId.totalCount);
			}
		};
		fetchUserProjects();
	}, [page, user]);

	return (
		<>
			<ProjectsContainer>
				{projects.map(project => (
					<ProjectCard key={project.id} project={project} />
				))}
				{loading && <Loading />}
			</ProjectsContainer>
			<Pagination
				currentPage={page}
				totalCount={totalCount}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
		</>
	);
};

export default PublicProfileLikedTab;
