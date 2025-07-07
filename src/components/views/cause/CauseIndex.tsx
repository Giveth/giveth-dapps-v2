import React, { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
	Container,
	neutralColors,
	Col,
	Row,
	Flex,
	deviceSize,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import ProjectHeader from '@/components/views/project/ProjectHeader';
import ProjectTabs from '@/components/views/project/ProjectTabs';
import { ICauseBySlug } from '@/apollo/types/gqlTypes';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { isSSRMode } from '@/lib/helpers';
import { idToCauseEdit } from '@/lib/routeCreators';
import { ProjectMeta } from '@/components/Metatag';
import ProjectGIVPowerIndex from '@/components/views/project/projectGIVPower';
import { useProjectContext } from '@/context/project.context';
import { ProjectActionCard } from '@/components/views/project/projectActionCard/ProjectActionCard';
import ProjectBadges from '@/components/views/project/ProjectBadges';
import ProjectCategoriesBadges from '@/components/views/project/ProjectCategoriesBadges';
import { PassportBanner } from '@/components/PassportBanner';
import ProjectGIVbackToast from '@/components/views/project/ProjectGIVbackToast';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import QFSection from '@/components/views/project/projectActionCard/QFSection';
import { DonateSection } from '@/components/views/project/projectActionCard/DonationSection';
import { ProjectStats } from '@/components/views/project/projectActionCard/ProjectStats';
import { AdminActions } from '@/components/views/project/projectActionCard/AdminActions';
import ProjectOwnerBanner from '@/components/views/project/ProjectOwnerBanner';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import ProjectSocials from '@/components/views/project/ProjectSocials';
import VerifyEmailBanner from '../userProfile/VerifyEmailBanner';
import config from '@/configuration';
import { getActiveRound } from '@/helpers/qf';
import { CauseProjectsTab } from '@/components/views/causes/CauseProjectsTab';
import { ICauseProject } from '@/apollo/types/types';

const ProjectDonations = dynamic(
	() =>
		import(
			'@/components/views/project/projectDonations/ProjectDonations.index'
		),
);
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
	GIVPOWER = 'givpower',
	PROJECTS = 'projects',
}

