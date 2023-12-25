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
import dynamic from 'next/dynamic';
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

const CryptoDonation = dynamic(
	() => import('@/components/views/donate/CryptoDonation'),
	{
		loading: () => <p>Loading...</p>,
		ssr: false,
	},
);

const DonateIndex: FC = () => {
	const { formatMessage } = useIntl();
	const { isMobile } = useDetectDevice();
	const { project, isSuccessDonation, hasActiveQFRound } = useDonateData();
	const alreadyDonated = useAlreadyDonatedToProject(project);
	const { txHash = [] } = isSuccessDonation || {};
	const hasMultipleTxs = txHash.length > 1;
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
					<Col></Col>
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

export default DonateIndex;
