import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	ButtonLink,
	Col,
	Container,
	IconDonation24,
	IconExternalLink24,
	Lead,
	neutralColors,
	Row,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import dynamic from 'next/dynamic';
import { useNetwork } from 'wagmi';
import { BigArc } from '@/components/styled-components/Arc';
import SocialBox from '../../DonateSocialBox';
import NiceBanner from './NiceBanner';
// import PurchaseXDAI from './PurchaseXDAIBanner';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useDonateData } from '@/context/donate.context';
import { EContentType } from '@/lib/constants/shareContent';
import { PassportBanner } from '@/components/PassportBanner';
import ExternalLink from '@/components/ExternalLink';
import { formatTxLink } from '@/lib/helpers';
import Routes from '@/lib/constants/Routes';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { useAlreadyDonatedToProject } from '@/hooks/useAlreadyDonatedToProject';
import { Shadow } from '@/components/styled-components/Shadow';
import { useAppDispatch } from '@/features/hooks';
import { setShowHeader } from '@/features/general/general.slice';
import { DonateHeader } from './DonateHeader';
import { DonationCard } from './DonationCard';

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

	return (
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
				{/* <Sections>
					<ProjectCardSelector />
					<Right>
						{isSuccessDonation ? (
							<SuccessView />
						) : (
							<CryptoDonation />
						)}
					</Right>
				</Sections> */}
				{isSuccessDonation && (
					<Options>
						<Lead style={{ color: neutralColors.gray[900] }}>
							{formatMessage({
								id: 'label.your_transactions_have_been_submitted',
							})}
							<br />
							{formatMessage({
								id: 'label.you_can_view_them_on_a_blockchain_explorer_here',
							})}
						</Lead>
						<TxRow txHash={txHash[0]} title={project.title} />
						{hasMultipleTxs && (
							<TxRow txHash={txHash[1]} title='Giveth' />
						)}
						<Link href={Routes.AllProjects}>
							<ProjectsButton
								size='small'
								label='SEE MORE PROJECTS'
							/>
						</Link>
					</Options>
				)}
				{!isSuccessDonation && !isMobile && (
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

const TxRow = ({ txHash, title }: { txHash: string; title?: string }) => {
	const { chain } = useNetwork();
	const chainId = chain?.id;
	return (
		<TxLink>
			<span>Donation to {title + ' '}</span>
			<ExternalLink
				href={formatTxLink(chainId, txHash)}
				title='View the transaction'
			/>
			<IconExternalLink24 />
		</TxLink>
	);
};

const TxLink = styled(Lead)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	margin-top: 16px;
	display: flex;
	align-items: center;
	gap: 8px;
	> span {
		color: ${neutralColors.gray[700]};
	}
`;

const Options = styled(FlexCenter)`
	flex-direction: column;
	width: 100%;
	padding: 40px 20px 0;
`;

const ProjectsButton = styled(ButtonLink)`
	width: 242px;
	margin-top: 40px;
`;

const DonateContainer = styled(Container)`
	text-align: center;
	padding-top: 128px;
	padding-bottom: 64px;
	position: relative;
`;

export default DonateIndex;
