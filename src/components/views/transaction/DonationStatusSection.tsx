import React, { FC } from 'react';
import styled from 'styled-components';
import {
	H5,
	P,
	B,
	semanticColors,
	Flex,
	neutralColors,
	brandColors,
	IconExternalLink,
	Button,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { mediaQueries } from '@/lib/constants/constants';
import { UsdAmountCard } from '@/components/views/donate/OnTime/SelectTokenModal/QRCodeDonation/QRDonationCard';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import config from '@/configuration';
import { smallDashedFormatDate } from '@/lib/helpers';
import { ChainType } from '@/types/config';
import { TQRStatus } from '@/components/views/transaction/Transaction.view';
import { IDraftDonation } from '@/apollo/types/gqlTypes';
import { IDonation } from '@/apollo/types/types';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { useQRCodeDonation } from '@/hooks/useQRCodeDonation';
import { client } from '@/apollo/apolloClient';
import { MARK_DRAFT_DONATION_AS_FAILED } from '@/apollo/gql/gqlDonations';
import { useDonateData } from '@/context/donate.context';

type IColor = 'golden' | 'jade' | 'punch' | 'blueSky';
interface TimerProps {
	status: TQRStatus;
	endDate: Date;
	locale: string;
	draftDonationId: number;
	setStatus: (status: TQRStatus) => void;
	checkDraftDonationStatus: (
		draftDonationId: number,
	) => Promise<IDraftDonation | null>;
}

const StatusMap: Record<string, { color: IColor; text: string }> = {
	pending: {
		color: 'golden',
		text: 'pending',
	},
	successful: {
		color: 'jade',
		text: 'successful',
	},
	failed: {
		color: 'punch',
		text: 'failed',
	},
};

type TDonationStatusSectionProps = {
	status: TQRStatus;
	draftDonationData: IDraftDonation;
	donationData: IDonation;
	usdAmount: string;
	setStatus: (status: TQRStatus) => void;
};

const getHowManyPassed = (date: Date, locale: string) => {
	const _date = new Date(date.toLocaleString(locale));
	const diff = new Date().getTime() - _date.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);

	if (days > 0) {
		return {
			value: days,
			unit: days > 1 ? 'days' : 'day',
		};
	} else if (hours > 0) {
		return {
			value: hours,
			unit: hours > 1 ? 'hours' : 'hour',
		};
	} else if (minutes > 0) {
		return {
			value: minutes,
			unit: minutes > 1 ? 'minutes' : 'minute',
		};
	} else {
		return {
			value: seconds,
			unit: seconds > 1 ? 'seconds' : 'second',
		};
	}
};

// AM or PM format hh:mm:ss AM/PM UTC
const formatTime = (date: Date, locale: string) => {
	return date.toLocaleTimeString(locale, {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: true,
	});
};

// Timer that keep counting time before the donation expires (mm Minutes ss Seconds) format
const Timer: React.FC<TimerProps> = ({
	status,
	endDate,
	locale,
	draftDonationId,
	setStatus,
	checkDraftDonationStatus,
}) => {
	const _endDate = new Date(endDate.toLocaleString(locale));

	const calculateTimeLeft = () => {
		const now = new Date().getTime();
		const leftTime = _endDate.getTime() - now;

		return {
			minutes: leftTime > 0 ? Math.floor(leftTime / 60000) : 0,
			seconds: leftTime > 0 ? Math.floor((leftTime % 60000) / 1000) : 0,
		};
	};

	const [time, setTime] = React.useState(calculateTimeLeft);

	React.useEffect(() => {
		const handleTimeout = async () => {
			const draftDonation =
				await checkDraftDonationStatus(draftDonationId);

			if (draftDonation?.status === 'matched') {
				setStatus('successful');
			} else {
				await client.mutate({
					mutation: MARK_DRAFT_DONATION_AS_FAILED,
					variables: { id: Number(draftDonationId) },
					fetchPolicy: 'no-cache',
				});
				setStatus('failed');
			}
		};

		const tick = async () => {
			const timeLeft = calculateTimeLeft();

			if (timeLeft.minutes === 0 && timeLeft.seconds === 0) {
				await handleTimeout();
				clearInterval(interval); // Stop the interval after handling timeout
				return;
			}

			setTime(timeLeft);
		};

		const interval = setInterval(tick, 1000);

		return () => clearInterval(interval);
	}, [
		_endDate,
		draftDonationId,
		status,
		locale,
		checkDraftDonationStatus,
		setStatus,
	]);

	return (time.minutes === 0 && time.seconds === 0) || status === 'failed' ? (
		<FlexWrap $alignItems='center' gap='8px'>
			<P>{'15 Minutes'}</P>
			<TextBox>{'Expired at ' + formatTime(_endDate, locale)}</TextBox>
		</FlexWrap>
	) : (
		<P>
			{time.minutes.toString().padStart(2, '0')} {' Minutes '}
			{time.seconds.toString().padStart(2, '0')} {' Seconds '}
		</P>
	);
};

