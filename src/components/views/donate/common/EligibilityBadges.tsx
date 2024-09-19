import {
	IconGIVBack24,
	IconQFNew,
	IconQFNotEligible24,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { CSSProperties, FC } from 'react';
import { useIntl } from 'react-intl';
import { Chain } from 'viem';
import { ethers } from 'ethers';
import {
	BadgesBase,
	EligibilityBadgeWrapper,
} from '@/components/views/donate/common/common.styled';
import { GIVBACKS_DONATION_QUALIFICATION_VALUE_USD } from '@/lib/constants/constants';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { useDonateData } from '@/context/donate.context';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import config from '@/configuration';
import { ChainType } from '@/types/config';

interface IEligibilityBadges {
	isStellar?: boolean;
	tokenPrice?: number;
	token?: IProjectAcceptedToken;
	amount: bigint;
	style?: CSSProperties;
}

const EligibilityBadges: FC<IEligibilityBadges> = props => {
	const { tokenPrice, amount, token, style, isStellar } = props;
	const { isConnected, chain } = useGeneralWallet();
	const { activeStartedRound, project } = useDonateData();
	const { verified } = project || {};
	const { formatMessage } = useIntl();
	const networkId = (chain as Chain)?.id;
	const isTokenGivbacksEligible = token?.isGivbackEligible;
	const isProjectGivbacksEligible = !!verified;
	const stellarNetworkId =
		config.NON_EVM_NETWORKS_CONFIG[ChainType.STELLAR].networkId;
	const isOnQFEligibleNetworks =
		activeStartedRound?.eligibleNetworks?.includes(
			(isStellar ? stellarNetworkId : networkId) || 0,
		);
	const donationUsdValue =
		(tokenPrice || 0) * Number(ethers.utils.formatEther(amount));

	const isDonationMatched =
		!!activeStartedRound &&
		donationUsdValue >= (activeStartedRound?.minimumValidUsdValue || 0);
	const isGivbacksEligible =
		isTokenGivbacksEligible &&
		isProjectGivbacksEligible &&
		donationUsdValue >= GIVBACKS_DONATION_QUALIFICATION_VALUE_USD;

	return isConnected ? (
		<EligibilityBadgeWrapper style={style}>
			{isStellar && !isOnQFEligibleNetworks && (
				<BadgesBase warning>
					<IconQFNotEligible24 />
					{formatMessage({
						id: 'label.stellar_donations_arent_eligible',
					})}
				</BadgesBase>
			)}
			{activeStartedRound && isOnQFEligibleNetworks && (
				<BadgesBase active={isDonationMatched}>
					<IconQFNew size={30} />
					{formatMessage(
						{
							id: isDonationMatched
								? 'page.donate.donations_will_be_matched'
								: 'page.donate.donate_$_to_get_matched',
						},
						{
							value: activeStartedRound?.minimumValidUsdValue,
						},
					)}
				</BadgesBase>
			)}
			<BadgesBase active={isGivbacksEligible}>
				<IconGIVBack24
					color={
						isGivbacksEligible
							? semanticColors.jade[500]
							: neutralColors.gray[700]
					}
				/>
				{formatMessage(
					{
						id: isGivbacksEligible
							? 'page.donate.givbacks_eligible'
							: !isProjectGivbacksEligible
								? 'page.donate.project_not_givbacks_eligible'
								: token && !isTokenGivbacksEligible
									? 'page.donate.token_not_givbacks_eligible'
									: 'page.donate.donate_$_to_be_eligible',
					},
					{
						value: GIVBACKS_DONATION_QUALIFICATION_VALUE_USD,
						token: token?.symbol,
					},
				)}
			</BadgesBase>
		</EligibilityBadgeWrapper>
	) : null;
};

export default EligibilityBadges;
