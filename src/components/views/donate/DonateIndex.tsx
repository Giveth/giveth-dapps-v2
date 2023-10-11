import React, { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	ButtonLink,
	IconDonation24,
	IconExternalLink24,
	Lead,
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import { BigArc } from '@/components/styled-components/Arc';
import { mediaQueries } from '@/lib/constants/constants';
import SocialBox from '../../DonateSocialBox';
import SuccessView from '@/components/views/donate/SuccessView';
import ProjectCardSelector from '@/components/views/donate/ProjectCardSelector';
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
import CryptoDonation from '@/components/views/donate/CryptoDonation';
import { useAlreadyDonatedToProject } from '@/hooks/useAlreadyDonatedToProject';
import { Shadow } from '@/components/styled-components/Shadow';

const DonateIndex: FC = () => {
	const { formatMessage } = useIntl();
	const { isMobile } = useDetectDevice();
	const { project, isSuccessDonation, hasActiveQFRound } = useDonateData();
	const alreadyDonated = useAlreadyDonatedToProject(project);
	const { txHash = [] } = isSuccessDonation || {};
	const hasMultipleTxs = txHash.length > 1;

	return (
		<>
			<BigArc />
			{hasActiveQFRound && <PassportBanner />}
			<Wrapper>
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
						<Link href={Routes.Projects}>
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
			</Wrapper>
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
	const { chainId } = useWeb3React();
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

const Wrapper = styled.div`
	max-width: 1052px;
	text-align: center;
	padding: 64px 0;
	margin: 0 auto;
	position: relative;
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
