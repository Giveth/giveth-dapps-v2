import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Caption, GLink, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { Toaster } from 'react-hot-toast';

import WarningBadge from '@/components/badges/WarningBadge';
import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';
import ProjectDonateCard from './ProjectDonateCard';
import { mediaQueries, showToastError } from '@/lib/helpers';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import useUser from '@/context/UserProvider';
import { useRouter } from 'next/router';
import { IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import InfoBadge from '@/components/badges/InfoBadge';

const ProjectDonations = dynamic(() => import('./ProjectDonations'));
const ProjectUpdates = dynamic(() => import('./ProjectUpdates'));
const RichTextViewer = dynamic(() => import('@/components/RichTextViewer'), {
	ssr: false,
});

const donationsPerPage = 10;

const ProjectIndex = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [isDraft, setIsDraft] = useState<boolean>(false);
	const [project, setProject] = useState<IProject>();
	const { description = '', title, status, id = '' } = project || {};

	const { data: donationsData } = useQuery(FETCH_PROJECT_DONATIONS, {
		variables: {
			projectId: parseInt(id),
			skip: 0,
			take: donationsPerPage,
			orderBy: 'CreationDate',
			direction: 'ASC',
		},
	});
	const donationsByProjectId = donationsData?.donationsByProjectId;
	const totalDonations = donationsByProjectId?.totalCount;

	const {
		state: { isSignedIn },
	} = useUser();

	const router = useRouter();
	const slug = router.query.projectIdSlug as string;

	useEffect(() => {
		if (status) {
			setIsActive(status.name === EProjectStatus.ACTIVE);
			setIsDraft(status.name === EProjectStatus.DRAFT);
		}
	}, [status]);

	useEffect(() => {
		if (slug) {
			client
				.query({
					query: FETCH_PROJECT_BY_SLUG,
					variables: { slug },
					fetchPolicy: 'no-cache',
				})
				.then((res: { data: any }) => {
					setProject(res.data.projectBySlug);
				})
				.catch(showToastError);
		}
	}, [isSignedIn, slug]);

	return (
		<Wrapper>
			<Head>
				<title>{title} | Giveth</title>
			</Head>
			<ProjectHeader project={project} />
			{isDraft && (
				<DraftIndicator>
					<InfoBadge />
					<Caption medium>This is a preview of your project.</Caption>
				</DraftIndicator>
			)}
			<BodyWrapper>
				<ContentWrapper>
					{!isDraft && (
						<ProjectTabs
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							project={project}
							totalDonations={totalDonations}
						/>
					)}
					{!isActive && !isDraft && (
						<GivBackNotif>
							<WarningBadge />

							<GLink
								size='Medium'
								color={semanticColors.golden[700]}
							>
								This project is not active.
							</GLink>
						</GivBackNotif>
					)}
					{activeTab === 0 && (
						<RichTextViewer content={description} />
					)}
					{activeTab === 1 && <ProjectUpdates project={project} />}
					{activeTab === 2 && (
						<ProjectDonations
							donationsByProjectId={donationsByProjectId}
							project={project}
							isActive={isActive}
							isDraft={isDraft}
						/>
					)}
				</ContentWrapper>
				<ProjectDonateCard
					isDraft={isDraft}
					project={project}
					isActive={isActive}
					setIsActive={setIsActive}
					setIsDraft={setIsDraft}
				/>
			</BodyWrapper>
			<Toaster containerStyle={{ top: '80px' }} />
		</Wrapper>
	);
};

const DraftIndicator = styled.div`
	//color: {semanticColors.link[600]};
	color: #0083e0;
	//background: {semanticColors.link[100]};
	background: #cae9ff;
	display: flex;
	gap: 18px;
	padding: 25px 150px;
	margin-bottom: 30px;
`;

const Wrapper = styled.div`
	position: relative;
`;

const GivBackNotif = styled.div`
	display: flex;
	gap: 16px;
	padding: 16px;
	background: ${semanticColors.golden[200]};
	border-radius: 8px;
	border: 1px solid ${semanticColors.golden[700]};
	margin: 24px 0px 24px;
	max-width: 750px;
	color: ${semanticColors.golden[700]};
`;

const BodyWrapper = styled.div`
	margin: 0 170px 0 150px;
	display: flex;
	align-items: center;
	flex-direction: column-reverse;

	${mediaQueries['xl']} {
		align-items: unset;
		flex-direction: row;
		justify-content: space-between;
	}
`;

const ContentWrapper = styled.div`
	flex-grow: 1;
	padding-right: 48px;
`;

export default ProjectIndex;
