import React, { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
	Caption,
	Container,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Col, Row } from '@giveth/ui-design-system';

import { useIntl } from 'react-intl';
import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';
import InfoBadge from '@/components/badges/InfoBadge';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import SuccessfulCreation from '@/components/views/create/SuccessfulCreation';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import SimilarProjects from '@/components/views/project/SimilarProjects';
import { isSSRMode } from '@/lib/helpers';
import { ProjectMeta } from '@/components/Metatag';
import ProjectGIVPowerIndex from '@/components/views/project/projectGIVPower';
import { useProjectContext } from '@/context/project.context';
import { ProjectActionCard } from './projectActionCard/ProjectActionCard';
import ProjectBadges from './ProjectBadges';
import ProjectCategoriesBadges from './ProjectCategoriesBadges';
import { PassportBanner } from '@/components/PassportBanner';
import ProjectGIVbackToast from '@/components/views/project/ProjectGIVbackToast';

const ProjectDonations = dynamic(
	() => import('./projectDonations/ProjectDonations.index'),
);
const ProjectUpdates = dynamic(() => import('./projectUpdates'));
const NotAvailableProject = dynamic(() => import('../../NotAvailableProject'), {
	ssr: false,
});
const RichTextViewer = dynamic(() => import('@/components/RichTextViewer'), {
	ssr: false,
});

export enum EProjectPageTabs {
	DONATIONS = 'donations',
	UPDATES = 'updates',
	GIVPOWER = 'givpower',
}

const ProjectIndex: FC<IProjectBySlug> = () => {
	const { formatMessage } = useIntl();
	const [activeTab, setActiveTab] = useState(0);
	const [creationSuccessful, setCreationSuccessful] = useState(false);
	const {
		fetchProjectBoosters,
		projectData,
		isActive,
		isDraft,
		hasActiveQFRound,
	} = useProjectContext();

	const router = useRouter();
	const slug = router.query.projectIdSlug as string;
	const categories = projectData?.categories;

	useEffect(() => {
		if (!isSSRMode) {
			switch (router.query.tab) {
				case EProjectPageTabs.UPDATES:
					setActiveTab(1);
					break;
				case EProjectPageTabs.DONATIONS:
					setActiveTab(2);
					break;
				case EProjectPageTabs.GIVPOWER:
					setActiveTab(3);
					break;
				default:
					setActiveTab(0);
					break;
			}
		}
	}, [router.query.tab]);

	const { description = '', title, id = '' } = projectData || {};

	useEffect(() => {
		if (!id) return;
		fetchProjectBoosters(+id, projectData?.status.name);
	}, [id]);

	if (creationSuccessful) {
		return (
			<SuccessfulCreation
				project={projectData!}
				showSuccess={setCreationSuccessful}
			/>
		);
	}

	if (!projectData) {
		return <NotAvailableProject />;
	}

	return (
		<Wrapper>
			{hasActiveQFRound && <PassportBanner />}
			<Head>
				<title>{title && `${title} |`} Giveth</title>
				<ProjectMeta project={projectData} />
			</Head>
			<HeadContainer>
				<ProjectBadges />
				<Row>
					<Col xs={12} md={8} lg={9}>
						<ProjectHeader />
						<ProjectGIVbackToast />
					</Col>
					<Col xs={12} md={4} lg={3}>
						<ProjectActionCard />
					</Col>
					{isDraft && (
						<DraftIndicator>
							<InfoBadge />
							<Caption medium>
								{formatMessage({
									id: 'page.project.preview_hint',
								})}
							</Caption>
						</DraftIndicator>
					)}
				</Row>
			</HeadContainer>
			{projectData && !isDraft && (
				<ProjectTabs activeTab={activeTab} slug={slug} />
			)}
			<BodyWrapper>
				<Container>
					{!isActive && !isDraft && (
						<InlineToast
							type={EToastType.Warning}
							message='This project is not active.'
						/>
					)}
					{activeTab === 0 && (
						<>
							<RichTextViewer content={description} />
							<Separator />
							<ProjectCategoriesBadges
								categories={categories || []}
							/>
						</>
					)}
					{activeTab === 1 && <ProjectUpdates />}
					{activeTab === 2 && <ProjectDonations />}
					{activeTab === 3 && <ProjectGIVPowerIndex />}
				</Container>
				<SimilarProjects slug={slug} />
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
	min-height: calc(100vh - 312px);
	background-color: ${neutralColors.gray[100]};
	padding: 40px 0;
`;

const HeadContainer = styled(Container)`
	margin-top: 24px;
`;

const Separator = styled.hr`
	border: 1px solid ${neutralColors.gray[400]};
	margin: 40px 0;
`;

export default ProjectIndex;
