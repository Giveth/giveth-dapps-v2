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
} from '@giveth/ui-design-system';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatUnits } from 'viem';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import Slider from 'rc-slider';
import Image from 'next/image';
import { AddressZero, ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { Flex } from '@/components/styled-components/Flex';
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
import { findUserStreamOnSelectedToken } from '@/helpers/donate';
import { ISuperfluidStream } from '@/types/superFluid';
import { showToastError } from '@/lib/helpers';
import config from '@/configuration';
import { WrongNetworkLayer } from './WrongNetworkLayer';
import { ModifySuperTokenModal } from './ModifySuperToken/ModifySuperTokenModal';

export const RecurringDonationCard = () => {
	const [amount, setAmount] = useState(0n);
	const [isUpdating, setIsUpdating] = useState(false);
	const [percentage, setPercentage] = useState(0);
	const [donationToGiveth, setDonationToGiveth] = useState(5);
	const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);
	const [showTopUpModal, setShowTopUpModal] = useState(false);
	const [showRecurringDonationModal, setShowRecurringDonationModal] =
		useState(false);
	const [userStreamOnSelectedToken, setUserStreamOnSelectedToken] =
		useState<ISuperfluidStream>();

	const { address } = useAccount();
	const { chain } = useNetwork();
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
		watch: true,
		cacheTime: 5_000,
	});

	useEffect(() => {
		if (!selectedToken || !balance) return;
		if (selectedToken.token.isSuperToken) {
			setAmount(balance.value || 0n);
		}
	}, [selectedToken, balance]);

	const underlyingToken = selectedToken?.token.underlyingToken;

	const totalPerMonth = ((amount || 0n) * BigInt(percentage)) / 100n;
	const totalPerSec = totalPerMonth / ONE_MONTH_SECONDS;
	const projectPerMonth =
		(totalPerMonth * BigInt(100 - donationToGiveth)) / 100n;
	const givethPerMonth = totalPerMonth - projectPerMonth;
	const tokenBalance = balance?.value;
	const tokenStream = tokenStreams[selectedToken?.token.id || ''];
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

	useEffect(() => {
		try {
			if (!selectedToken || !selectedToken.balance) return;
			const _userStreamOnSelectedToken = findUserStreamOnSelectedToken(
				address,
				project,
				tokenStreams,
				selectedToken,
			);
			if (_userStreamOnSelectedToken) {
				setUserStreamOnSelectedToken(_userStreamOnSelectedToken);
				const _percentage =
					(BigInt(_userStreamOnSelectedToken.currentFlowRate) *
						ONE_MONTH_SECONDS *
						100n) /
					selectedToken.balance;
				setPercentage(parseInt(_percentage.toString()));
			} else {
				setUserStreamOnSelectedToken(undefined);
				setPercentage(0);
				setIsUpdating(false);
			}
		} catch (error) {
			showToastError(error);
		}
	}, [selectedToken, address, project, tokenStreams]);

	return (
		<>
			<Title weight={700}>
				Make a recurring donation with{' '}
				<a href='https://www.superfluid.finance/' target='_blank'>
					SuperFluid
				</a>
			</Title>
			<Desc>
				Provide continuous funding by streaming your donations over
				time.
			</Desc>
			<RecurringSection>
				<RecurringSectionTitle>
					Creating a Monthly recurring donation
				</RecurringSectionTitle>
				<Flex flexDirection='column' gap='8px'>
					<Flex gap='8px' alignItems='center'>
						<Caption medium>Stream Balance</Caption>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction='right'
							align='bottom'
						>
							<FlowRateTooltip>PlaceHolder</FlowRateTooltip>
						</IconWithTooltip>
					</Flex>
					<InputWrapper>
						<SelectTokenWrapper
							alignItems='center'
							justifyContent='space-between'
							onClick={() => setShowSelectTokenModal(true)}
						>
							{selectedToken ? (
								<Flex gap='8px' alignItems='center'>
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
									Select Token
								</SelectTokenPlaceHolder>
							)}
							<IconCaretDown16 />
						</SelectTokenWrapper>
						{selectedToken?.token.isSuperToken ? (
							<p>
								{formatUnits(
									balance?.value || 0n,
									selectedToken.token.decimals,
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
									Available:{' '}
									{balance?.formatted ||
										formatUnits(
											balance.value,
											selectedToken?.token.underlyingToken
												?.decimals || 18,
										)}
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
					<Flex flexDirection='column' gap='8px' alignItems='stretch'>
						<Caption>Amount to donate Monthly</Caption>
						<SliderWrapper>
							<StyledSlider
								min={0}
								max={100}
								step={1}
								railStyle={{
									backgroundColor: sliderColor[200],
								}}
								trackStyle={{
									backgroundColor: sliderColor[500],
								}}
								handleStyle={{
									backgroundColor: sliderColor[500],
									border: `3px solid ${sliderColor[200]}`,
									opacity: 1,
								}}
								onChange={(value: any) => {
									const _value = Array.isArray(value)
										? value[0]
										: value;
									setPercentage(_value);
								}}
								value={percentage}
								disabled={amount === 0n}
							/>
						</SliderWrapper>
						<Flex justifyContent='space-between'>
							<Caption>Donate to this project</Caption>
							<Flex gap='4px'>
								<Caption medium>
									{amount !== 0n && percentage !== 0
										? formatUnits(
												totalPerMonth,
												selectedToken?.token.decimals ||
													18,
											)
										: 0}
								</Caption>
								<Caption medium>
									{selectedToken?.token.symbol}
								</Caption>
								<Caption>per Month</Caption>
							</Flex>
						</Flex>
						<Flex justifyContent='space-between' gap='4px'>
							<Flex gap='4px'>
								<Caption>Stream balance runs out in</Caption>
								{selectedToken?.token.isSuperToken && (
									<Flex gap='4px'>
										<Caption medium>
											{streamRunOutInMonth.toString()}
										</Caption>
										<Caption>Months</Caption>
									</Flex>
								)}
							</Flex>
							{selectedToken?.token.isSuperToken ? (
								<TopUpStream
									gap='4px'
									alignItems='center'
									onClick={() => setShowTopUpModal(true)}
								>
									<Caption>Top-up stream balance</Caption>
									<IconPlus16 />
								</TopUpStream>
							) : (
								<Flex gap='4px'>
									<Caption medium>
										{streamRunOutInMonth.toString()}
									</Caption>
									<Caption>Months</Caption>
								</Flex>
							)}
						</Flex>
						{tokenStream?.length > 0 && (
							<Flex justifyContent='space-between'>
								<Caption>
									you are supporting {tokenStream.length - 1}{' '}
									other project with this stream
								</Caption>
								<Flex gap='4px' alignItems='center'>
									<Caption medium>
										Manage recurring donations
									</Caption>
									<IconChevronRight16 />
								</Flex>
							</Flex>
						)}
					</Flex>
				)}
			</RecurringSection>
			{userStreamOnSelectedToken ? (
				isUpdating ? (
					<ActionButton
						label='confirm'
						onClick={() => {
							setDonationToGiveth(0);
							setShowRecurringDonationModal(true);
						}}
						disabled={
							selectedToken === undefined ||
							tokenBalance === undefined ||
							amount === 0n ||
							amount > tokenBalance
						}
					/>
				) : (
					<ActionButton
						label='Modify Recurring Donation'
						onClick={() => setIsUpdating(true)}
					/>
				)
			) : (
				<>
					<GivethSection
						flexDirection='column'
						gap='8px'
						alignItems='stretch'
					>
						<DonateToGiveth
							setDonationToGiveth={e => {
								setDonationToGiveth(e);
							}}
							donationToGiveth={donationToGiveth}
							title='Add a recurring donation to Giveth'
						/>
					</GivethSection>
					<DonatesInfoSection>
						<Flex flexDirection='column' gap='8px'>
							<Flex justifyContent='space-between'>
								<Caption>
									Donating to <b>{project.title}</b>
								</Caption>
								<Flex gap='4px'>
									<Caption>
										{amount !== 0n && percentage !== 0
											? formatUnits(
													projectPerMonth,
													selectedToken?.token
														.decimals || 18,
												)
											: 0}
									</Caption>
									<Caption>
										{selectedToken?.token.symbol}
									</Caption>
									<Caption>monthly</Caption>
								</Flex>
							</Flex>
							<Flex justifyContent='space-between'>
								<Caption>
									Donating <b>{donationToGiveth}%</b> to{' '}
									<b>Giveth</b>
								</Caption>
								<Flex gap='4px'>
									<Caption>
										{amount !== 0n && percentage !== 0
											? formatUnits(
													givethPerMonth,
													selectedToken?.token
														.decimals || 18,
												)
											: 0}
									</Caption>
									<Caption>
										{selectedToken?.token.symbol}
									</Caption>
									<Caption>monthly</Caption>
								</Flex>
							</Flex>
							<Flex justifyContent='space-between'>
								<Caption medium>Your total donation</Caption>
								<Flex gap='4px'>
									<Caption medium>
										{amount !== 0n && percentage !== 0
											? formatUnits(
													totalPerMonth,
													selectedToken?.token
														.decimals || 18,
												)
											: 0}
									</Caption>
									<Caption medium>
										{selectedToken?.token.symbol}
									</Caption>
									<Caption medium>monthly</Caption>
								</Flex>
							</Flex>
						</Flex>
					</DonatesInfoSection>
					<ActionButton
						label='Donate'
						onClick={() => setShowRecurringDonationModal(true)}
						disabled={
							selectedToken === undefined ||
							tokenBalance === undefined ||
							amount === 0n ||
							percentage === 0 ||
							amount > tokenBalance
						}
					/>
				</>
			)}
			<Flex gap='16px'>
				<P>Streams powered by</P>
				<Image
					src='/images/logo/superfluid-logo.svg'
					width={120}
					height={30}
					alt='Superfluid logo'
				/>
			</Flex>
			{showSelectTokenModal && (
				<SelectTokenModal setShowModal={setShowSelectTokenModal} />
			)}
			{(!chain || chain.id !== config.OPTIMISM_NETWORK_NUMBER) && (
				<WrongNetworkLayer />
			)}
			{showRecurringDonationModal && (
				<RecurringDonationModal
					setShowModal={setShowRecurringDonationModal}
					donationToGiveth={donationToGiveth}
					amount={amount}
					percentage={percentage}
					isUpdating={isUpdating}
				/>
			)}
			{showTopUpModal && (
				<ModifySuperTokenModal
					tokenStreams={tokenStreams}
					setShowModal={setShowTopUpModal}
					selectedToken={config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS[1]}
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

const RecurringSectionTitle = styled(B)`
	width: 100%;
	padding-bottom: 8px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	text-align: left;
`;

const SelectTokenWrapper = styled(Flex)`
	cursor: pointer;
	gap: 16px;
`;

const SelectTokenPlaceHolder = styled(B)`
	white-space: nowrap;
`;

const InputWrapper = styled(Flex)`
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

const IconWrapper = styled.div`
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
