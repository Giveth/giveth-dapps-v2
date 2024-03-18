import {
	B,
	Caption,
	Flex,
	IconChevronRight16,
	IconDonation32,
	IconHelpFilled16,
	brandColors,
	mediaQueries,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { FC, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import Slider from 'rc-slider';
import BigNumber from 'bignumber.js';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import { IWalletRecurringDonation } from '@/apollo/types/types';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import config from '@/configuration';
import { limitFraction } from '@/helpers/number';
import { ITokenStreams } from '@/context/donate.context';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import {
	mapValue,
	mapValueInverse,
} from '@/components/views/donate/RecurringDonationCard';

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
	const [amount, setAmount] = useState(0n);
	const [percentage, setPercentage] = useState(0);
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
	const totalPerMonth =
		BigInt(
			new BigNumber((amount || 0n).toString())
				.multipliedBy(percentage)
				.toFixed(0),
		) / 100n;
	const totalPerSec = totalPerMonth / ONE_MONTH_SECONDS;
	const projectPerMonth = totalPerMonth;
	const tokenStreams = [] as unknown as ITokenStreams;
	const tokenStream = tokenStreams[superToken?.id || ''];
	const totalStreamPerSec =
		tokenStream?.reduce(
			(acc, stream) => acc + BigInt(stream.currentFlowRate),
			totalPerSec,
		) || totalPerSec;
	const streamRunOutInMonth =
		totalStreamPerSec > 0
			? amount / totalStreamPerSec / ONE_MONTH_SECONDS
			: 0n;
	const isTotalStreamExceed =
		streamRunOutInMonth < 1n && totalStreamPerSec > 0;
	const sliderColor = isTotalStreamExceed
		? semanticColors.punch
		: brandColors.giv;

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
				<Flex $flexDirection='column' gap='8px' $alignItems='stretch'>
					<Caption>
						{formatMessage({
							id: 'label.amount_to_donate_monthly',
						})}
					</Caption>
					<SliderWrapper>
						<StyledSlider
							min={0}
							max={100}
							step={0.1}
							styles={{
								rail: { backgroundColor: sliderColor[200] },
								track: {
									backgroundColor: sliderColor[500],
								},
								handle: {
									backgroundColor: sliderColor[500],
									border: `3px solid ${sliderColor[200]}`,
									opacity: 1,
								},
							}}
							onChange={(value: any) => {
								const _value = Array.isArray(value)
									? value[0]
									: value;
								setPercentage(mapValue(_value));
							}}
							value={mapValueInverse(percentage)}
							disabled={amount === 0n}
						/>
					</SliderWrapper>
					<Flex $justifyContent='space-between'>
						<Flex gap='4px'>
							<Caption>
								{formatMessage({
									id: 'label.donating_to',
								})}
							</Caption>
							<Caption $medium>{donation.project.title}</Caption>
						</Flex>
						<Flex gap='4px'>
							<Caption $medium>
								{amount !== 0n && percentage !== 0
									? limitFraction(
											formatUnits(
												totalPerMonth,
												superToken?.decimals || 18,
											),
										)
									: 0}
							</Caption>
							<Caption $medium>{superToken?.symbol}</Caption>
							<Caption>
								{formatMessage({ id: 'label.per_month' })}
							</Caption>
						</Flex>
					</Flex>
					<Flex $justifyContent='space-between' gap='4px'>
						<Flex gap='4px'>
							<Caption>
								{formatMessage({
									id: 'label.stream_balance_runs_out_in',
								})}
							</Caption>

							<Flex gap='4px'>
								<Caption $medium>
									{streamRunOutInMonth.toString()}
								</Caption>
								<Caption>
									{formatMessage(
										{ id: 'label.months' },
										{
											count: streamRunOutInMonth.toString(),
										},
									)}
								</Caption>
							</Flex>
						</Flex>
					</Flex>
					{tokenStream?.length > 0 && (
						<Flex $justifyContent='space-between'>
							<Caption>
								{formatMessage(
									{
										id: 'label.you_are_supporting_other_projects_with_this_stream',
									},
									{
										count: tokenStream.length - 1,
									},
								)}
							</Caption>
							<Flex gap='4px' $alignItems='center'>
								<Caption $medium>
									{formatMessage({
										id: 'label.manage_recurring_donations',
									})}
								</Caption>
								<IconChevronRight16 />
							</Flex>
						</Flex>
					)}
				</Flex>
			</Flex>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	text-align: left;
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

const SliderWrapper = styled.div`
	width: 100%;
	position: relative;
`;

const StyledSlider = styled(Slider)``;
