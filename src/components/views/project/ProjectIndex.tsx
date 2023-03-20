import React, { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Caption, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';

import { Col, Row } from '@giveth/ui-design-system';
import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';
import ProjectDonateCard from './projectDonateCard/ProjectDonateCard';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { client } from '@/apollo/apolloClient';
import { IDonation } from '@/apollo/types/types';
import { EDirection, EDonationStatus, ESortby } from '@/apollo/types/gqlEnums';
import InfoBadge from '@/components/badges/InfoBadge';
import {
	IDonationsByProjectIdGQL,
	IProjectBySlug,
} from '@/apollo/types/gqlTypes';
import SuccessfulCreation from '@/components/views/create/SuccessfulCreation';
import { mediaQueries } from '@/lib/constants/constants';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import SimilarProjects from '@/components/views/project/SimilarProjects';
import { compareAddresses, isSSRMode, showToastError } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import { ProjectMeta } from '@/components/Metatag';
import ProjectGIVPowerIndex from '@/components/views/project/projectGIVPower';
import { useProjectContext } from '@/context/project.context';

const ProjectDonations = dynamic(
	() => import('./projectDonations/ProjectDonations.index'),
);
const ProjectUpdates = dynamic(() => import('./ProjectUpdates'));
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

const donationsPerPage = 10;

const ProjectIndex: FC<IProjectBySlug> = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [donations, setDonations] = useState<IDonation[]>([]);
	const [totalDonations, setTotalDonations] = useState(0);
	const [creationSuccessful, setCreationSuccessful] = useState(false);
	const user = useAppSelector(state => state.user.userData);
	const { fetchProjectBoosters, projectData, isActive, isDraft } =
		useProjectContext();

	const router = useRouter();
	const slug = router.query.projectIdSlug as string;

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

	const {
		adminUser,
		description = '',
		title,
		id = '',
		projectPower,
		projectFuturePower,
	} = projectData || {};

	const isAdmin = compareAddresses(
		adminUser?.walletAddress,
		user?.walletAddress,
	);

	useEffect(() => {
		if (!id) return;
		client
			.query({
				query: FETCH_PROJECT_DONATIONS,
				variables: {
					projectId: parseInt(id),
					skip: 0,
					take: donationsPerPage,
					status: isAdmin ? null : EDonationStatus.VERIFIED,
					orderBy: {
						field: ESortby.CREATIONDATE,
						direction: EDirection.DESC,
					},
				},
			})
			.then((res: IDonationsByProjectIdGQL) => {
				const donationsByProjectId = res.data.donationsByProjectId;
				setDonations(donationsByProjectId.donations);
				setTotalDonations(donationsByProjectId.totalCount);
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'fetchProjectDonation',
					},
				});
			});
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
		<>
			<Wrapper>
				<Head>
					<title>{title && `${title} |`} Giveth</title>
					<ProjectMeta project={projectData} />
				</Head>

				<ProjectHeader />
				{isDraft && (
					<DraftIndicator>
						<InfoBadge />
						<Caption medium>
							This is a preview of your project.
						</Caption>
					</DraftIndicator>
				)}
				<BodyWrapper>
					<Col sm={8}>
						{projectData && !isDraft && (
							<ProjectTabs
								activeTab={activeTab}
								slug={slug}
								totalDonations={totalDonations}
							/>
						)}
						{!isActive && !isDraft && (
							<InlineToast
								type={EToastType.Warning}
								message='This project is not active.'
							/>
						)}
						{activeTab === 0 && (
							<RichTextViewer content={description} />
						)}
						{activeTab === 1 && <ProjectUpdates />}
						{activeTab === 2 && (
							<ProjectDonations
								donationsByProjectId={{
									donations,
									totalCount: totalDonations,
								}}
							/>
						)}
						{activeTab === 3 && (
							<ProjectGIVPowerIndex
								projectPower={projectPower}
								projectFuturePower={projectFuturePower}
								isAdmin={isAdmin}
							/>
						)}
					</Col>
					{projectData && (
						<Col sm={4}>
							<ProjectDonateCard
								setCreationSuccessful={setCreationSuccessful}
							/>
						</Col>
					)}
				</BodyWrapper>
			</Wrapper>
			<SimilarProjects slug={slug} />
		</>
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

const BodyWrapper = styled(Row)`
	margin: 0 auto;
	min-height: calc(100vh - 312px);
	max-width: 1280px;
	padding: 0 16px;

	${mediaQueries.mobileL} {
		padding: 0 22px;
	}

	${mediaQueries.laptopS} {
		padding: 0 40px;
	}
`;

export default ProjectIndex;
