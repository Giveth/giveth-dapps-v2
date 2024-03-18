import {
	B,
	Caption,
	Flex,
	IconCaretDown16,
	IconDonation32,
	IconHelpFilled16,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import {
	SelectTokenWrapper,
	InputWrapper,
} from '@/components/views/donate/RecurringDonationCard';
import config from '@/configuration';

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

	console.log('donation', donation);
	const superToken = config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
		s => s.underlyingToken.symbol === donation.currency,
	);
	console.log('superToken', superToken);
	return (
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
			<InputWrapper>
				<SelectTokenWrapper
					$alignItems='center'
					$justifyContent='space-between'
					// onClick={() => setShowSelectTokenModal(true)}
				>
					<Flex gap='8px' $alignItems='center'>
						<TokenIcon
							symbol={superToken?.underlyingToken.symbol}
							size={24}
						/>
						<B>{superToken?.symbol}</B>
					</Flex>
					<IconCaretDown16 />
				</SelectTokenWrapper>
				<p>
					{/* {limitFraction(
						formatUnits(
							balance?.value || 0n,
							selectedToken.token.decimals,
						),
					)} */}
				</p>
			</InputWrapper>
			{/* {!selectedToken?.token.isSuperToken &&
				selectedToken !== undefined &&
				balance !== undefined && (
					<Flex gap='4px'>
						<GLink size='Small'>
							{formatMessage({
								id: 'label.available',
							})}
							: {limitFraction(balance?.formatted)}
						</GLink>
						<IconWrapper onClick={() => !isRefetching && refetch()}>
							{isRefetching ? (
								<Spinner size={16} />
							) : (
								<IconRefresh16 />
							)}
						</IconWrapper>
					</Flex>
				)} */}
		</Flex>
	);
};