const transactionLink = 'https://stellar.expert/explorer/public/tx/';

const formatComponent = (date: string | undefined, locale: string) => {
	const timePassed = getHowManyPassed(new Date(date ?? ''), locale);

	return (
		<FlexWrap $alignItems='center' gap='8px'>
			{date ? (
				<>
					<P style={{ minWidth: 'fit-content' }}>
						{timePassed.value} {timePassed.unit} ago
					</P>
					<TextBox>{smallDashedFormatDate(new Date(date))}</TextBox>
					<TextBox>{formatTime(new Date(date), locale)}</TextBox>
				</>
			) : (
				'NA'
			)}
		</FlexWrap>
	);
};

const DonationStatusSection: FC<TDonationStatusSectionProps> = ({
	status,
	draftDonationData,
	donationData,
	usdAmount,
	setStatus,
}) => {
	const { locale, formatMessage } = useIntl();
	const { project } = useDonateData();
	const { checkDraftDonationStatus } = useQRCodeDonation(project);

	return (
		<DetailsWapper>
			<Flex
				$justifyContent='space-between'
				$alignItems='center'
				style={{ width: '100%' }}
			>
				<StyledH5>
					{formatMessage({ id: 'label.donation_status' })}
				</StyledH5>
				<StatusBadge status={status}>
					<ColorfulDot status={status} />
					{formatMessage({
						id: `label.${StatusMap[status].text}`,
					})}
				</StatusBadge>
			</Flex>
			<DetailsSection>
				<FlexWrap $alignItems='center'>
					<Label>{formatMessage({ id: 'label.amount' })}</Label>
					<FlexWrap $alignItems='center' gap='8px'>
						<B>{draftDonationData?.amount}</B>
						<UsdAmountCard>$ {usdAmount}</UsdAmountCard>
						<TokenIcon
							symbol={
								config.NETWORKS_CONFIG[ChainType.STELLAR]
									.nativeCurrency.symbol
							}
							size={32}
						/>
						<TokenSymbol>
							{
								config.NETWORKS_CONFIG[ChainType.STELLAR]
									.nativeCurrency.symbol
							}{' '}
							on {config.NETWORKS_CONFIG[ChainType.STELLAR].name}
						</TokenSymbol>
					</FlexWrap>
				</FlexWrap>
				<FlexWrap $alignItems='center'>
					<Label>{formatMessage({ id: 'label.from' })}</Label>
					{donationData?.fromWalletAddress ? (
						<Link>{donationData.fromWalletAddress}</Link>
					) : (
						<B>{'NA'}</B>
					)}
				</FlexWrap>
				<FlexWrap $alignItems='center'>
					<Label>{formatMessage({ id: 'label.donating_to' })}</Label>
					{draftDonationData?.project?.title ? (
						<Link>{draftDonationData.project.title}</Link>
					) : (
						<B>{'NA'}</B>
					)}
				</FlexWrap>
				<FlexWrap $alignItems='center'>
					<Label $capitalize>
						{formatMessage({ id: 'label.recipient_address' })}
					</Label>
					<B style={{ wordBreak: 'break-word' }}>
						{draftDonationData?.toWalletAddress ?? 'NA'}
					</B>
				</FlexWrap>
				<FlexWrap $alignItems='center'>
					<Label>{formatMessage({ id: 'label.memo' })}</Label>
					<B>{draftDonationData?.toWalletMemo ?? 'NA'}</B>
				</FlexWrap>
				<FlexWrap $alignItems='center'>
					<Label>{formatMessage({ id: 'label.date' })}</Label>
					{formatComponent(draftDonationData?.createdAt, locale)}
				</FlexWrap>
				<FlexWrap $alignItems='center'>
					<Label $capitalize>
						{formatMessage({
							id: draftDonationData?.matchedDonationId
								? 'label.transaction_link'
								: 'label.valid_for',
						})}
					</Label>
					{draftDonationData?.matchedDonationId ? (
						donationData?.transactionId ? (
							<Flex $alignItems='center' gap='8px'>
								<ExternalLink
									href={`${transactionLink}${donationData.transactionId}`}
									title={formatMessage({
										id: 'label.view_details',
									})}
									color={brandColors.pinky[500]}
								/>
								<IconExternalLink
									color={brandColors.pinky[500]}
								/>
							</Flex>
						) : (
							<B>{'NA'}</B>
						)
					) : (
						<B>
							{Timer({
								status,
								endDate: new Date(
									draftDonationData?.expiresAt!,
								),
								locale,
								draftDonationId: Number(draftDonationData.id),
								setStatus,
								checkDraftDonationStatus,
							})}
						</B>
					)}
				</FlexWrap>
			</DetailsSection>
			<Hr />
			<Flex $justifyContent='center' style={{ width: '100%' }}>
				{status === 'failed' ? (
					<FlexDirection
						$justifyContent='space-between'
						$alignItems='center'
						style={{ width: '100%' }}
					>
						<P>
							{formatMessage({
								id: 'label.did_the_donation_but_not_confirmed',
							})}
						</P>
						<ButtonStyled
							label={formatMessage({
								id: 'label.raise_a_ticket',
							})}
							onClick={() =>
								window.open(
									links.REPORT_FAILED_DONATION,
									'_blank',
								)
							}
						/>
					</FlexDirection>
				) : (
					<P
						style={{
							paddingBlock: '8px',
							color: neutralColors.gray[800],
							textAlign: 'center',
						}}
					>
						{formatMessage({
							id:
								status === 'pending'
									? 'label.please_wait_we_will_update'
									: 'label.the_donation_was_successful',
						})}
					</P>
				)}
			</Flex>
		</DetailsWapper>
	);
};

