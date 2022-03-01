import { client } from '@/apollo/apolloClient';
import { mediaQueries } from '@/lib/helpers';
import { FETCH_USER_LIKED_PROJECTS } from '@/apollo/gql/gqlProjects';
import { IUserLikedProjects } from '@/apollo/types/gqlTypes';
import { IProject } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import ProjectCard from '@/components/project-card/ProjectCard';
import { FC, useEffect, useState } from 'react';
import { Loading } from './PublicProfileProjectsTab';
import { IUserPublicProfileView, NothingToSee } from './UserPublicProfile.view';
import styled from 'styled-components';

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
			<LikedContainer>
				{!loading && totalCount == 0 ? (
					<NothingWrapper>
						<NothingToSee
							title='This user didn’t like any project yet!!'
							heartIcon={true}
						/>
					</NothingWrapper>
				) : (
					projects?.map(project => (
						<ProjectCard key={project.id} project={project} />
					))
				)}
				{loading && <Loading />}
			</LikedContainer>
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

const NothingWrapper = styled.div`
	position: relative;
	padding: 100px 0;
`;

const LikedContainer = styled.div`
	display: grid;
	position: relative;
	gap: 24px;
	margin-bottom: 64px;
	padding: 0;
	align-items: center;
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
