import React, { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
	Caption,
	Container,
	neutralColors,
	semanticColors,
	Button,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Col, Row } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';
import InfoBadge from '@/components/badges/InfoBadge';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import SimilarProjects from '@/components/views/project/SimilarProjects';
import { isSSRMode } from '@/lib/helpers';
import { idToProjectEdit } from '@/lib/routeCreators';
import { ProjectMeta } from '@/components/Metatag';
import ProjectGIVPowerIndex from '@/components/views/project/projectGIVPower';
import { useProjectContext } from '@/context/project.context';
import { ProjectActionCard } from './projectActionCard/ProjectActionCard';
import ProjectBadges from './ProjectBadges';
import ProjectCategoriesBadges from './ProjectCategoriesBadges';
import { PassportBanner } from '@/components/PassportBanner';
import ProjectGIVbackToast from '@/components/views/project/ProjectGIVbackToast';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import QFSection from './projectActionCard/QFSection';
import { DonateSection } from './projectActionCard/DonationSection';
import { ProjectStats } from './projectActionCard/ProjectStats';
import { AdminActions } from './projectActionCard/AdminActions';
import ProjectOwnerBanner from './ProjectOwnerBanner';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

const ProjectDonations = dynamic(
	() => import('./projectDonations/ProjectDonations.index'),
);
const ProjectUpdates = dynamic(() => import('./projectUpdates'));
const NotAvailableHandler = dynamic(() => import('../../NotAvailableHandler'), {
	ssr: false,
});
const RichTextViewer = dynamic(
	() => import('@/components/rich-text/RichTextViewer'),
	{
		ssr: false,
	},
);

export enum EProjectPageTabs {
	DONATIONS = 'donations',
	UPDATES = 'updates',
	GIVPOWER = 'givpower',
}

const ProjectIndex: FC<IProjectBySlug> = () => {
	const { formatMessage } = useIntl();
	const [activeTab, setActiveTab] = useState(0);

	const isMobile = !useMediaQuery(device.tablet);
	const {
		fetchProjectBoosters,
		projectData,
		isActive,
		isDraft,
		hasActiveQFRound,
		isCancelled,
		isAdmin,
		isLoading,
	} = useProjectContext();
	const { isOnSolana } = useGeneralWallet();

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

	if (!projectData || (isDraft && !isAdmin)) {
		return (
			<NotAvailableHandler
				isCancelled={isCancelled}
				isProjectLoading={isLoading}
			/>
		);
	}

	return (
		<Wrapper>
			{hasActiveQFRound && !isOnSolana && <PassportBanner />}
			<Head>
				<title>{title && `${title} |`} Giveth</title>
				<ProjectMeta project={projectData} />
			</Head>
			<HeadContainer>
				{isAdmin && <ProjectOwnerBanner />}
				<ProjectBadges />
				<Row>
					<Col xs={12} md={8} lg={8.5}>
						<ProjectHeader />
						{isMobile && isAdmin && (
							<MobileActionsContainer
								flexDirection='column'
								gap='24px'
							>
								<ProjectStats />
								{!isDraft && <AdminActions />}
							</MobileActionsContainer>
						)}
						{isMobile && (
							<MobileContainer hasActiveRound={hasActiveQFRound}>
								{hasActiveQFRound ? (
									<QFSection />
								) : (
									<DonateSection />
								)}
							</MobileContainer>
						)}
						<ProjectGIVbackToast />
					</Col>
					<Col xs={12} md={4} lg={3.5}>
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
					{isDraft && (
						<Flex justifyContent='flex-end'>
							<ContinueCreationButton
								label={formatMessage({
									id: 'label.continue_creation',
								})}
								buttonType='primary'
								type='submit'
								onClick={() =>
									router.push(
										idToProjectEdit(projectData?.id || ''),
									)
								}
							/>
						</Flex>
					)}
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
	padding: 25px;
	margin-bottom: 30px;
	border-radius: 8px;
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

const ContinueCreationButton = styled(Button)`
	align-self: flex-end;
`;

const MobileContainer = styled.div<{ hasActiveRound: boolean }>`
	padding: ${props => (props.hasActiveRound ? '0 26px 26px 26px' : '0 26px')};
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
`;

const MobileActionsContainer = styled(Flex)`
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	padding: 16px 24px;
	margin-bottom: 8px;
`;

export default ProjectIndex;
