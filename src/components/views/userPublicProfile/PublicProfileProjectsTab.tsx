import { client } from '@/apollo/apolloClient';
import { FETCH_USER_PROJECTS } from '@/apollo/gql/gqlUser';
import { IUserProjects } from '@/apollo/types/gqlTypes';
import { IProject } from '@/apollo/types/types';
import Pagination from '@/components/Pagination';
import ProjectCard from '@/components/project-card/ProjectCard';
import { Flex } from '@/components/styled-components/Flex';
import { ETheme } from '@/context/general.context';
import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	IUserPublicProfileView,
	EOrderBy,
	EDirection,
	IOrder,
	NothingToSee,
} from './UserPublicProfile.view';
import ProjectsTable from './ProjectsTable';
import { mediaQueries } from '@/utils/constants';
import { Container } from '@/components/Grid';

const itemPerPage = 10;

const PublicProfileProjectsTab: FC<IUserPublicProfileView> = ({
	user,
	myAccount,
}) => {
	const [loading, setLoading] = useState(false);
	const [projects, setProjects] = useState<IProject[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [page, setPage] = useState(0);

	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});

	const orderChangeHandler = (orderby: EOrderBy) => {
		if (orderby === order.by) {
			setOrder({
				by: orderby,
				direction:
					order.direction === EDirection.ASC
						? EDirection.DESC
						: EDirection.ASC,
			});
		} else {
			setOrder({
				by: orderby,
				direction: EDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!user) return;
		const fetchUserProjects = async () => {
			setLoading(true);
			const { data: userProjects } = await client.query({
				query: FETCH_USER_PROJECTS,
				variables: {
					userId: parseFloat(user.id || '') || -1,
					take: itemPerPage,
					skip: page * itemPerPage,
					orderBy: order.by,
					direction: order.direction,
				},
			});
			setLoading(false);
			if (userProjects?.projectsByUserId) {
				const projectsByUserId: IUserProjects =
					userProjects.projectsByUserId;
				setProjects(projectsByUserId.projects);
				setTotalCount(projectsByUserId.totalCount);
			}
		};
		fetchUserProjects();
	}, [user, page, order.by, order.direction]);

	return (
		<ProjectsTab>
			<ProjectsContainer>
				{!loading && totalCount === 0 ? (
					<NothingWrapper>
						<NothingToSee
							title={`${
								myAccount ? "You haven't" : "This user hasn't"
							} created any projects yet!`}
						/>
					</NothingWrapper>
				) : myAccount ? (
					<ProjectsTableWrapper>
						<ProjectsTable
							projects={projects}
							orderChangeHandler={orderChangeHandler}
							order={order}
						/>
					</ProjectsTableWrapper>
				) : (
					<GridContainer>
						{projects.map(project => (
							<ProjectCard key={project.id} project={project} />
						))}
					</GridContainer>
				)}
				{loading && <Loading />}
			</ProjectsContainer>
			<PaginationContainer>
				<Pagination
					currentPage={page}
					totalCount={totalCount}
					setPage={setPage}
					itemPerPage={itemPerPage}
				/>
			</PaginationContainer>
		</ProjectsTab>
	);
};

export default PublicProfileProjectsTab;

export const ProjectsContainer = styled(Container)`
	display: grid;
	position: relative;
	gap: 24px;
	margin-bottom: 64px;
	padding: 0;
	align-items: center;
`;

const ProjectsTableWrapper = styled.div`
	margin-left: 35px;
	overflow: auto;
`;

const UserContributeInfo = styled.div`
	padding: 40px 0 60px;
`;

export const Loading = styled(Flex)`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[800]
			: neutralColors.gray[200]}aa;
`;

const NothingWrapper = styled.div`
	position: relative;
	padding: 100px 0;
`;

const GridContainer = styled.div`
	display: grid;
	position: relative;
	gap: 24px;
	margin-bottom: 64px;
	padding: 0;
	align-items: center;
	${mediaQueries.laptop} {
		grid-template-columns: repeat(2, 1fr);
	}
	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
	${mediaQueries.desktop} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const ProjectsTab = styled.div`
	margin: 0 0 150px 0;
`;

const PaginationContainer = styled.div`
	position: absolute;
	right: 50px;
`;
