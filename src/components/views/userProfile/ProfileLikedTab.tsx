import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import { client } from '@/apollo/apolloClient';
import { FETCH_USER_LIKED_PROJECTS } from '@/apollo/gql/gqlProjects';
import { IUserLikedProjects } from '@/apollo/types/gqlTypes';
import { IProject } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import ProjectCard from '@/components/project-card/ProjectCard';
import { Loading } from './projectsTab/ProfileProjectsTab';
import { IUserProfileView } from './UserProfile.view';
import { mediaQueries } from '@/lib/constants/constants';
import NothingToSee from '@/components/views/userProfile/NothingToSee';

const itemPerPage = 6;

const ProfileLikedTab: FC<IUserProfileView> = ({ myAccount, user }) => {
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<IProject[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [page, setPage] = useState(0);
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (!user) return;
		const fetchUserProjects = async () => {
			setLoading(true);
			const { data: userLikedProjects } = await client.query({
				query: FETCH_USER_LIKED_PROJECTS,
				variables: {
					userId: parseFloat(user.id || '') || -1,
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
		fetchUserProjects().then();
	}, [page, user]);

	return (
		<Container>
			{!loading && totalCount == 0 ? (
				<NothingWrapper>
					<NothingToSee
						title={`${
							myAccount
								? formatMessage({
										id: 'label.you_havent_liked_any_projects_yet',
								  })
								: formatMessage({
										id: 'label.this_user_hasnt_liked_any_project_yet',
								  })
						}`}
						heartIcon
					/>
				</NothingWrapper>
			) : (
				<LikedContainer>
					{projects?.map(project => (
						<ProjectCard key={project.id} project={project} />
					))}
					{loading && <Loading />}
				</LikedContainer>
			)}
			<Pagination
				currentPage={page}
				totalCount={totalCount}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
		</Container>
	);
};

const Container = styled.div`
	margin-bottom: 80px;
`;

const NothingWrapper = styled.div`
	position: relative;
	padding: 100px 0;
`;

const LikedContainer = styled.div`
	display: grid;
	position: relative;
	gap: 24px;
	margin-bottom: 40px;
	padding: 0;
	align-items: center;
	${mediaQueries.tablet} {
		grid-template-columns: repeat(2, 1fr);
	}
	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

export default ProfileLikedTab;