const CauseIndex: FC<ICauseBySlug> = () => {
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
		isAdminEmailVerified,
		isLoading,
	} = useProjectContext();

	const { isOnSolana } = useGeneralWallet();
	const { activeStartedRound } = getActiveRound(projectData?.qfRounds);

	const router = useRouter();
	const slug = router.query.causeIdSlug as string;
	const { categories } = projectData || {};

	const isEmailVerifiedStatus = isAdmin ? isAdminEmailVerified : true;
	const isStellarOnlyQF =
		hasActiveQFRound &&
		activeStartedRound?.eligibleNetworks?.length === 1 &&
		activeStartedRound?.eligibleNetworks?.includes(
			config.STELLAR_NETWORK_NUMBER,
		);

	useEffect(() => {
		if (!isSSRMode) {
			switch (router.query.tab) {
				case EProjectPageTabs.DONATIONS:
					setActiveTab(2);
					break;
				case EProjectPageTabs.GIVPOWER:
					setActiveTab(3);
					break;
				case EProjectPageTabs.PROJECTS:
					setActiveTab(4);
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

	if (!isAdmin && isCancelled) {
		console.log('Project is cancelled');
		return (
			<NotAvailableHandler
				isCancelled={isCancelled}
				isProjectLoading={isLoading}
			/>
		);
	}

	return (
		<Wrapper>
			{!isAdminEmailVerified && isAdmin && <VerifyEmailBanner />}
			{hasActiveQFRound &&
				!isOnSolana &&
				!isStellarOnlyQF &&
				isAdminEmailVerified && <PassportBanner />}
			<Head>
				<title>{title && `${title} |`} Giveth</title>
				<ProjectMeta project={projectData} />
			</Head>
			<HeadContainer>
				{isAdmin && <ProjectOwnerBanner />}
				<ProjectBadges />
				<Row>
					<Col xs={12} md={8} lg={8.5} style={{ margin: '0' }}>
						<ProjectHeader />
						{isMobile && isAdmin && (
							<MobileActionsContainer
								$flexDirection='column'
								gap='24px'
							>
								<ProjectStats />
								{!isDraft && <AdminActions />}
							</MobileActionsContainer>
						)}
						{isMobile && (
							<MobileContainer $hasActiveRound={hasActiveQFRound}>
								{hasActiveQFRound ? (
									<QFSection projectData={projectData} />
								) : (
									<DonateSection projectData={projectData} />
								)}
							</MobileContainer>
						)}
						<ProjectGIVbackToast />
					</Col>
					<Col xs={12} md={4} lg={3.5} style={{ margin: '0' }}>
						<ProjectActionCard />
					</Col>
				</Row>
			</HeadContainer>
			{projectData && !isDraft && (
				<ProjectTabs
					activeTab={activeTab}
					slug={slug}
					verified={isEmailVerifiedStatus}
				/>
			)}
			<BodyWrapper>
				<ContainerStyled>
					{!isActive && !isDraft && (
						<InlineToast
							type={EToastType.Warning}
							message={formatMessage({
								id: 'label.cause.not_active',
							})}
						/>
					)}
					{activeTab === 0 && (
						<>
							<RichTextViewer content={description} />
							{projectData?.socialMedia?.length !== 0 && (
								<>
									<Separator />
									<ProjectSocials />
								</>
							)}
							<Separator />
							<ProjectCategoriesBadges
								categories={categories || []}
							/>
						</>
					)}
					{activeTab === 2 && <ProjectDonations />}
					{activeTab === 3 && <ProjectGIVPowerIndex />}
					{isDraft && (
						<Flex
							$justifyContent='flex-end'
							style={{ position: 'relative' }}
						>
							{/* Show tooltip only when the button is disabled (email not verified) */}
							{!isEmailVerifiedStatus && (
								<TooltipWrapper
									isTooltipVisible={isTooltipVisible}
								>
									{formatMessage({
										id: 'label.email_tooltip',
									})}
								</TooltipWrapper>
							)}

							{/* Wrapper for hover events */}
							<div
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
							>
								<ContinueCreationButton
									label={formatMessage({
										id: 'label.continue_creation',
									})}
									disabled={!isEmailVerifiedStatus} // Button disabled when email is not verified
									buttonType='primary'
									type='submit'
									onClick={() =>
										router.push(
											idToCauseEdit(
												projectData?.id || '',
											),
										)
									}
								/>
							</div>
						</Flex>
					)}
				</ContainerStyled>
			</BodyWrapper>
		</Wrapper>
	);
};

const ContainerStyled = styled(Container)`
	@media (min-width: ${deviceSize.laptopL}px) and (max-width: ${deviceSize.desktop}px) {
		padding-left: 0;
		padding-right: 0;
		width: 1250px;
	}
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

const MobileContainer = styled.div<{ $hasActiveRound: boolean }>`
	padding: ${props =>
		props.$hasActiveRound ? '0 26px 26px 26px' : '0 26px'};
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
`;

const MobileActionsContainer = styled(Flex)`
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	padding: 16px 24px;
	margin-bottom: 8px;
`;

const StellarSupportToast = styled(Flex)`
	margin-block: 24px;
	padding: 16px;
	border: 1px solid ${brandColors.giv[300]};
	border-radius: 8px;
	background-color: ${neutralColors.gray[100]};
	color: ${brandColors.giv[300]};
	justify-content: space-between;
	flex-direction: column;
	align-items: start;
	gap: 30px;

	> :first-child {
		gap: 16px;

		> :first-child {
			margin-top: 2px;
		}
	}

	> :last-child {
		width: 100%;
		text-align: center;
	}

	${mediaQueries.laptopS} {
		flex-direction: row;
		align-items: center;

		> :last-child {
			width: auto;
		}
	}
`;

const ToastText = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;

	> :first-child {
		font-weight: 500;
	}
`;

const LinkItem = styled(P)<{ color: string }>`
	cursor: pointer;
	color: ${props => props.color};
	font-weight: 500;
	text-transform: capitalize;
`;
const ContinueCreationButton = styled(Button)`
	align-self: flex-end;
	position: relative;
	cursor: pointer;
`;
interface TooltipWrapperProps {
	isTooltipVisible: boolean;
	top?: string;
	left?: string;
}
const TooltipWrapper = styled.div<TooltipWrapperProps>`
	visibility: ${isTooltipVisible => (isTooltipVisible ? 'visible' : 'hidden')};
	opacity: ${({ isTooltipVisible }) => (isTooltipVisible ? 1 : 0)};
	position: absolute;
	bottom: -35px;
	left: buttonRect.left + window.scrollX + 10;
	transform: translateX(-50%);
	background: #1a1a1a;
	color: #fff;
	padding: 8px 12px;
	border-radius: 4px;
	font-size: 12px;
	white-space: nowrap;
	transition: 'opacity 0.2s ease';
	z-index: 1000;
	/* Tooltip on hover */
	${ContinueCreationButton}:hover & {
		opacity: 1;
		visibility: visible;
		display: 'inline-block',
    cursor: !isEmailVerifiedStatus ? 'not-allowed' : 'pointer'
	}
`;

export default CauseIndex;
