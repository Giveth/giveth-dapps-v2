import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useQuery } from '@apollo/client';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import Head from 'next/head';

import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';
import ProjectDonateCard from './ProjectDonateCard';
import { mediaQueries } from '@/lib/helpers';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import styled from 'styled-components';

const ProjectDonations = dynamic(() => import('./ProjectDonations'));
const ProjectUpdates = dynamic(() => import('./ProjectUpdates'));
const RichTextViewer = dynamic(() => import('@/components/RichTextViewer'), {
	ssr: false,
});

const donationsPerPage = 11;

const ProjectIndex = (props: IProjectBySlug) => {
	const router = useRouter();
	const { project } = props;
	const { description, title } = project;

	const { data: donationsData } = useQuery(FETCH_PROJECT_DONATIONS, {
		variables: {
			projectId: parseInt(project.id || ''),
			skip: 0,
			take: donationsPerPage,
		},
	});

	const donationsByProjectId = donationsData?.donationsByProjectId;
	const totalDonations = donationsByProjectId?.totalCount;

	const [activeTab, setActiveTab] = useState(0);

	return (
		<Wrapper>
			<Head>
				<title>{title} | Giveth</title>
			</Head>
			<ProjectHeader project={project} />
			<BodyWrapper>
				<div className='w-100'>
					<ProjectTabs
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						project={project}
						totalDonations={totalDonations}
					/>
					{activeTab === 0 && (
						<RichTextViewer content={description} />
					)}
					{activeTab === 1 && <ProjectUpdates project={project} />}
					{activeTab === 2 && (
						<ProjectDonations
							donationsByProjectId={donationsByProjectId}
							project={project}
						/>
					)}
				</div>
				<ProjectDonateCard project={project} />
			</BodyWrapper>
		</Wrapper>
	);
};

const BodyWrapper = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column-reverse;

	${mediaQueries['xl']} {
		align-items: unset;
		flex-direction: row;
		justify-content: space-between;
	}
`;

const Wrapper = styled.div`
	margin: 150px 125px;
	position: relative;
`;

export default ProjectIndex;
