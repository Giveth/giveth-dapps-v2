import {
	B,
	brandColors,
	Button,
	Caption,
	Flex,
	H6,
	IconCaretDown16,
	IconChevronRight16,
	IconHelpFilled16,
	IconPlus16,
	IconRefresh16,
	neutralColors,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { useEffect, useMemo, useState } from 'react';
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
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { useDonateData } from '@/context/donate.context';
import { RecurringDonationModal } from './RecurringDonationModal/RecurringDonationModal';
import { AmountInput } from '@/components/AmountInput/AmountInput';
import 'rc-slider/assets/index.css';
import DonateToGiveth from '../DonateToGiveth';
import { Spinner } from '@/components/Spinner';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import {
	countActiveStreams,
	findUserActiveStreamOnSelectedToken,
} from '@/helpers/donate';
import { ISuperfluidStream } from '@/types/superFluid';
import { showToastError, truncateToDecimalPlaces } from '@/lib/helpers';
import config from '@/configuration';
import { WrongNetworkLayer } from '../WrongNetworkLayer';
import { ModifySuperTokenModal } from './ModifySuperToken/ModifySuperTokenModal';
import { limitFraction } from '@/helpers/number';
import AlloProtocolFirstDonationModal from './AlloProtocolFirstDonationModal';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';
import { useModalCallback } from '@/hooks/useModalCallback';
import { useAppSelector } from '@/features/hooks';
import { findAnchorContractAddress } from '@/helpers/superfluid';
import GIVBackToast from '../GIVBackToast';
import { useGeneralWallet } from '@/providers/generalWalletProvider';

import {
	GLinkStyled,
	IconWrapper,
	Input,
	InputWrapper,
	SelectTokenPlaceHolder,
	SelectTokenWrapper,
} from '@/components/views/donate/common/common.styled';
import DonateAnonymously from '@/components/views/donate/common/DonateAnonymously';

// These two functions are used to make the slider more user-friendly by mapping the slider's value to a new range.
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
	const { project, selectedRecurringToken, tokenStreams } = useDonateData();
	const isGivethProject = Number(project.id!) === config.GIVETH_PROJECT_ID;
	const [amount, setAmount] = useState(0n);
	const [perMonthAmount, setPerMonthAmount] = useState(0n);
	const [isUpdating, setIsUpdating] = useState(false);
	const [donationToGiveth, setDonationToGiveth] = useState(
		isGivethProject ? 0 : 5,
	);
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
	const isSignedIn = useAppSelector(state => state.user.isSignedIn);
	const { modalCallback: signInThenDonate } = useModalCallback(() =>
		setShowRecurringDonationModal(true),
	);
	const { modalCallback: signInThenCreateAllo } = useModalCallback(() =>
		setShowAlloProtocolModal(true),
	);

	const { isConnected } = useGeneralWallet();

	const {
		data: balance,
		refetch,
		isRefetching,
	} = useBalance({
		token:
			selectedRecurringToken?.token.id === AddressZero
				? undefined
				: selectedRecurringToken?.token.id,
		address: address,
	});

	useEffect(() => {
		if (!selectedRecurringToken || !balance) return;
		if (selectedRecurringToken.token.isSuperToken) {
			setAmount(balance.value || 0n);
		}
	}, [selectedRecurringToken, balance]);

	const underlyingToken = selectedRecurringToken?.token.underlyingToken;

	// total means project + giveth
	const totalPerSec = perMonthAmount / ONE_MONTH_SECONDS;
	const projectPerMonth =
		(perMonthAmount * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = perMonthAmount - projectPerMonth;
	const tokenBalance = balance?.value;
	const tokenStream = tokenStreams[selectedRecurringToken?.token.id || ''];

	const anchorContractAddress = useMemo(
		() => findAnchorContractAddress(project.anchorContracts),
		[project.anchorContracts],
	);

	// otherStreamsPerSec is the total flow rate of all streams except the one to the project
	const otherStreamsPerSec =
		tokenStream
			?.filter(ts => ts.receiver.id !== anchorContractAddress)
			.reduce(
				(acc, stream) => acc + BigInt(stream.currentFlowRate),
				0n,
			) || 0n;
	const totalStreamPerSec = totalPerSec + otherStreamsPerSec;
	const totalStreamPerMonth = totalStreamPerSec * ONE_MONTH_SECONDS;
	const streamRunOutInMonth =
		totalStreamPerSec > 0 ? amount / totalStreamPerMonth : 0n;
	const isTotalStreamExceed =
		streamRunOutInMonth < 1n && totalStreamPerSec > 0;
	const sliderColor = isTotalStreamExceed
		? semanticColors.punch
		: brandColors.giv;

	const projectIsGivBackEligible = !!project.verified;

	const handleDonate = () => {
		if (anchorContractAddress) {
			if (isSignedIn) {
				setShowRecurringDonationModal(true);
			} else {
				signInThenDonate();
			}
		} else {
			if (isSignedIn) {
				setShowAlloProtocolModal(true);
			} else {
				signInThenCreateAllo();
			}
		}
	};

	useEffect(() => {
		try {
			if (
				!selectedRecurringToken ||
				!selectedRecurringToken.balance ||
				!anchorContractAddress
			)
				return;

			const _userStreamOnSelectedToken =
				findUserActiveStreamOnSelectedToken(
					address,
					anchorContractAddress,
					tokenStreams,
					selectedRecurringToken.token,
				);

			if (_userStreamOnSelectedToken) {
				setUserStreamOnSelectedToken(_userStreamOnSelectedToken);
				setPerMonthAmount(
					BigInt(_userStreamOnSelectedToken.currentFlowRate) *
						ONE_MONTH_SECONDS,
				);
			} else {
				setUserStreamOnSelectedToken(undefined);
			}
		} catch (error) {
			showToastError(error);
		}
	}, [selectedRecurringToken, address, tokenStreams, anchorContractAddress]);

	const isFormInvalid =
		selectedRecurringToken === undefined ||
		tokenBalance === undefined ||
		amount === 0n ||
		perMonthAmount === 0n ||
		isTotalStreamExceed ||
		amount > tokenBalance;

	const percentage = amount
		? Number((perMonthAmount * 1000n) / amount) / 10
		: 0;

	return (
		<>
			<Title weight={700} id='recurring-donation-page'>
				{formatMessage({ id: 'label.make_a_recurring_donation_with' })}
				<a href='https://www.superfluid.finance/' target='_blank'>
					Superfluid
				</a>
			</Title>
			<Desc>
				<B>
					{formatMessage({
						id: 'label.recurring_donation_card_subheader_1',
					})}{' '}
				</B>
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
							disabled={!isConnected}
						>
							{selectedRecurringToken ? (
								<Flex gap='8px' $alignItems='center'>
									<TokenIcon
										symbol={
											underlyingToken
												? underlyingToken.symbol
												: selectedRecurringToken.token
														.symbol
										}
										size={24}
									/>
									<B>{selectedRecurringToken.token.symbol}</B>
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
						{selectedRecurringToken?.token.isSuperToken ? (
							<p>
								{limitFraction(
									formatUnits(
										balance?.value || 0n,
										selectedRecurringToken.token.decimals,
									),
								)}
							</p>
						) : (
							<Input
								amount={amount}
								setAmount={setAmount}
								disabled={selectedRecurringToken === undefined}
								decimals={
									selectedRecurringToken?.token.decimals
								}
							/>
						)}
					</InputWrapper>
					{!selectedRecurringToken?.token.isSuperToken &&
						selectedRecurringToken !== undefined &&
						balance !== undefined && (
							<Flex gap='4px'>
								<GLinkStyled
									size='Small'
									onClick={() => setAmount(balance.value)}
								>
									{formatMessage({
										id: 'label.available',
									})}
									:{' '}
									{truncateToDecimalPlaces(
										formatUnits(
											balance.value,
											balance.decimals,
										),
										balance.decimals / 3,
									)}
								</GLinkStyled>
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
						<Flex gap='16px' $alignItems='center'>
							<Slider
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
									const _value = value as number;
									const _percentage = mapValue(_value);
									const _perMonthAmount =
										BigInt(
											new BigNumber(
												(amount || 0n).toString(),
											)
												.multipliedBy(_percentage)
												.toFixed(0),
										) / 100n;
									setPerMonthAmount(_perMonthAmount);
								}}
								value={mapValueInverse(percentage.valueOf())}
								disabled={amount === 0n}
							/>
							<InputSlider
								amount={perMonthAmount}
								setAmount={setPerMonthAmount}
								maxAmount={amount}
								decimals={
									selectedRecurringToken?.token.decimals || 18
								}
								disabled={selectedRecurringToken === undefined}
								className={
									perMonthAmount > amount ? 'error' : ''
								}
							/>
						</Flex>
						{perMonthAmount > amount && (
							<RecurringMessage>
								{formatMessage({
									id: 'label.recurring_donation_maximum',
								})}
							</RecurringMessage>
						)}
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
									{amount !== 0n && perMonthAmount !== 0n
										? limitFraction(
												formatUnits(
													perMonthAmount,
													selectedRecurringToken
														?.token.decimals || 18,
												),
											)
										: 0}
								</Caption>
								<Caption $medium>
									{selectedRecurringToken?.token.symbol}
								</Caption>
								<Caption>
									{formatMessage({ id: 'label.per_month' })}
								</Caption>
							</Flex>
						</Flex>
						<Flex $justifyContent='space-between' gap='4px'>
							<Flex gap='4px'>
								{isTotalStreamExceed ? (
									<Caption>
										{formatMessage({
											id: 'label.not_enough_stream_balance',
										})}
									</Caption>
								) : (
									<>
										<Caption>
											{formatMessage({
												id: 'label.top_up_your_stream_balance_within',
											})}
										</Caption>
										{selectedRecurringToken?.token
											.isSuperToken && (
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
									</>
								)}
							</Flex>
							{selectedRecurringToken?.token.isSuperToken ? (
								<TopUpStream
									gap='4px'
									$alignItems='center'
									onClick={() => setShowTopUpModal(true)}
								>
									<Caption $medium>
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
												count: countActiveStreams(
													tokenStream,
												),
											},
										)}{' '}
									</Caption>
									<a
										href={Routes.MyRecurringDonations}
										target='_blank'
										rel='noopener noreferrer'
									>
										<Flex gap='3px' $alignItems='center'>
											<ManageCaption $medium>
												{formatMessage({
													id: 'label.manage_recurring_donations',
												})}
											</ManageCaption>
											<IconChevronRight16 />
										</Flex>
									</a>
								</Flex>
								{!isTotalStreamExceed && (
									<Caption>
										{formatMessage({
											id: 'label.you_will_donate_total',
										})}{' '}
										<TotalMonthlyStream>
											{limitFraction(
												formatUnits(
													totalStreamPerSec *
														ONE_MONTH_SECONDS,
													selectedRecurringToken
														?.token.decimals || 18,
												),
											)}{' '}
											{
												selectedRecurringToken?.token
													.symbol
											}
										</TotalMonthlyStream>{' '}
										{formatMessage({
											id: 'label.monthly_across_all_projects',
										})}
									</Caption>
								)}
							</>
						)}
					</Flex>
				)}
			</RecurringSection>
			{selectedRecurringToken && (
				<GIVBackToastStyled
					projectEligible={projectIsGivBackEligible}
					tokenEligible={true}
				/>
			)}
			{userStreamOnSelectedToken ? (
				isUpdating ? (
					<ActionButton
						label={formatMessage({ id: 'label.confirm' })}
						onClick={handleDonate}
						disabled={isFormInvalid}
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
								disabled={!selectedRecurringToken}
								donationToGiveth={donationToGiveth}
								title={
									formatMessage({ id: 'label.donate_to' }) +
									' Giveth'
								}
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
										{amount !== 0n && perMonthAmount !== 0n
											? limitFraction(
													formatUnits(
														projectPerMonth,
														selectedRecurringToken
															?.token.decimals ||
															18,
													),
												)
											: 0}
									</Caption>
									<Caption>
										{selectedRecurringToken?.token.symbol}
									</Caption>
									<Caption>
										{formatMessage({ id: 'label.monthly' })}
									</Caption>
								</Flex>
							</Flex>
							{!isGivethProject && (
								<Flex $justifyContent='space-between'>
									<Caption>
										{formatMessage(
											{
												id: 'label.donating_percentage_to',
											},
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
											{amount !== 0n &&
											perMonthAmount !== 0n
												? limitFraction(
														formatUnits(
															givethPerMonth,
															selectedRecurringToken
																?.token
																.decimals || 18,
														),
													)
												: 0}
										</Caption>
										<Caption>
											{
												selectedRecurringToken?.token
													.symbol
											}
										</Caption>
										<Caption>
											{formatMessage({
												id: 'label.monthly',
											})}
										</Caption>
									</Flex>
								</Flex>
							)}
							<Flex $justifyContent='space-between'>
								<Caption $medium>
									{formatMessage({
										id: 'label.your_total_donation',
									})}
								</Caption>
								<Flex gap='4px'>
									<Caption $medium>
										{amount !== 0n && perMonthAmount !== 0n
											? limitFraction(
													formatUnits(
														perMonthAmount,
														selectedRecurringToken
															?.token.decimals ||
															18,
													),
												)
											: 0}
									</Caption>
									<Caption $medium>
										{selectedRecurringToken?.token.symbol}
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
						disabled={isFormInvalid}
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
			<DonateAnonymously
				anonymous={anonymous}
				setAnonymous={setAnonymous}
				selectedToken={selectedRecurringToken}
			/>
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
					perMonthAmount={perMonthAmount}
					isUpdating={isUpdating}
					anonymous={anonymous}
				/>
			)}
			{showTopUpModal && selectedRecurringToken && (
				<ModifySuperTokenModal
					tokenStreams={
						tokenStreams[selectedRecurringToken?.token.id || '']
					}
					setShowModal={setShowTopUpModal}
					selectedToken={selectedRecurringToken?.token!}
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

const RecurringMessage = styled(P)`
	font-size: 12px;
	font-style: normal;
	font-weight: 400;
	line-height: 18px;
	color: #e6492d;
`;

const InputSlider = styled(AmountInput)`
	width: 27%;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 4px;
	#amount-input {
		border: none;
		flex: 1;
		font-family: Red Hat Text;
		font-size: 16px;
		font-style: normal;
		line-height: 150%; /* 24px */
		width: 100%;
	}
	&&.error {
		border-color: #e6492d;
	}
`;

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

const ManageCaption = styled(Caption)`
	color: ${brandColors.giv[500]};
`;

const GIVBackToastStyled = styled(GIVBackToast)`
	margin: 0;
	width: 100%;
	& > div {
		margin: 0;
	}
`;
