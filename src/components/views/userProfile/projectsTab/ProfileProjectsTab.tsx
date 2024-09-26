import { neutralColors, Col, Row, Flex } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { IUserProfileView, EOrderBy, IOrder } from '../UserProfile.view';
import { EDirection } from '@/apollo/types/gqlEnums';
import NothingToSee from '@/components/views/userProfile/NothingToSee';
import Pagination from '@/components/Pagination';
import ProjectCard from '@/components/project-card/ProjectCard';
import { UserContributeTitle, UserProfileTab } from '../common.sc';
import { ProjectsContributeCard } from '@/components/ContributeCard';
import { useProfileContext } from '@/context/profile.context';
import ProjectItem from './ProjectItem';
import { getUserName } from '@/helpers/user';
import { fetchUserProjects } from './services';

const itemPerPage = 12;

const ProfileProjectsTab: FC<IUserProfileView> = () => {
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});
	const { user, myAccount } = useProfileContext();
	const { formatMessage } = useIntl();
	const userName = getUserName(user);

	const { data, isLoading } = useQuery({
		queryKey: [user.id, 'projects', page, order],
		queryFn: () => fetchUserProjects(user.id!, page, order),
		placeholderData: keepPreviousData,
		enabled: !!user, // only fetch if user exists
	});

	return (
		<UserProfileTab>
			{!myAccount && (
				<Row>
					<Col lg={6}>
						<ProjectsContributeCard />
					</Col>
				</Row>
			)}
			{!myAccount && (
				<UserContributeTitle weight={700}>
					{formatMessage(
						{
							id: 'label.user_projects',
						},
						{
							userName,
						},
					)}
				</UserContributeTitle>
			)}
			<ProjectsContainer>
				{!isLoading && data?.totalCount === 0 ? (
					<NothingWrapper>
						<NothingToSee
							title={`${
								myAccount
									? formatMessage({
											id: 'label.you_havent_created_any_projects_yet',
										})
									: formatMessage({
											id: 'label.this_user_hasnt_created_any_project_yet',
										})
							} `}
						/>
					</NothingWrapper>
				) : myAccount ? (
					<Flex $flexDirection='column' gap='18px'>
						{data?.projects.map(project => (
							<ProjectItem project={project} key={project.id} />
						))}
					</Flex>
				) : (
					<Row>
						{data?.projects.map(project => (
							<Col key={project.id} md={6} lg={4}>
								<ProjectCard project={project} />
							</Col>
						))}
					</Row>
				)}
				{isLoading && <Loading />}
			</ProjectsContainer>
			<Pagination
				currentPage={page}
				totalCount={data?.totalCount || 0}
				setPage={setPage}
				itemPerPage={itemPerPage}
			/>
		</UserProfileTab>
	);
};

export const ProjectsContainer = styled.div`
	margin-bottom: 40px;
`;

export const Loading = styled(Flex)`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: ${neutralColors.gray[200]}aa;
`;

const NothingWrapper = styled.div`
	position: relative;
	padding: 100px 0;
`;

export default ProfileProjectsTab;
