import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Caption, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';
import ProjectDonateCard from './ProjectDonateCard';
import { showToastError } from '@/lib/helpers';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { client, initializeApollo } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import useUser from '@/context/UserProvider';
import { IDonation, IProject } from '@/apollo/types/types';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import InfoBadge from '@/components/badges/InfoBadge';
import { IDonationsByProjectId } from '@/apollo/types/gqlTypes';
import SuccessfulCreation from '@/components/views/create/SuccessfulCreation';
import { mediaQueries } from '@/utils/constants';
import InlineToast from '@/components/toasts/InlineToast';

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
	const [donations, setDonations] = useState<IDonation[]>([]);
	const [totalDonations, setTotalDonations] = useState(0);
	const [creationSuccessful, setCreationSuccessful] = useState(false);

	const {
		state: { user },
	} = useUser();

	const { description = '', title, status, id = '' } = project || {};
	const router = useRouter();
	const slug = router.query.projectIdSlug as string;

	useEffect(() => {
		if (!id) return;
		initializeApollo()
			.query({
				query: FETCH_PROJECT_DONATIONS,
				variables: {
					projectId: parseInt(id),
					skip: 0,
					take: donationsPerPage,
					orderBy: { field: 'CreationDate', direction: 'DESC' },
				},
			})
			.then(
				(res: {
					data: { donationsByProjectId: IDonationsByProjectId };
				}) => {
					const donationsByProjectId = res.data.donationsByProjectId;
					setDonations(donationsByProjectId.donations);
					setTotalDonations(donationsByProjectId.totalCount);
				},
			);
	}, [id]);

	const fetchProject = async () => {
		client
			.query({
				query: FETCH_PROJECT_BY_SLUG,
				variables: { slug, connectedWalletUserId: Number(user?.id) },
				fetchPolicy: 'network-only',
			})
			.then((res: { data: { projectBySlug: IProject } }) => {
				setProject(res.data.projectBySlug);
			})
			.catch(showToastError);
	};

	useEffect(() => {
		if (status) {
			setIsActive(status.name === EProjectStatus.ACTIVE);
			setIsDraft(status.name === EProjectStatus.DRAFT);
		}
	}, [status]);

	useEffect(() => {
		if (slug) {
			fetchProject().then();
		}
	}, [slug]);

	if (creationSuccessful) {
		return (
			<SuccessfulCreation
				showSuccess={setCreationSuccessful}
				project={project as IProject}
			/>
		);
	}

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
						<InlineToast message='This project is not active.' />
					)}
					{activeTab === 0 && (
						<RichTextViewer content={description} />
					)}
					{activeTab === 1 && (
						<ProjectUpdates
							project={project}
							fetchProject={fetchProject}
						/>
					)}
					{activeTab === 2 && (
						<ProjectDonations
							donationsByProjectId={{
								donations,
								totalCount: totalDonations,
							}}
							project={project!}
							isActive={isActive}
							isDraft={isDraft}
						/>
					)}
				</ContentWrapper>
				<ProjectDonateCard
					isDraft={isDraft}
					project={project!}
					isActive={isActive}
					setIsActive={setIsActive}
					setIsDraft={setIsDraft}
					setCreationSuccessful={setCreationSuccessful}
				/>
			</BodyWrapper>
		</Wrapper>
	);
};

const DraftIndicator = styled.div`
	color: ${semanticColors.blueSky[600]};
	background: ${semanticColors.blueSky[100]};
	display: flex;
	gap: 18px;
	padding: 25px 150px;
	margin-bottom: 30px;
`;

const Wrapper = styled.div`
	position: relative;
`;

const BodyWrapper = styled.div`
	margin: 0 170px 0 150px;
	display: flex;
	align-items: center;
	flex-direction: column-reverse;

	${mediaQueries.laptopL} {
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
