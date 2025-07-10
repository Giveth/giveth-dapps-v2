import { neutralColors, Col, Row, Flex } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useQuery } from '@tanstack/react-query';
import { IUserProfileView } from '../UserProfile.view';
import NothingToSee from '@/components/views/userProfile/NothingToSee';
import Pagination from '@/components/Pagination';
import ProjectCard from '@/components/project-card/ProjectCard';
import { UserContributeTitle, UserProfileTab } from '../common.sc';
import { ProjectsContributeCard } from '@/components/ContributeCard';
import { useProfileContext } from '@/context/profile.context';
import { getUserName } from '@/helpers/user';
import { fetchUserCauses } from './services';
import {
	projectsOrder,
	userProjectsPerPage,
} from '@/components/views/userProfile/projectsTab/constants';
import ProjectItem from '@/components/views/userProfile/projectsTab/ProjectItem';

const ProfileCausesTab: FC<IUserProfileView> = () => {
	const [page, setPage] = useState(0);
	const { user, myAccount } = useProfileContext();
	const { formatMessage } = useIntl();
	const userName = getUserName(user);
	const isOwner = myAccount; // Determines if the logged-in user is the profile owner

	const { data, isLoading, refetch } = useQuery({
		queryKey: ['dashboard-causes', user.id, page, projectsOrder],
		queryFn: () => fetchUserCauses(user.id!, page, projectsOrder),
		enabled: !!user.id,
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
					{formatMessage({ id: 'label.user_projects' }, { userName })}
				</UserContributeTitle>
			)}
			<ProjectsContainer
				$verified={!!user.isEmailVerified}
				$isOwner={isOwner}
			>
				{!isLoading && data?.totalCount === 0 ? (
					<NothingWrapper>
						<NothingToSee
							title={
								myAccount
									? formatMessage({
											id: 'label.you_havent_created_any_causes_yet',
										})
									: formatMessage({
											id: 'label.this_user_hasnt_created_any_cause_yet',
										})
							}
						/>
					</NothingWrapper>
				) : myAccount ? (
					!user.isEmailVerified ? (
						<div style={{ opacity: 0.5, pointerEvents: 'none' }}>
							<Flex $flexDirection='column' gap='18px'>
								{data?.projects.map(project => (
									<ProjectItem
										project={project}
										key={project.id}
										refetchProjects={refetch}
									/>
								))}
							</Flex>
						</div>
					) : (
						<Flex $flexDirection='column' gap='18px'>
							{data?.projects.map(project => (
								<ProjectItem
									project={project}
									key={project.id}
									refetchProjects={refetch}
								/>
							))}
						</Flex>
					)
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
				itemPerPage={userProjectsPerPage}
			/>
		</UserProfileTab>
	);
};

interface ProjectsContainerProps {
	$verified: boolean;
	$isOwner: boolean;
}

export const ProjectsContainer = styled.div<ProjectsContainerProps>`
	margin-bottom: 40px;
	background-color: ${({ $verified, $isOwner }) =>
		$verified || !$isOwner ? 'transparent' : '#f0f0f0'};
	opacity: ${({ $verified, $isOwner }) => ($verified || !$isOwner ? 1 : 0.5)};
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

export default ProfileCausesTab;
