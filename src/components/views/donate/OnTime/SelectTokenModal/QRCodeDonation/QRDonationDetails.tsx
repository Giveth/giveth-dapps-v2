import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDonateData } from '@/context/donate.context';
import {
	neutralColors,
	P,
	B,
	Flex,
	IconInfoOutline,
	semanticColors,
	brandColors,
	IconArrowRight,
	Button,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { UsdAmountCard } from './QRDonationCard';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import config from '@/configuration';
import { ChainType } from '@/types/config';
import { fetchPriceWithCoingeckoId } from '@/services/token';
import { formatBalance } from '@/lib/helpers';
import links from '@/lib/constants/links';
import { useAppSelector } from '@/features/hooks';
import Routes from '@/lib/constants/Routes';

const QRDonationDetails = () => {
	const { formatMessage } = useIntl();
	const {
		project,
		draftDonationData,
		qrDonationStatus,
		startTimer,
		fetchDraftDonation,
	} = useDonateData();
	const { isSignedIn } = useAppSelector(
		state => state.user,
	);

	const [tokenPrice, setTokenPrice] = useState(0);

	const { title } = project;

	const convertToUSD = (amount: number) => {
		if (!tokenPrice) return '0.00';

		const _tokenPrice = Math.floor(tokenPrice * 100) / 100;
		const amountInUsd = _tokenPrice * amount;
		return formatBalance(amountInUsd);
	};

	const isFailedOperation = ['expired', 'failed'].includes(qrDonationStatus);

	const goToDonations = () => {
		if (isSignedIn) {
			window.open(Routes.MyDonations, '_blank');
		} else {
			window.open(Routes.Invoice + '/' + draftDonationData?.id, '_blank');
		}
	}

	useEffect(() => {
		draftDonationData?.expiresAt &&
			startTimer?.(new Date(draftDonationData?.expiresAt));
	}, [draftDonationData?.expiresAt]);

	useEffect(() => {
		fetchDraftDonation?.();

		const fetchTokenPrice = async () => {
			const coingeckoChainId =
				config.NETWORKS_CONFIG[ChainType.STELLAR].coingeckoChainName;
			const price = await fetchPriceWithCoingeckoId(coingeckoChainId);
			if (price) {
				setTokenPrice(price);
			}
		};

		fetchTokenPrice();

		// Set up interval to refresh every 5 minutes
		const intervalId = setInterval(() => {
			fetchTokenPrice();
			fetchDraftDonation?.();
		}, 300000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<>
			<Title>
				{formatMessage({ id: 'label.waiting_for_your_donation' })}
			</Title>
			<RunnningTime>
				<P>
					{formatMessage({
						id: 'label.remaining_time',
					})}
				</P>
				<Timer id='timer'></Timer>
			</RunnningTime>
			<Note>
				<IconInfoOutline size={16} />
				<P>
					{formatMessage({
						id: 'label.you_need_to_submit_your_donation_before_the_timer_runs_out',
					})}
				</P>
			</Note>
			<DonationStatus>
				<Flex
					$justifyContent='space-between'
					$alignItems='center'
					style={{ width: '100%' }}
				>
					<B style={{ color: neutralColors.gray[800] }}>
						{formatMessage({
							id: 'label.donation_status',
						})}
					</B>
					<StatusBadge status={qrDonationStatus}>
						<ColorfulDot status={qrDonationStatus} />
						{formatMessage({
							id: `label.${qrDonationStatus === 'expired' ? 'failed' : qrDonationStatus}`,
						})}
					</StatusBadge>
				</Flex>
				<DonationDetails>
					<Flex $alignItems='center' gap='8px'>
						<B>{draftDonationData?.amount}</B>
						<UsdAmountCard>
							$ {convertToUSD(draftDonationData?.amount!)}
						</UsdAmountCard>
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
					<P>
						{formatMessage({
							id: 'label.donating_to',
						})}
					</P>
					<B>{title}</B>
				</DonationDetails>
				<Hr />
				<Flex $justifyContent='space-between'>
					<B style={{ color: neutralColors.gray[800] }}>
						{formatMessage({ id: 'label.please_wait' })}
					</B>
					<CheckDonation onClick={() => goToDonations()}>
						{formatMessage({ id: 'label.check_donations' })}
						<IconArrowRight size={24} />
					</CheckDonation>
				</Flex>
			</DonationStatus>
			<B style={{ marginTop: '50px', color: neutralColors.gray[800] }}>
				{formatMessage({
					id: isFailedOperation
						? 'label.did_the_donation_but_not_confirmed'
						: 'label.please_wait_for_you_donation_to_come_through',
				})}
			</B>
			{isFailedOperation && (
				<ButtonStyled
					label={formatMessage({
						id: 'label.raise_a_ticket',
					})}
					onClick={() => window.open(links.REPORT_FAILED_DONATION, '_blank')}
				/>
			)}
		</>
	);
};

const Title = styled(B)`
	color: ${neutralColors.gray[800]};
	text-align: left;
	text-transform: capitalize;
`;

const RunnningTime = styled(Flex)`
	margin-top: 20px;
	justify-content: space-between;
	background-color: ${neutralColors.gray[300]};
	padding: 16px;
	border-radius: 8px;
	align-items: center;
	color: ${neutralColors.gray[700]};
	font-weight: 500;
`;

const Timer = styled(B)`
	font-size: 24px;
	color: ${neutralColors.gray[900]};
	font-weight: 700;
	font-family: 'TeX Gyre Adventor';
`;

const Note = styled(Flex)`
	align-items: center;
	margin-top: 20px;
	color: ${semanticColors.blueSky[700]};
	gap: 8px;
`;

const DonationStatus = styled(Flex)`
	flex-direction: column;
	margin-top: 20px;
	padding: 16px 16px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	background-color: ${neutralColors.gray[100]};
	gap: 16px;
`;

const StatusBadge = styled(Flex)<{ status: string }>`
	background-color: ${({ status }) =>
		status === 'waiting'
			? semanticColors.golden[100]
			: status === 'success'
				? semanticColors.jade[100]
				: semanticColors.punch[100]};
	padding: 2px 8px;
	border-radius: 16px;
	justify-self: end;
	justify-content: center;
	font-size: 12px;
	gap: 4px;
	color: ${({ status }) =>
		status === 'waiting'
			? semanticColors.golden[700]
			: status === 'success'
				? semanticColors.jade[700]
				: semanticColors.punch[700]};
	border: 1px solid
		${({ status }) =>
			status === 'waiting'
				? semanticColors.golden[300]
				: status === 'success'
					? semanticColors.jade[300]
					: semanticColors.punch[300]};
`;

const ColorfulDot = styled.div<{ status: string }>`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	margin-block: auto;
	background-color: ${({ status }) =>
		status === 'waiting'
			? semanticColors.golden[700]
			: status === 'success'
				? semanticColors.jade[700]
				: semanticColors.punch[700]};
`;

const DonationDetails = styled(Flex)`
	flex-direction: column;
	padding: 8px;
	background-color: ${neutralColors.gray[200]};
	border: 1px solid ${neutralColors.gray[200]};
	border-radius: 8px;
	color: ${neutralColors.gray[800]};
	gap: 4px;

	> :first-child {
		margin-bottom: 10px;
	}
`;

const TokenSymbol = styled(B)`
	white-space: nowrap;
`;

const CheckDonation = styled(B)`
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	text-transform: capitalize;
	color: ${brandColors.pinky[500]};
`;

const Hr = styled.div`
	width: 100%;
	height: 1px;
	background-color: ${neutralColors.gray[300]};
`;

const ButtonStyled = styled(Button)`
	margin-top: 16px;
	width: 100%;
	text-transform: capitalize;
`;

export default QRDonationDetails;
