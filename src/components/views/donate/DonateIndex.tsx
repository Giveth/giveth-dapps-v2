import React, { FC } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	ButtonLink,
	IconExternalLink24,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import { useIntl } from 'react-intl';
import { BigArc } from '@/components/styled-components/Arc';
import { mediaQueries } from '@/lib/constants/constants';
import SocialBox from '../../DonateSocialBox';
import SuccessView from '@/components/views/donate/SuccessView';
import ProjectCardSelector from '@/components/views/donate/ProjectCardSelector';
import DonationTypes from '@/components/views/donate/DonationTypes';
import NiceBanner from './NiceBanner';
// import PurchaseXDAI from './PurchaseXDAIBanner';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useDonateData } from '@/context/donate.context';
import { EContentType } from '@/lib/constants/shareContent';
import { PassportBanner } from '@/components/PassportBanner';
import ExternalLink from '@/components/ExternalLink';
import { formatTxLink } from '@/lib/helpers';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';

const DonateIndex: FC = () => {
	const { formatMessage } = useIntl();
	const { isMobile } = useDetectDevice();
	const { project, isSuccessDonation } = useDonateData();
	const { txHash = [] } = isSuccessDonation || {};
	const hasMultipleTxs = txHash.length > 1;

	return (
		<>
			<BigArc />
			<PassportBanner />
			<Wrapper>
				{/* <PurchaseXDAI /> */}
				<NiceBanner />
				<Sections>
					<ProjectCardSelector />
					<Right>
						{isSuccessDonation ? (
							<SuccessView />
						) : (
							<DonationTypes />
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
