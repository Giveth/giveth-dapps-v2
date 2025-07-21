import {
	Lead,
	neutralColors,
	ButtonLink,
	IconExternalLink24,
	brandColors,
	FlexCenter,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Chain } from 'viem';
import Routes from '@/lib/constants/Routes';

import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { formatTxLink } from '@/lib/helpers';
import { ChainType } from '@/types/config';
import config from '@/configuration';
import { EProjectType } from '@/apollo/types/gqlEnums';
import { useCauseDonateData } from '@/context/donate.cause.context';

const TxRow = ({
	txHash,
	title,
	chainType,
}: {
	txHash: string;
	title?: string;
	chainType?: ChainType;
}) => {
	const { chain, walletChainType } = useGeneralWallet();
	const isStellar = chainType === ChainType.STELLAR;
	return (
		<TxLink>
			<span>Donation to {title + ' '}</span>
			<Link
				href={formatTxLink({
					txHash,
					networkId: isStellar
						? config.NETWORKS_CONFIG[ChainType.STELLAR].id
						: (chain as Chain)?.id,
					chainType: isStellar
						? chainType
						: walletChainType || undefined,
				})}
				target='_blank'
			>
				View the transaction
			</Link>
			<IconExternalLink24 />
		</TxLink>
	);
};

export const CauseDonationInfo = () => {
	const { formatMessage } = useIntl();
	const { successDonation, project } = useCauseDonateData();
	const { txHash = [] } = successDonation || {};
	const hasMultipleTxs = txHash.length > 1;
	const isCauseDonation = project.projectType === EProjectType.CAUSE;

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
			<TxRow
				txHash={txHash[0]?.txHash}
				title={project.title}
				chainType={txHash[0]?.chainType}
			/>
			{hasMultipleTxs && (
				<TxRow
					txHash={txHash[1]?.txHash}
					title='Giveth'
					chainType={txHash[1]?.chainType}
				/>
			)}
			<Link
				href={isCauseDonation ? Routes.AllCauses : Routes.AllProjects}
			>
				<ProjectsButton
					size='small'
					label={
						isCauseDonation
							? 'SEE MORE CAUSES'
							: 'SEE MORE PROJECTS'
					}
				/>
			</Link>
		</Options>
	);
};

const Options = styled(FlexCenter)`
	flex-direction: column;
	width: 100%;
	padding: 40px 20px 0;
	position: relative;
`;

const ProjectsButton = styled(ButtonLink)`
	width: 242px;
	margin-top: 40px;
`;

const TxLink = styled(Lead)`
	color: ${brandColors.pinky[500]};
	margin-top: 16px;
	display: flex;
	align-items: center;
	gap: 8px;
	> span {
		color: ${neutralColors.gray[700]};
	}
`;
