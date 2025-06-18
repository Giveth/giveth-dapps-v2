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
	Col,
	Row,
	Flex,
	deviceSize,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import CauseHeader from '@/components/views/cause/CauseHeader';
import CauseTabs from '@/components/views/cause/CauseTabs';
import InfoBadge from '@/components/badges/InfoBadge';
import { ICauseBySlug } from '@/apollo/types/gqlTypes';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { isSSRMode } from '@/lib/helpers';
import { idToProjectEdit } from '@/lib/routeCreators';
import { CauseMeta } from '@/components/Metatag';
import CauseGIVPowerIndex from '@/components/views/cause/causeGIVPower';
import { useCauseContext } from '@/context/cause.context';
import { CauseActionCard } from '@/components/views/cause/causeActionCard/CauseActionCard';
import CauseBadges from '@/components/views/cause/CauseBadges';
import CauseCategoriesBadges from '@/components/views/cause/CauseCategoriesBadges';
import { PassportBanner } from '@/components/PassportBanner';
import CauseGIVbackToast from '@/components/views/cause/CauseGIVbackToast';
import useMediaQuery from '@/hooks/useMediaQuery';
import { device } from '@/lib/constants/constants';
import CauseQFSection from '@/components/views/cause/causeActionCard/CauseQFSection';
import { CauseDonateSection } from '@/components/views/cause/causeActionCard/CauseDonationSection';
import { CauseStats } from '@/components/views/cause/causeActionCard/CauseStats';
import { CauseAdminActions } from '@/components/views/cause/causeActionCard/CauseAdminActions';
import CauseOwnerBanner from '@/components/views/cause/CauseOwnerBanner';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import VerifyEmailBanner from '@/components/views/userProfile/VerifyEmailBanner';
import CauseProjects from '@/components/views/cause/CauseProjects';

const CauseDonationsIndex = dynamic(
	() => import('./causeDonations/CauseDonations.index'),
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

export enum ECausePageTabs {
	PROJECTS = 'projects',
	DONATIONS = 'donations',
	GIVPOWER = 'givpower',
}

const CauseIndex: FC<ICauseBySlug> = () => {
	const { formatMessage } = useIntl();
	const [activeTab, setActiveTab] = useState(0);

	const isMobile = !useMediaQuery(device.tablet);
	const {
		fetchCauseBoosters,
		causeData,
		isActive,
		isDraft,
		hasActiveQFRound,
		isCancelled,
		isAdmin,
		isAdminEmailVerified,
		isLoading,
	} = useCauseContext();

	const { isOnSolana } = useGeneralWallet();

	const router = useRouter();
	const slug = router.query.causeIdSlug as string;
	const { categories } = causeData || {};
	const [isTooltipVisible, setTooltipVisible] = useState(false);

	const handleMouseEnter = () => {
		setTooltipVisible(true);
	};

	const handleMouseLeave = () => {
		setTooltipVisible(false);
	};

	const isEmailVerifiedStatus = isAdmin ? isAdminEmailVerified : true;

	useEffect(() => {
		if (!isSSRMode) {
			switch (router.query.tab) {
				case ECausePageTabs.PROJECTS:
					setActiveTab(1);
					break;
				case ECausePageTabs.DONATIONS:
					setActiveTab(2);
					break;
				case ECausePageTabs.GIVPOWER:
					setActiveTab(3);
					break;
				default:
					setActiveTab(0);
					break;
			}
		}
	}, [router.query.tab]);

	const { description = '', title, id = '' } = causeData || {};

	useEffect(() => {
		if (!id) return;
		fetchCauseBoosters(+id, causeData?.status.name);
	}, [id]);

	if (!causeData || (isDraft && !isAdmin)) {
		return (
			<NotAvailableHandler
				isCancelled={isCancelled}
				isProjectLoading={isLoading}
			/>
		);
	}

	if (!isAdmin && isCancelled) {
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
			{hasActiveQFRound && !isOnSolana && isAdminEmailVerified && (
				<PassportBanner />
			)}
			<Head>
				<title>{title && `${title} |`} Giveth</title>
				<CauseMeta cause={causeData} />
			</Head>
			<HeadContainer>
				{isAdmin && <CauseOwnerBanner />}
				<CauseBadges />
				<Row>
					<Col xs={12} md={8} lg={8.5} style={{ margin: '0' }}>
						<CauseHeader />
						{isMobile && isAdmin && (
							<MobileActionsContainer
								$flexDirection='column'
								gap='24px'
							>
								<CauseStats />
								{!isDraft && <CauseAdminActions />}
							</MobileActionsContainer>
						)}
						{isMobile && (
							<MobileContainer $hasActiveRound={hasActiveQFRound}>
								{hasActiveQFRound ? (
									<CauseQFSection causeData={causeData} />
								) : (
									<CauseDonateSection causeData={causeData} />
								)}
							</MobileContainer>
						)}
						<CauseGIVbackToast />
					</Col>
					<Col xs={12} md={4} lg={3.5} style={{ margin: '0' }}>
						<CauseActionCard />
					</Col>
					{isDraft && (
						<DraftIndicator>
							<InfoBadge />
							<Caption $medium>
								{formatMessage({
									id: 'page.project.preview_hint',
								})}
							</Caption>
						</DraftIndicator>
					)}
				</Row>
			</HeadContainer>
			{causeData && !isDraft && (
				<CauseTabs activeTab={activeTab} slug={slug} />
			)}
			<BodyWrapper>
				<ContainerStyled>
					{!isActive && !isDraft && (
						<InlineToast
							type={EToastType.Warning}
							message='This cause is not active.'
						/>
					)}
					{activeTab === 0 && (
						<>
							<RichTextViewer content={description} />
							<Separator />
							<CauseCategoriesBadges
								categories={categories || []}
							/>
						</>
					)}
					{activeTab === 1 && <CauseProjects />}
					{activeTab === 2 && <CauseDonationsIndex />}
					{activeTab === 3 && <CauseGIVPowerIndex />}
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
											idToProjectEdit(
												causeData?.id || '',
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
