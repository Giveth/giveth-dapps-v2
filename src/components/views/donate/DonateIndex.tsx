import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import {
	Col,
	Container,
	IconDonation24,
	mediaQueries,
	neutralColors,
	Row,
	semanticColors,
	SublineBold,
	Flex,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { BigArc } from '@/components/styled-components/Arc';
import SocialBox from '../../DonateSocialBox';
import NiceBanner from './NiceBanner';
// import PurchaseXDAI from './PurchaseXDAIBanner';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useIsSafeEnvironment } from '@/hooks/useSafeAutoConnect';
import { useDonateData } from '@/context/donate.context';
import { EContentType } from '@/lib/constants/shareContent';
import { PassportBanner } from '@/components/PassportBanner';
import { useAlreadyDonatedToProject } from '@/hooks/useAlreadyDonatedToProject';
import { Shadow } from '@/components/styled-components/Shadow';
import { useAppDispatch } from '@/features/hooks';
import { setShowHeader } from '@/features/general/general.slice';
import { DonateHeader } from './DonateHeader';
import { DonationCard, ETabs } from './DonationCard';
import { SuccessView } from './SuccessView';
import QFSection from '../project/projectActionCard/QFSection';
import ProjectCardImage from '@/components/project-card/ProjectCardImage';
import CryptoDonation from './CryptoDonation';
import ProjectCardSelector from '@/components/views/donate/ProjectCardSelector';
import { DonationInfo } from './DonationInfo';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { isRecurringActive } from '@/configuration';
import { DonatePageProjectDescription } from './DonatePageProjectDescription';

const DonateIndex: FC = () => {
	const { formatMessage } = useIntl();
	const { isMobile } = useDetectDevice();
	const { project, isSuccessDonation, hasActiveQFRound } = useDonateData();
	const alreadyDonated = useAlreadyDonatedToProject(project);
	const dispatch = useAppDispatch();
	const isSafeEnv = useIsSafeEnvironment();
	const { isOnSolana } = useGeneralWallet();
	const router = useRouter();

	useEffect(() => {
		if (!isRecurringActive) return;
		dispatch(setShowHeader(false));
		return () => {
			dispatch(setShowHeader(true));
		};
	}, [dispatch]);

	const isRecurringTab = router.query.tab?.toString() === ETabs.RECURRING;

	return isRecurringActive && isSuccessDonation ? (
		<>
			<DonateHeader />
			<DonateContainer>
				<SuccessView />
			</DonateContainer>
		</>
	) : isRecurringActive ? (
		<>
			<DonateHeader />
			{!isSafeEnv && hasActiveQFRound && !isOnSolana && (
				<PassportBanner />
			)}
			<DonateContainer>
				{/* <PurchaseXDAI /> */}
				{alreadyDonated && isRecurringTab && (
					<AlreadyDonatedWrapper>
						<IconDonation24 />
						<SublineBold>
							{formatMessage({
								id: 'component.already_donated.incorrect_estimate',
							})}
						</SublineBold>
					</AlreadyDonatedWrapper>
				)}
				<NiceBanner />
				<Row>
					<Col xs={12} lg={6}>
						<DonationCard />
					</Col>
					<Col xs={12} lg={6}>
						<InfoWrapper>
							<ImageWrapper>
								<ProjectCardImage image={project.image} />
							</ImageWrapper>
							{!isMobile && hasActiveQFRound ? (
								<QFSection projectData={project} />
							) : (
								<DonatePageProjectDescription
									projectData={project}
								/>
							)}
						</InfoWrapper>
					</Col>
				</Row>
				{!isMobile && (
					<SocialBox
						contentType={EContentType.thisProject}
						project={project}
						isDonateFooter
					/>
				)}
			</DonateContainer>
		</>
	) : (
		<>
			<BigArc />
			{!isSafeEnv && hasActiveQFRound && !isOnSolana && (
				<PassportBanner />
			)}
			<Wrapper>
				{alreadyDonated && (
					<AlreadyDonatedWrapper>
						<IconDonation24 />
						<SublineBold>
							{formatMessage({
								id: 'component.already_donated.incorrect_estimate',
							})}
						</SublineBold>
					</AlreadyDonatedWrapper>
				)}
				<NiceBanner />
				<Sections>
					<ProjectCardSelector />
					<Right>
						{isSuccessDonation ? (
							<SuccessView />
						) : (
							<CryptoDonation />
						)}
					</Right>
				</Sections>
				{isSuccessDonation && <DonationInfo />}
				{!isMobile && (
					<SocialBox
						contentType={EContentType.thisProject}
						project={project}
						isDonateFooter
					/>
				)}
			</Wrapper>
		</>
	);
};

const AlreadyDonatedWrapper = styled(Flex)`
	margin-bottom: 16px;
	padding: 12px 16px;
	gap: 8px;
	color: ${semanticColors.jade[500]};
	box-shadow: ${Shadow.Neutral[400]};
	background-color: ${neutralColors.gray[100]};
	border-radius: 8px;
	align-items: center;
`;

const DonateContainer = styled(Container)`
	text-align: center;
	padding-top: 128px;
	padding-bottom: 64px;
	position: relative;
`;

const Wrapper = styled.div`
	max-width: 1052px;
	padding: 64px 0;
	margin: 0 auto;
`;

const InfoWrapper = styled.div`
	background-color: ${neutralColors.gray[100]};
	padding: 24px;
	border-radius: 16px;
	height: 100%;
	text-align: left;
`;

const ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 231px;
	margin-bottom: 24px;
	border-radius: 8px;
	overflow: hidden;
`;

const Sections = styled.div`
	height: 100%;
	${mediaQueries.tablet} {
		display: grid;
		grid-template-columns: repeat(2, minmax(500px, 1fr));
		grid-auto-rows: minmax(100px, auto);
	}
	${mediaQueries.mobileL} {
		grid-template-columns: repeat(2, minmax(100px, 1fr));
		padding: 0 40px;
	}
`;

const Right = styled.div`
	z-index: 1;
	background: white;
	text-align: left;
	padding: 32px;
	min-height: 620px;
	border-radius: 16px;
	${mediaQueries.tablet} {
		border-radius: 0 16px 16px 0;
	}
`;

export default DonateIndex;
