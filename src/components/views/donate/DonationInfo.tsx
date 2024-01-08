import {
	Lead,
	neutralColors,
	ButtonLink,
	IconExternalLink24,
	brandColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Chain } from 'wagmi';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';
import { useDonateData } from '@/context/donate.context';
import ExternalLink from '@/components/ExternalLink';

import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { formatTxLink } from '@/lib/helpers';

const TxRow = ({ txHash, title }: { txHash: string; title?: string }) => {
	const { chain, walletChainType } = useGeneralWallet();
	return (
		<TxLink>
			<span>Donation to {title + ' '}</span>
			<ExternalLink
				href={formatTxLink({
					txHash,
					networkId: (chain as Chain)?.id,
					chainType: walletChainType || undefined,
				})}
				title='View the transaction'
			/>
			<IconExternalLink24 />
		</TxLink>
	);
};

export const DonationInfo = () => {
	const { formatMessage } = useIntl();
	const { isSuccessDonation, project } = useDonateData();
	const { txHash = [] } = isSuccessDonation || {};
	const hasMultipleTxs = txHash.length > 1;
	console.log('txHash', txHash);
	return (
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
			<TxRow txHash={txHash[0]?.txHash} title={project.title} />
			{hasMultipleTxs && (
				<TxRow txHash={txHash[1]?.txHash} title='Giveth' />
			)}
			<Link href={Routes.AllProjects}>
				<ProjectsButton size='small' label='SEE MORE PROJECTS' />
			</Link>
		</Options>
	);
};

const Options = styled(FlexCenter)`
	flex-direction: column;
	width: 100%;
	padding: 40px 20px 0;
`;

const ProjectsButton = styled(ButtonLink)`
	width: 242px;
	margin-top: 40px;
`;

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
