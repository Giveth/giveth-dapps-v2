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

type IColor = 'golden' | 'jade' | 'punch' | 'blueSky';

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
const Timer = (endDate: Date, locale: string) => {
	const _endDate = new Date(endDate.toLocaleString(locale));
	const leftTime = _endDate.getTime() - new Date().getTime();

	const [time, setTime] = React.useState({
		minutes: leftTime > 0 ? Math.floor(leftTime / 60000) : 0,
		seconds: leftTime > 0 ? Math.floor((leftTime % 60000) / 1000) : 0,
	});

	React.useEffect(() => {
		const interval = setInterval(() => {
			if (time.minutes === 0 && time.seconds === 0) {
				clearInterval(interval);
			} else if (time.seconds === 0) {
				setTime({
					minutes: time.minutes - 1,
					seconds: 59,
				});
			} else {
				setTime({
					minutes: time.minutes,
					seconds: time.seconds - 1,
				});
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [time]);

	return time.minutes === 0 && time.seconds === 0 ? (
		<>
			<P>{'30 Minutes'}</P>
			<TextBox>{'Ecxpired at ' + formatTime(_endDate, locale)}</TextBox>
		</>
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
		<Flex $alignItems='center' gap='8px'>
			{date ? (
				<>
					<P>
						{timePassed.value} {timePassed.unit} ago
					</P>
					<TextBox>{smallDashedFormatDate(new Date(date))}</TextBox>
					<TextBox>{formatTime(new Date(date), locale)}</TextBox>
				</>
			) : (
				'NA'
			)}
		</Flex>
	);
};

const DonationStatusSection: FC<TDonationStatusSectionProps> = ({
	status,
	draftDonationData,
	donationData,
	usdAmount,
}) => {
	const { locale, formatMessage } = useIntl();

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
				<Flex $alignItems='center'>
					<Label>{formatMessage({ id: 'label.amount' })}</Label>
					<Flex $alignItems='center' gap='8px'>
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
					</Flex>
				</Flex>
				<Flex $alignItems='center'>
					<Label>{formatMessage({ id: 'label.from' })}</Label>
					{donationData?.fromWalletAddress ? (
						<Link>{donationData.fromWalletAddress}</Link>
					) : (
						<B>{'NA'}</B>
					)}
				</Flex>
				<Flex $alignItems='center'>
					<Label>{formatMessage({ id: 'label.donating_to' })}</Label>
					{draftDonationData?.project?.title ? (
						<Link>{draftDonationData.project.title}</Link>
					) : (
						<B>{'NA'}</B>
					)}
				</Flex>
				<Flex $alignItems='center'>
					<Label $capitalize>
						{formatMessage({ id: 'label.recipient_address' })}
					</Label>
					<B>{draftDonationData?.toWalletAddress ?? 'NA'}</B>
				</Flex>
				<Flex $alignItems='center'>
					<Label>{formatMessage({ id: 'label.memo' })}</Label>
					<B>{draftDonationData?.toWalletMemo ?? 'NA'}</B>
				</Flex>
				<Flex $alignItems='center'>
					<Label>{formatMessage({ id: 'label.date' })}</Label>
					{formatComponent(draftDonationData?.createdAt, locale)}
				</Flex>
				<Flex $alignItems='center'>
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
							{Timer(
								new Date(draftDonationData?.expiresAt!),
								locale,
							)}
						</B>
					)}
				</Flex>
			</DetailsSection>
			<Hr />
			<Flex $justifyContent='center' style={{ width: '100%' }}>
				{status === 'failed' ? (
					<Flex
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
					</Flex>
				) : (
					<P
						style={{
							paddingBlock: '8px',
							color: neutralColors.gray[800],
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

const Label = styled(P)<{ $capitalize?: boolean }>`
	width: 16%;
	text-transform: ${({ $capitalize }) =>
		$capitalize ? 'capitalize' : 'none'};
`;

const Hr = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${neutralColors.gray[300]};
`;

const Link = styled(B)`
	color: ${semanticColors.blueSky[500]};
	cursor: pointer;
`;

const TextBox = styled(P)`
	padding: 2px 8px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	background-color: ${neutralColors.gray[300]};
`;

const ButtonStyled = styled(Button)`
	text-transform: capitalize;
	padding-inline: 60px;
`;

export default DonationStatusSection;
