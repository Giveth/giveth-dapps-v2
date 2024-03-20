import {
	B,
	Button,
	Caption,
	Flex,
	IconHelpFilled16,
	P,
	brandColors,
	mediaQueries,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import Slider from 'rc-slider';
import BigNumber from 'bignumber.js';
import Image from 'next/image';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import { limitFraction } from '@/helpers/number';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import {
	mapValue,
	mapValueInverse,
} from '@/components/views/donate/RecurringDonationCard';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { ISuperfluidStream, IToken } from '@/types/superFluid';
import { ITokenStreams } from '@/context/donate.context';
import {
	EDonationSteps,
	IModifyDonationInfo,
	IModifyStreamModalProps,
} from './ModifyStreamModal';

interface IModifyStreamInnerModalProps extends IModifyStreamModalProps {
	setStep: (step: EDonationSteps) => void;
	superToken: IToken;
	tokenStreams: ITokenStreams;
	setModifyInfo: Dispatch<SetStateAction<IModifyDonationInfo | undefined>>;
}

interface IGeneralInfo {
	projectStream?: ISuperfluidStream;
	otherStreamsTotalFlowRate: bigint;
}

export const ModifyStreamInnerModal: FC<IModifyStreamInnerModalProps> = ({
	donation,
	superToken,
	setStep,
	tokenStreams,
	setModifyInfo,
}) => {
	const [percentage, setPercentage] = useState(0);
	const [info, setInfo] = useState<IGeneralInfo>({
		otherStreamsTotalFlowRate: 0n,
	});
	const { formatMessage } = useIntl();
	const { address } = useAccount();

	const { data: balance } = useBalance({
		token: superToken.id,
		address,
	});
	const totalPerMonth =
		BigInt(
			new BigNumber((balance?.value || 0n).toString())
				.multipliedBy(percentage)
				.toFixed(0),
		) / 100n;
	const totalPerSec = totalPerMonth / ONE_MONTH_SECONDS;
	const tokenStream = tokenStreams[superToken.id || ''];

	const totalStreamPerSec = totalPerSec + info.otherStreamsTotalFlowRate;
	const streamRunOutInMonth =
		totalStreamPerSec > 0
			? (balance?.value || 0n) / totalStreamPerSec / ONE_MONTH_SECONDS
			: 0n;
	const isTotalStreamExceed =
		streamRunOutInMonth < 1n && totalStreamPerSec > 0;
	const sliderColor = isTotalStreamExceed
		? semanticColors.punch
		: brandColors.giv;

	useEffect(() => {
		if (
			!tokenStream ||
			tokenStream.length === 0 ||
			!balance?.value ||
			percentage > 0 // don't manipulate percentage if it's already set
		)
			return;
		const _streamInfo: IGeneralInfo = {
			otherStreamsTotalFlowRate: 0n,
		};
		for (let i = 0; i < tokenStream.length; i++) {
			const ts = tokenStream[i];
			if (
				ts.receiver.id === donation.project.anchorContracts[0]?.address
			) {
				_streamInfo.projectStream = ts;
				const _percentage = BigNumber(
					(
						BigInt(ts.currentFlowRate) *
						ONE_MONTH_SECONDS *
						100n
					).toString(),
				).dividedBy(balance?.value.toString());
				setPercentage(parseFloat(_percentage.toString()));
			} else {
				_streamInfo.otherStreamsTotalFlowRate += BigInt(
					ts.currentFlowRate,
				);
			}
		}

		setInfo(_streamInfo);
	}, [balance?.value, donation.project.anchorContracts, tokenStream]);

	return (
		<Wrapper $flexDirection='column' gap='8px'>
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
						symbol={superToken.underlyingToken?.symbol}
						size={24}
					/>
					<B>{superToken.underlyingToken?.symbol}</B>
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
							{balance?.value !== 0n && percentage !== 0
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
				<StreamInfo gap='16px'>
					<Flex $justifyContent='space-between' gap='4px'>
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
					{tokenStream?.length > 0 && (
						<OtherStreamsInfo>
							{formatMessage(
								{
									id: 'label.you_are_supporting_other_projects_with_this_stream',
								},
								{
									count: tokenStream.length - 1,
								},
							)}
						</OtherStreamsInfo>
					)}
				</StreamInfo>
				<InlineToast
					type={EToastType.Info}
					message='Modifying your active recurring donations will affect when your stream balance runs out.'
				/>
			</Flex>
			<ActionButton
				label={formatMessage({ id: 'label.confirm' })}
				onClick={() => {
					setModifyInfo({
						amount: totalPerMonth,
						totalPerMonth,
						token: superToken,
					});
					setStep(EDonationSteps.CONFIRM);
				}}
				disabled={
					balance?.value === undefined ||
					balance?.value === 0n ||
					isTotalStreamExceed ||
					percentage === 0
				}
			/>
			<SuperfluidLogoContainer gap='16px'>
				<P>{formatMessage({ id: 'label.streams_powered_by' })}</P>
				<Image
					src='/images/logo/superfluid-logo.svg'
					width={120}
					height={30}
					alt='Superfluid logo'
				/>
			</SuperfluidLogoContainer>
		</Wrapper>
	);
};

export const Wrapper = styled(Flex)`
	text-align: left;
	flex-direction: column;
	align-items: stretch;
	justify-content: stretch;
	gap: 16px;
	width: 100%;
	padding: 16px 24px 24px 24px;
	${mediaQueries.tablet} {
		width: 430px;
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

const OtherStreamsInfo = styled(Caption)`
	padding: 8px;
	border-radius: 8px;
	background: var(--Neutral-Gray-200, #f7f7f9);
`;

export const ActionButton = styled(Button)`
	width: 100%;
`;

const StreamInfo = styled(Flex)`
	flex-direction: column;
	margin-top: 16px;
`;

const SuperfluidLogoContainer = styled(Flex)`
	margin-top: 32px;
`;
