import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
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
	mediaQueries,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useDonateData } from '@/context/donate.context';
import { UsdAmountCard } from './QRDonationCard';
import { TokenIcon } from '../../../TokenIcon/TokenIcon';
import config from '@/configuration';
import { ChainType } from '@/types/config';
import { fetchPriceWithCoingeckoId } from '@/services/token';
import { formatBalance } from '@/lib/helpers';
import links from '@/lib/constants/links';
import { useAppSelector } from '@/features/hooks';
import Routes from '@/lib/constants/Routes';
import { useQRCodeDonation } from '@/hooks/useQRCodeDonation';

const QRDonationDetails = () => {
	const { formatMessage } = useIntl();
	const router = useRouter();
	const { checkDraftDonationStatus } = useQRCodeDonation();
	const {
		project,
		draftDonationData,
		qrDonationStatus,
		startTimer,
		fetchDraftDonation,
		setQRDonationStatus,
		setDraftDonationData,
	} = useDonateData();
	const { isSignedIn } = useAppSelector(state => state.user);

	const [tokenPrice, setTokenPrice] = useState(0);

	const { title, addresses } = project;

	const draftDonationId = router.query.draft_donation;
	const stellarAddress = addresses?.find(
		address => address.chainType === ChainType.STELLAR,
	)?.address;

	const convertToUSD = (amount: number) => {
		if (!amount) return '--';
		if (!tokenPrice) return '0.00';

		const _tokenPrice = Math.floor(tokenPrice * 100) / 100;
		const amountInUsd = _tokenPrice * amount;
		return formatBalance(amountInUsd);
	};

	const isFailedOperation = ['expired', 'failed'].includes(qrDonationStatus);

	const raiseTicket = async () => {
		const draftDonation = await checkDraftDonationStatus(
			Number(draftDonationId),
		);
		if (draftDonation?.status === 'matched') {
			setQRDonationStatus('success');
			setDraftDonationData(draftDonation);
			return;
		}
		window.open(links.REPORT_FAILED_DONATION, '_blank');
	};

	useEffect(() => {
		let stopTimer: void | (() => void);
		if (draftDonationData?.expiresAt) {
			stopTimer = startTimer?.(new Date(draftDonationData?.expiresAt));
		}

		return () => {
			stopTimer?.();
		};
	}, [draftDonationData?.expiresAt]);

	useEffect(() => {
		if (!stellarAddress) return;

		fetchDraftDonation?.(Number(draftDonationId));

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
			fetchDraftDonation?.(Number(draftDonationId));
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
					<FlexWrap $alignItems='center' gap='8px'>
						<B>{draftDonationData?.amount ?? '--'}</B>
						<UsdAmountCard>
							$ {convertToUSD(draftDonationData?.amount!)}
						</UsdAmountCard>
						<Flex gap='8px' $alignItems='center'>
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
								on{' '}
								{config.NETWORKS_CONFIG[ChainType.STELLAR].name}
							</TokenSymbol>
						</Flex>
					</FlexWrap>
					<P>
						{formatMessage({
							id: 'label.donating_to',
						})}
					</P>
					<B>{title || '--'}</B>
				</DonationDetails>
				<Hr />
				<LinkSection
					$justifyContent='space-between'
					$alignItems='center'
				>
					<B style={{ color: neutralColors.gray[800] }}>
						{formatMessage({ id: 'label.please_wait' })}
					</B>
					<CheckDonation
						onClick={() =>
							window.open(
								Routes.Invoice + '/' + draftDonationData?.id,
								'_blank',
							)
						}
					>
						{formatMessage({ id: 'label.check_donations' })}
						<IconArrowRight size={24} />
					</CheckDonation>
				</LinkSection>
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
					onClick={raiseTicket}
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

const Timer = styled.div`
	font-size: 24px;
	color: ${neutralColors.gray[900]};
	font-weight: 700;
	font-family: 'TeX Gyre Adventor';
`;

const Note = styled(Flex)`
	align-items: start;
	padding: 8px 4px;
	color: ${semanticColors.blueSky[700]};
	gap: 16px;

	> :first-child {
		margin-top: 4px;
	}
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

const CheckDonation = styled.p`
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	text-transform: capitalize;
	font-weight: 500;
	color: ${brandColors.pinky[500]} !important;
`;

const LinkSection = styled(Flex)`
	flex-direction: column;

	${mediaQueries.mobileM} {
		flex-direction: row;
	}
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

const FlexWrap = styled(Flex)`
	flex-wrap: wrap;
`;
export default QRDonationDetails;
