import {
	B,
	Caption,
	Flex,
	IconDonation32,
	IconHelpFilled16,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import config from '@/configuration';
import { limitFraction } from '@/helpers/number';

interface IModifyStreamModalProps extends IModal {
	donation: IWalletRecurringDonation;
}

export const ModifyStreamModal: FC<IModifyStreamModalProps> = ({
	...props
}) => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);

	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.modify_recurring_donation_amount',
			})}
			headerTitlePosition='left'
			headerIcon={<IconDonation32 />}
		>
			<ModifyStreamInnerModal {...props} />
		</Modal>
	);
};

const ModifyStreamInnerModal: FC<IModifyStreamModalProps> = ({ donation }) => {
	const { formatMessage } = useIntl();
	const { address } = useAccount();

	console.log('donation', donation);
	const superToken = useMemo(
		() =>
			config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
				s => s.underlyingToken.symbol === donation.currency,
			),
		[donation.currency],
	);
	const { data: balance } = useBalance({
		token: superToken?.id,
		address,
	});

	console.log('superToken', superToken, balance);
	return (
		<Wrapper>
			<Flex $flexDirection='column' gap='8px'>
				<Flex gap='8px' $alignItems='center'>
					<Caption $medium>
						{formatMessage({ id: 'label.stream_balance' })}
					</Caption>
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction='right'
						align='bottom'
					>
						<FlowRateTooltip>
							{formatMessage({
								id: 'tooltip.flowrate',
							})}
						</FlowRateTooltip>
					</IconWithTooltip>
				</Flex>
				<TokenInfoWrapper>
					<TokenSymbol gap='8px' $alignItems='center'>
						<TokenIcon
							symbol={superToken?.underlyingToken.symbol}
							size={24}
						/>
						<B>{superToken?.underlyingToken.symbol}</B>
					</TokenSymbol>
					<TokenBalance>
						{limitFraction(
							formatUnits(
								balance?.value || 0n,
								balance?.decimals || 18,
							),
						)}
						&nbsp;
						{superToken?.symbol}
					</TokenBalance>
				</TokenInfoWrapper>
			</Flex>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	gap: 16px;
	width: 100%;
	padding: 16px 24px 24px 24px;
	${mediaQueries.tablet} {
		width: 630px;
	}
`;

const TokenInfoWrapper = styled(Flex)`
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	overflow: hidden;
	& > * {
		padding: 13px 16px;
	}
	align-items: center;
`;

const TokenSymbol = styled(Flex)`
	min-width: 140px;
`;

const TokenBalance = styled(B)`
	border-left: 2px solid ${neutralColors.gray[300]};
`;
