import {
	B,
	Button,
	Caption,
	GLink,
	H6,
	IconCaretDown16,
	IconChevronRight16,
	IconHelpFilled16,
	IconPlus16,
	IconRefresh16,
	P,
	brandColors,
	neutralColors,
	semanticColors,
	Flex,
} from '@giveth/ui-design-system';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import Slider from 'rc-slider';
import Image from 'next/image';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import BigNumber from 'bignumber.js';
import { AddressZero, ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { SelectTokenModal } from './SelectTokenModal/SelectTokenModal';
import { TokenIcon } from './TokenIcon/TokenIcon';
import { useDonateData } from '@/context/donate.context';
import { RecurringDonationModal } from './RecurringDonationModal/RecurringDonationModal';
import { AmountInput } from '@/components/AmountInput/AmountInput';
import 'rc-slider/assets/index.css';
import DonateToGiveth from './DonateToGiveth';
import { Spinner } from '@/components/Spinner';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { findUserActiveStreamOnSelectedToken } from '@/helpers/donate';
import { ISuperfluidStream } from '@/types/superFluid';
import { showToastError } from '@/lib/helpers';
import config, { isRecurringActive } from '@/configuration';
import { WrongNetworkLayer } from './WrongNetworkLayer';
import { ModifySuperTokenModal } from './ModifySuperToken/ModifySuperTokenModal';
import { limitFraction } from '@/helpers/number';
import CheckBox from '@/components/Checkbox';
import { CheckBoxContainer } from './CryptoDonation';
import AlloProtocolFirstDonationModal from './AlloProtocolFirstDonationModal';
import links from '@/lib/constants/links';

// These two functions are used to make the slider more user friendly by mapping the slider's value to a new range.
/**
 * The mapValue function takes a value from the slider (0 to 100) and maps it to a new range.
 * If the slider value is between 0 and 90, it maps it to a range of 0 to 50.
 * If the slider value is between 90 and 100, it maps it to a range of 50 to 100.
 * This makes the first 90% of the slider represent 0-50% of the range, and the last 10% represent 50-100%.
 */
export function mapValue(value: number) {
	if (value <= 90) {
		return value * (50 / 90);
	} else {
		return 50 + (value - 90) * (50 / 10);
	}
}

/**
 * The mapValueInverse function does the opposite of mapValue.
 * It takes a value from the range (0 to 100) and maps it back to the slider's range.
 * If the value is between 0 and 50, it maps it to a range of 0 to 90.
 * If the value is between 50 and 100, it maps it to a range of 90 to 100.
 * This is used to set the slider's position based on the value from the range.
 */
export function mapValueInverse(value: number) {
	if (value <= 50) {
		return value * (90 / 50);
	} else {
		return 90 + (value - 50) * (10 / 50);
	}
}

export const RecurringDonationCard = () => {
	const [amount, setAmount] = useState(0n);
	const [isUpdating, setIsUpdating] = useState(false);
	const [percentage, setPercentage] = useState(0);
	const [donationToGiveth, setDonationToGiveth] = useState(5);
	const [anonymous, setAnonymous] = useState<boolean>(false);
	const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);
	const [showTopUpModal, setShowTopUpModal] = useState(false);
	const [showRecurringDonationModal, setShowRecurringDonationModal] =
		useState(false);
	const [userStreamOnSelectedToken, setUserStreamOnSelectedToken] =
		useState<ISuperfluidStream>();
	const [showAlloProtocolModal, setShowAlloProtocolModal] = useState(false);

	const { formatMessage } = useIntl();
	const { address } = useAccount();
	const { chain } = useAccount();
	const { project, selectedToken, tokenStreams } = useDonateData();

	const {
		data: balance,
		refetch,
		isRefetching,
	} = useBalance({
		token:
			selectedToken?.token.id === AddressZero
				? undefined
				: selectedToken?.token.id,
		address: address,
		// watch: true,
		// cacheTime: 5_000,
	});

	const isGivethProject = Number(project.id!) === config.GIVETH_PROJECT_ID;

	useEffect(() => {
		if (!selectedToken || !balance) return;
		if (selectedToken.token.isSuperToken) {
			setAmount(balance.value || 0n);
		}
	}, [selectedToken, balance]);

	const underlyingToken = selectedToken?.token.underlyingToken;

	const totalPerMonth =
		BigInt(
			new BigNumber((amount || 0n).toString())
				.multipliedBy(percentage)
				.toFixed(0),
		) / 100n;
	const totalPerSec = totalPerMonth / ONE_MONTH_SECONDS; //Giveth+Project
	const projectPerMonth =
		(totalPerMonth * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = totalPerMonth - projectPerMonth;
	const tokenBalance = balance?.value;
	const tokenStream = tokenStreams[selectedToken?.token.id || ''];
	const otherStreamsPerSec = tokenStream
		?.filter(ts => ts.receiver.id !== project.anchorContracts[0]?.address)
		.reduce((acc, stream) => acc + BigInt(stream.currentFlowRate), 0n);
	const totalStreamPerSec = totalPerSec + otherStreamsPerSec;
	const streamRunOutInMonth =
		totalStreamPerSec > 0
			? amount / totalStreamPerSec / ONE_MONTH_SECONDS
			: 0n;
	const isTotalStreamExceed =
		streamRunOutInMonth < 1n && totalStreamPerSec > 0;
	const sliderColor = isTotalStreamExceed
		? semanticColors.punch
		: brandColors.giv;

	const handleDonate = () => {
		const hasAnchorContract = project.anchorContracts[0]?.isActive;
		if (!hasAnchorContract) {
			setShowAlloProtocolModal(true);
		} else {
			setShowRecurringDonationModal(true);
		}
	};

	useEffect(() => {
		try {
			if (
				!selectedToken ||
				!selectedToken.balance ||
				!project.anchorContracts
			)
				return;

			const _userStreamOnSelectedToken =
				findUserActiveStreamOnSelectedToken(
					address,
					project.anchorContracts[0]?.address,
					tokenStreams,
					selectedToken.token,
				);

			if (_userStreamOnSelectedToken) {
				setUserStreamOnSelectedToken(_userStreamOnSelectedToken);
				const _percentage = BigNumber(
					(
						BigInt(_userStreamOnSelectedToken.currentFlowRate) *
						ONE_MONTH_SECONDS *
						100n
					).toString(),
				).dividedBy(selectedToken.balance.toString());
				setPercentage(parseFloat(_percentage.toString()));
			} else {
				setUserStreamOnSelectedToken(undefined);
				//Please don't make percentage zero here, it will reset the slider to 0
			}
		} catch (error) {
			showToastError(error);
		}
	}, [selectedToken, address, tokenStreams, project.anchorContracts]);

	console.log(
		formatUnits(totalStreamPerSec * ONE_MONTH_SECONDS, 18),
		'totalStreamPerSec',
	);

	return (
		<>
			<Title weight={700}>
				{formatMessage({ id: 'label.make_a_recurring_donation_with' })}
				<a href='https://www.superfluid.finance/' target='_blank'>
					Superfluid
				</a>
			</Title>
			<Desc>
				{formatMessage({
					id: 'label.recurring_donation_card_subheader_1',
				})}{' '}
				<br />
				<br />
				{formatMessage({
					id: 'label.recurring_donation_card_subheader_2',
				})}{' '}
				<LearnMore href={links.RECURRING_DONATION_DOCS} target='_blank'>
					{formatMessage({
						id: 'label.learn_more',
					})}
					{'.'}
				</LearnMore>
			</Desc>
			<RecurringSection>
				{/* <RecurringSectionTitle>
					{formatMessage({
						id: 'label.creating_a_monthly_recurring_donation',
					})}
				</RecurringSectionTitle> */}
				<Flex $flexDirection='column' gap='8px'>
					<Flex gap='8px' $alignItems='center'>
						<Caption $medium>
							{formatMessage({
								id: 'label.deposit_or_stream_balance',
							})}
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
							onClick={() => setShowSelectTokenModal(true)}
						>
							{selectedToken ? (
								<Flex gap='8px' $alignItems='center'>
									<TokenIcon
										symbol={
											underlyingToken
												? underlyingToken.symbol
												: selectedToken.token.symbol
										}
										size={24}
									/>
									<B>{selectedToken.token.symbol}</B>
								</Flex>
							) : (
								<SelectTokenPlaceHolder>
									{formatMessage({
										id: 'label.select_token',
									})}
								</SelectTokenPlaceHolder>
							)}
							<IconCaretDown16 />
						</SelectTokenWrapper>
						{selectedToken?.token.isSuperToken ? (
							<p>
								{limitFraction(
									formatUnits(
										balance?.value || 0n,
										selectedToken.token.decimals,
									),
								)}
							</p>
						) : (
							<Input
								setAmount={setAmount}
								disabled={selectedToken === undefined}
								decimals={selectedToken?.token.decimals}
							/>
						)}
					</InputWrapper>
					{!selectedToken?.token.isSuperToken &&
						selectedToken !== undefined &&
						balance !== undefined && (
							<Flex gap='4px'>
								<GLink size='Small'>
									{formatMessage({
										id: 'label.available',
									})}
									: {limitFraction(balance?.formatted)}
								</GLink>
								<IconWrapper
									onClick={() => !isRefetching && refetch()}
								>
									{isRefetching ? (
										<Spinner size={16} />
									) : (
										<IconRefresh16 />
									)}
								</IconWrapper>
							</Flex>
						)}
				</Flex>
				{userStreamOnSelectedToken && !isUpdating ? (
					<ConfirmToast
						type={EToastType.Info}
						message='You already have a recurring donation to this project with this token.'
					/>
				) : (
					<Flex
						$flexDirection='column'
						gap='8px'
						$alignItems='stretch'
					>
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
								<Caption $medium>{project.title}</Caption>
							</Flex>
							<Flex gap='4px'>
								<Caption $medium>
									{amount !== 0n && percentage !== 0
										? limitFraction(
												formatUnits(
													totalPerMonth,
													selectedToken?.token
														.decimals || 18,
												),
											)
										: 0}
								</Caption>
								<Caption $medium>
									{selectedToken?.token.symbol}
								</Caption>
								<Caption>
									{formatMessage({ id: 'label.per_month' })}
								</Caption>
							</Flex>
						</Flex>
						<Flex $justifyContent='space-between' gap='4px'>
							<Flex gap='4px'>
								<Caption>
									{formatMessage({
										id: 'label.top_up_your_stream_balance_within',
									})}
								</Caption>
								{selectedToken?.token.isSuperToken && (
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
								)}
							</Flex>
							{selectedToken?.token.isSuperToken ? (
								<TopUpStream
									gap='4px'
									$alignItems='center'
									onClick={() => setShowTopUpModal(true)}
								>
									<Caption>
										{formatMessage({
											id: 'label.top_up_stream_balance',
										})}
									</Caption>
									<IconPlus16 />
								</TopUpStream>
							) : (
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
							)}
						</Flex>
						{tokenStream?.length > 0 && (
							<>
								<Flex $justifyContent='space-between'>
									<Caption>
										{formatMessage(
											{
												id: 'label.you_are_supporting_other_projects_with_this_stream',
											},
											{
												count: tokenStream.length - 1,
											},
										)}{' '}
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

								<Caption>
									{formatMessage({
										id: 'label.you_will_donate_total',
									})}{' '}
									<TotalMonthlyStream>
										{limitFraction(
											formatUnits(
												totalStreamPerSec *
													ONE_MONTH_SECONDS,
												selectedToken?.token.decimals ||
													18,
											),
										)}{' '}
										{selectedToken?.token.symbol}
									</TotalMonthlyStream>{' '}
									{formatMessage({
										id: 'label.monthly_across_all_projects',
									})}
								</Caption>
							</>
						)}
					</Flex>
				)}
			</RecurringSection>
			{userStreamOnSelectedToken ? (
				isUpdating ? (
					<ActionButton
						label={formatMessage({ id: 'label.confirm' })}
						onClick={handleDonate}
						disabled={
							selectedToken === undefined ||
							tokenBalance === undefined ||
							amount === 0n ||
							isTotalStreamExceed ||
							amount > tokenBalance
						}
					/>
				) : (
					<ActionButton
						label={formatMessage({
							id: 'label.modify_recurring_donation',
						})}
						onClick={() => setIsUpdating(true)}
					/>
				)
			) : (
				<>
					{!isGivethProject && (
						<GivethSection
							$flexDirection='column'
							gap='8px'
							$alignItems='stretch'
						>
							<DonateToGiveth
								setDonationToGiveth={e => {
									setDonationToGiveth(e);
								}}
								donationToGiveth={donationToGiveth}
								title='Add a recurring donation to Giveth'
							/>
						</GivethSection>
					)}
					<DonatesInfoSection>
						<Flex $flexDirection='column' gap='8px'>
							<Flex $justifyContent='space-between'>
								<Caption>
									{formatMessage({ id: 'label.donation_to' })}{' '}
									<b>{project.title}</b>
								</Caption>
								<Flex gap='4px'>
									<Caption>
										{amount !== 0n && percentage !== 0
											? limitFraction(
													formatUnits(
														projectPerMonth,
														selectedToken?.token
															.decimals || 18,
													),
												)
											: 0}
									</Caption>
									<Caption>
										{selectedToken?.token.symbol}
									</Caption>
									<Caption>
										{formatMessage({ id: 'label.monthly' })}
									</Caption>
								</Flex>
							</Flex>
							<Flex $justifyContent='space-between'>
								<Caption>
									{formatMessage(
										{ id: 'label.donating_percentage_to' },
										{
											percentage: (
												<b>{donationToGiveth}%</b>
											),
										},
									)}
									<b>Giveth</b>
								</Caption>
								<Flex gap='4px'>
									<Caption>
										{amount !== 0n && percentage !== 0
											? limitFraction(
													formatUnits(
														givethPerMonth,
														selectedToken?.token
															.decimals || 18,
													),
												)
											: 0}
									</Caption>
									<Caption>
										{selectedToken?.token.symbol}
									</Caption>
									<Caption>
										{formatMessage({ id: 'label.monthly' })}
									</Caption>
								</Flex>
							</Flex>
							<Flex $justifyContent='space-between'>
								<Caption $medium>
									{formatMessage({
										id: 'label.your_total_donation',
									})}
								</Caption>
								<Flex gap='4px'>
									<Caption $medium>
										{amount !== 0n && percentage !== 0
											? limitFraction(
													formatUnits(
														totalPerMonth,
														selectedToken?.token
															.decimals || 18,
													),
												)
											: 0}
									</Caption>
									<Caption $medium>
										{selectedToken?.token.symbol}
									</Caption>
									<Caption $medium>
										{formatMessage({ id: 'label.monthly' })}
									</Caption>
								</Flex>
							</Flex>
						</Flex>
					</DonatesInfoSection>
					<ActionButton
						label={formatMessage({ id: 'label.donate' })}
						onClick={handleDonate}
						disabled={
							selectedToken === undefined ||
							tokenBalance === undefined ||
							amount === 0n ||
							percentage === 0 ||
							isTotalStreamExceed ||
							amount > tokenBalance
						}
					/>
				</>
			)}
			<Flex gap='16px'>
				<P>{formatMessage({ id: 'label.streams_powered_by' })}</P>
				<Image
					src='/images/logo/superfluid-logo.svg'
					width={120}
					height={30}
					alt='Superfluid logo'
				/>
			</Flex>
			<CheckBoxContainer>
				<CheckBox
					label={formatMessage({
						id: isRecurringActive
							? 'label.make_it_anonymous'
							: 'label.donate_privately',
					})}
					checked={anonymous}
					onChange={() => setAnonymous(!anonymous)}
					size={14}
				/>
				<div>
					{formatMessage({
						id: isRecurringActive
							? 'component.tooltip.donate_anonymously'
							: 'component.tooltip.donate_privately',
					})}
				</div>
			</CheckBoxContainer>
			{showSelectTokenModal && (
				<SelectTokenModal setShowModal={setShowSelectTokenModal} />
			)}
			{(!chain || chain.id !== config.OPTIMISM_NETWORK_NUMBER) && (
				<WrongNetworkLayer />
			)}
			{showRecurringDonationModal && (
				<RecurringDonationModal
					setShowModal={setShowRecurringDonationModal}
					donationToGiveth={
						isGivethProject || isUpdating ? 0 : donationToGiveth
					}
					amount={amount}
					percentage={percentage}
					isUpdating={isUpdating}
					anonymous={anonymous}
				/>
			)}
			{showTopUpModal && selectedToken && (
				<ModifySuperTokenModal
					tokenStreams={tokenStreams[selectedToken?.token.id || '']}
					setShowModal={setShowTopUpModal}
					selectedToken={selectedToken?.token!}
					refreshBalance={refetch}
				/>
			)}
			{showAlloProtocolModal && (
				<AlloProtocolFirstDonationModal
					setShowModal={setShowAlloProtocolModal}
					onModalCompletion={() =>
						setShowRecurringDonationModal(true)
					}
				/>
			)}
		</>
	);
};

const Title = styled(H6)`
	& > a {
		color: ${brandColors.pinky[500]};
	}
`;

const LearnMore = styled(Link)`
	color: ${brandColors.pinky[500]};
`;

const Desc = styled(Caption)`
	background-color: ${neutralColors.gray[200]};
	padding: 8px;
	width: 100%;
	text-align: left;
`;

const RecurringSection = styled(Flex)`
	flex-direction: column;
	align-items: stretch;
	gap: 24px;
	padding: 16px;
	border-radius: 12px;
	border: 1px solid ${neutralColors.gray[300]};
	width: 100%;
	text-align: left;
`;

// const RecurringSectionTitle = styled(B)`
// 	width: 100%;
// 	padding-bottom: 8px;
// 	border-bottom: 1px solid ${neutralColors.gray[300]};
// 	text-align: left;
// `;

export const SelectTokenWrapper = styled(Flex)`
	cursor: pointer;
	gap: 16px;
`;

export const SelectTokenPlaceHolder = styled(B)`
	white-space: nowrap;
`;

export const InputWrapper = styled(Flex)`
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	overflow: hidden;
	& > * {
		padding: 13px 16px;
	}
	align-items: center;
`;

const Input = styled(AmountInput)`
	width: 100%;
	border-left: 2px solid ${neutralColors.gray[300]};
	#amount-input {
		border: none;
		flex: 1;
		font-family: Red Hat Text;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: 150%; /* 24px */
		width: 100%;
	}
`;

export const IconWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.giv[500]};
`;

const SliderWrapper = styled.div`
	width: 100%;
	position: relative;
`;

const StyledSlider = styled(Slider)``;

const GivethSection = styled(Flex)`
	flex-direction: column;
	gap: 24px;
	width: 100%;
	text-align: left;
`;

const DonatesInfoSection = styled(Flex)`
	flex-direction: column;
	gap: 24px;
	width: 100%;
	text-align: left;
`;

const ActionButton = styled(Button)`
	width: 100%;
`;

const ConfirmToast = styled(InlineToast)`
	margin: 0px;
`;

const TopUpStream = styled(Flex)`
	cursor: pointer;
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[700]};
	}
	transition: color 0.2s ease-in-out;
`;

const TotalMonthlyStream = styled.b`
	color: ${semanticColors.jade[500]};
`;
