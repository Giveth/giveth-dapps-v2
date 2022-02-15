import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GLink, semanticColors } from '@giveth/ui-design-system';

import { useQuery } from '@apollo/client';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import WarningBadge from '@/components/badges/WarningBadge';

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
	const { description, title, status } = project;

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
	const [isActive, setIsActive] = useState<boolean>(true);

	useEffect(() => {
		if (status) {
			console.log(status);
			setIsActive(status.name === 'activate');
		}
	}, [status]);

	return (
		<Wrapper>
			<Head>
				<title>{title} | Giveth</title>
			</Head>
			<ProjectHeader project={project} />
			<BodyWrapper>
				<ContentWrapper>
					<ProjectTabs
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						project={project}
						totalDonations={totalDonations}
					/>
					{!isActive && (
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
						/>
					)}
				</ContentWrapper>
				<ProjectDonateCard
					project={project}
					isActive={isActive}
					setIsActive={setIsActive}
				/>
			</BodyWrapper>
		</Wrapper>
	);
};

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
	margin-top: 24px;
	color: ${semanticColors.golden[700]};
`;

const BodyWrapper = styled.div`
	margin: 0px 170px 0px 150px;
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