const DetailsWapper = styled(Flex)`
	width: 80%;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 30px;
	padding: 20px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	background-color: ${neutralColors.gray[100]};

	${mediaQueries.laptopL} {
		width: 60%;
	}

	${mediaQueries.desktop} {
		width: 50%;
	}
`;

const StyledH5 = styled(H5)`
	color: ${neutralColors.gray[800]} !important;
	font-weight: 700 !important;
`;

const StatusBadge = styled(Flex)<{ status: string }>`
	background-color: ${({ status }) =>
		semanticColors[StatusMap[status].color][100]};
	padding: 2px 8px;
	border-radius: 16px;
	justify-self: end;
	justify-content: center;
	font-size: 12px;
	gap: 4px;
	color: ${({ status }) => semanticColors[StatusMap[status].color][700]};
	border: 1px solid
		${({ status }) => semanticColors[StatusMap[status].color][300]};
	text-transform: capitalize;
`;

const ColorfulDot = styled.div<{ status: string }>`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-block: auto;
	background-color: ${({ status }) =>
		semanticColors[StatusMap[status].color][700]};
`;

const TokenSymbol = styled(B)`
	white-space: nowrap;
`;

const DetailsSection = styled(Flex)`
	flex-direction: column;
	padding: 16px;
	background-color: ${neutralColors.gray[200]};
	border: 1px solid ${neutralColors.gray[200]};
	border-radius: 8px;
	color: ${neutralColors.gray[800]};
	gap: 25px;
	width: 100%;
`;

const Label = styled(B)<{ $capitalize?: boolean }>`
	width: 50%;
	text-transform: ${({ $capitalize }) =>
		$capitalize ? 'capitalize' : 'none'};
	color: ${neutralColors.gray[700]};

	${mediaQueries.laptopS} {
		width: 19%;
	}
`;

const Hr = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${neutralColors.gray[300]};
`;

const Link = styled(B)`
	color: ${semanticColors.blueSky[500]};
	cursor: pointer;
	word-break: break-word;
`;

const TextBox = styled(P)`
	padding: 2px 8px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	background-color: ${neutralColors.gray[300]};
	min-width: fit-content;
`;

const ButtonStyled = styled(Button)`
	text-transform: capitalize;
	padding-inline: 60px;
`;

const FlexWrap = styled(Flex)`
	flex-wrap: wrap;
`;

const FlexDirection = styled(Flex)`
	flex-direction: column;
	gap: 16px;

	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

export default DonationStatusSection;
