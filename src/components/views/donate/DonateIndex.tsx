import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import {
	Col,
	Container,
	IconDonation24,
	neutralColors,
	Row,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { BigArc } from '@/components/styled-components/Arc';
import SocialBox from '../../DonateSocialBox';
import NiceBanner from './NiceBanner';
// import PurchaseXDAI from './PurchaseXDAIBanner';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useDonateData } from '@/context/donate.context';
import { EContentType } from '@/lib/constants/shareContent';
import { PassportBanner } from '@/components/PassportBanner';
import { Flex } from '@/components/styled-components/Flex';
import { useAlreadyDonatedToProject } from '@/hooks/useAlreadyDonatedToProject';
import { Shadow } from '@/components/styled-components/Shadow';
import { useAppDispatch } from '@/features/hooks';
import { setShowHeader } from '@/features/general/general.slice';
import { DonateHeader } from './DonateHeader';
import { DonationCard } from './DonationCard';
import { SuccessView } from './SuccessView';
import { DonateSection } from '../project/projectActionCard/DonationSection';
import QFSection from '../project/projectActionCard/QFSection';
import ProjectCardImage from '@/components/project-card/ProjectCardImage';

const DonateIndex: FC = () => {
	const { formatMessage } = useIntl();
	const { isMobile } = useDetectDevice();
	const { project, isSuccessDonation, hasActiveQFRound } = useDonateData();
	const alreadyDonated = useAlreadyDonatedToProject(project);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowHeader(false));
		return () => {
			dispatch(setShowHeader(true));
		};
	}, [dispatch]);

	return isSuccessDonation ? (
		<>
			<DonateHeader />
			<DonateContainer>
				<SuccessView />
			</DonateContainer>
		</>
	) : (
		<>
			<DonateHeader />
			<BigArc />
			{hasActiveQFRound && <PassportBanner />}
			<DonateContainer>
				{/* <PurchaseXDAI /> */}
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
								<DonateSection projectData={project} />
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
	);
};

const AlreadyDonatedWrapper = styled(Flex)`
	margin: 0 40px 16px 40px;
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

export default DonateIndex;
