import {
	IconHelpFilled,
	brandColors,
	IconHelpFilled16,
} from '@giveth/ui-design-system';
import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { useIntl } from 'react-intl';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { FlexSpacer } from '@/components/styled-components/Flex';
import {
	PoolStakingConfig,
	RegenPoolStakingConfig,
	StakingType,
} from '@/types/config';
import { StakeCardState } from './BaseStakingCard';
import {
	StakingPoolExchangeRow,
	StakingPoolExchange,
	GIVgardenTooltip,
	IntroIcon,
} from './BaseStakingCard.sc';
import config from '@/configuration';

interface IStakingCardHeaderProps {
	poolStakingConfig: PoolStakingConfig;
	setState: Dispatch<SetStateAction<StakeCardState>>;
	isGIVpower: boolean;
	notif?: ReactNode;
}

export const StakingCardHeader: FC<IStakingCardHeaderProps> = ({
	poolStakingConfig,
	setState,
	isGIVpower,
	notif,
}) => {
	const { formatMessage } = useIntl();

	const { type, introCard, network: poolNetwork } = poolStakingConfig;
	const { regenStreamType } = poolStakingConfig as RegenPoolStakingConfig;

	return (
		<StakingPoolExchangeRow gap='4px' alignItems='center'>
			<StakingPoolExchange styleType='Small'>
				{regenStreamType
					? 'REGENFARM'
					: isGIVpower
					? 'GIVPOWER'
					: 'GIVFARM'}
			</StakingPoolExchange>
			{poolNetwork === config.XDAI_NETWORK_NUMBER &&
				type === StakingType.GIV_LM && (
					<IconWithTooltip
						direction={'top'}
						icon={
							<IconHelpFilled
								color={brandColors.deep[100]}
								size={12}
							/>
						}
					>
						<GIVgardenTooltip>
							{formatMessage({
								id: 'label.staking_giv_in_this_pool_allows_to_support_verified_projects',
							})}
						</GIVgardenTooltip>
					</IconWithTooltip>
				)}
			<FlexSpacer />
			{notif && notif}
			{introCard && (
				<IntroIcon onClick={() => setState(StakeCardState.INTRO)}>
					<IconHelpFilled16 />
				</IntroIcon>
			)}
			{isGIVpower && (
				<IntroIcon
					onClick={() => setState(StakeCardState.GIVPOWER_INTRO)}
				>
					<IconHelpFilled16 />
				</IntroIcon>
			)}
		</StakingPoolExchangeRow>
	);
};
