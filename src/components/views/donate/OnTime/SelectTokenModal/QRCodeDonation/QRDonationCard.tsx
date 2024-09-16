import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styled from 'styled-components';
import {
	B,
	P,
	Button,
	Flex,
	neutralColors,
	IconArrowLeft,
	mediaQueries,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { formatUnits } from 'viem';

import {
	InputWrapper,
	SelectTokenWrapper,
} from '../../../Recurring/RecurringDonationCard';
import { TokenIconWithGIVBack } from '../../../TokenIcon/TokenIconWithGIVBack';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { fetchPriceWithCoingeckoId } from '@/services/token';
import { ChainType } from '@/types/config';
import config from '@/configuration';
import {
	truncateToDecimalPlaces,
	capitalizeAllWords,
	formatBalance,
	showToastError,
} from '@/lib/helpers';
import { IDonationCardProps } from '../../../DonationCard';
import QRDonationCardContent from './QRDonationCardContent';
import { useQRCodeDonation } from '@/hooks/useQRCodeDonation';
import { useDonateData } from '@/context/donate.context';
import { AmountInput } from '@/components/AmountInput/AmountInput';
import StorageLabel from '@/lib/localStorage';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { useAppSelector } from '@/features/hooks';
import { useModalCallback } from '@/hooks/useModalCallback';
import links from '@/lib/constants/links';
import DonateQFEligibleNetworks from '@/components/views/donate/OnTime/DonateQFEligibleNetworks';

interface QRDonationCardProps extends IDonationCardProps {
	qrAcceptedTokens: IProjectAcceptedToken[];
	setIsQRDonation: (isQRDonation: boolean) => void;
}

const formatAmountToDisplay = (amount: bigint) => {
	const decimals = 18;
	return truncateToDecimalPlaces(
		formatUnits(amount, decimals),
		decimals / 3,
	).toString();
};

export const QRDonationCard: FC<QRDonationCardProps> = ({
	showQRCode,
	qrAcceptedTokens,
	setIsQRDonation,
	setShowQRCode,
}) => {
	const { formatMessage } = useIntl();
	const router = useRouter();
	const { isSignedIn, isEnabled } = useAppSelector(state => state.user);
	const isQRDonation = router.query.chain === ChainType.STELLAR.toLowerCase();
	const [_showDonateModal, setShowDonateModal] = useState(false);
	const { modalCallback: signInThenDonate } = useModalCallback(() =>
		setShowDonateModal(true),
	);

	const {
		project,
		hasActiveQFRound,
		setQRDonationStatus,
		setDraftDonationData,
		setPendingDonationExists,
		fetchDraftDonation,
		pendingDonationExists,
		qrDonationStatus,
		draftDonationData,
		draftDonationLoading,
	} = useDonateData();
	const {
		createDraftDonation,
		markDraftDonationAsFailed,
		checkDraftDonationStatus,
		retrieveDraftDonation,
	} = useQRCodeDonation(project);

	const { addresses, id } = project;
	const draftDonationId = Number(router.query.draft_donation!);
	const [amount, setAmount] = useState(0n);
	const [usdAmount, setUsdAmount] = useState('0.00');
	const [tokenPrice, setTokenPrice] = useState(0);

	const stellarToken = qrAcceptedTokens.find(
		token => token.chainType === ChainType.STELLAR,
	);
	const projectAddress = addresses?.find(
		address => address.chainType === ChainType.STELLAR,
	);

	useEffect(() => {
		const eventSource = new EventSource(
			`${process.env.NEXT_PUBLIC_BASE_ROUTE}/events`,
		);

		const handleFetchDraftDonation = async (draftDonationId: number) => {
			const draftDonation = await fetchDraftDonation?.(draftDonationId);
			if (draftDonation?.status === 'matched') {
				setQRDonationStatus('success');
				setDraftDonationData(draftDonation);
			}
		};

		eventSource.onmessage = (event: MessageEvent) => {
			const { data, type } = JSON.parse(event.data);
			if (
				type === 'new-donation' &&
				data.draftDonationId === draftDonationId
			) {
				handleFetchDraftDonation(draftDonationId);
			} else if (
				type === 'draft-donation-failed' &&
				data.draftDonationId === draftDonationId
			) {
				setQRDonationStatus('failed');
			}
		};

		eventSource.onerror = (error: Event) => {
			console.error('EventSource failed:', error);
		};

		return () => {
			eventSource.close();
		};
	}, [draftDonationId]);

	const goBack = async () => {
		const prevQuery = router.query;

		const updateQuery = (excludeKey: string) =>
			Object.keys(prevQuery).reduce((acc, key) => {
				return key !== excludeKey
					? { ...acc, [key]: prevQuery[key] }
					: acc;
			}, {});

		if (showQRCode) {
			const draftDonation =
				await checkDraftDonationStatus(draftDonationId);

			if (draftDonation?.status === 'matched') {
				setQRDonationStatus('success');
				setDraftDonationData(draftDonation);
				return;
			}

			await markDraftDonationAsFailed(draftDonationId);
			setPendingDonationExists?.(false);
			setShowQRCode(false);

			await router.push(
				{ query: updateQuery('draft_donation') },
				undefined,
				{ shallow: true },
			);
		} else {
			setIsQRDonation(false);

			await router.push({ query: updateQuery('chain') }, undefined, {
				shallow: true,
			});
		}

		setQRDonationStatus('waiting');
	};

	const handleNext = async () => {
		if (isEnabled && !isSignedIn) {
			signInThenDonate();
		} else {
			const draftDonations = localStorage.getItem(
				StorageLabel.DRAFT_DONATIONS,
			);
			const parsedLocalStorageItem = JSON.parse(draftDonations!);
			const projectAddress = project.addresses?.find(
				address => address.chainType === ChainType.STELLAR,
			);
			let draftDonationId = parsedLocalStorageItem
				? parsedLocalStorageItem[projectAddress?.address!]
				: null;

			const retDraftDonation = draftDonationId
				? await retrieveDraftDonation(Number(draftDonationId))
				: null;

			if (retDraftDonation && retDraftDonation.status === 'pending') {
				setPendingDonationExists?.(true);
			} else {
				if (!stellarToken?.symbol || !projectAddress?.address) return;

				try {
					const payload = {
						walletAddress: projectAddress.address,
						projectId: Number(id),
						amount: Number(formatAmountToDisplay(amount)),
						token: stellarToken,
						anonymous: isSignedIn && isEnabled ? false : true,
						symbol: stellarToken.symbol,
						setFailedModalType: () => {},
						useDonationBox: false,
						chainId: stellarToken?.networkId,
						memo: projectAddress.memo,
					};

					draftDonationId = await createDraftDonation(payload);
				} catch (error) {
					showToastError(error);
					return;
				}
				setPendingDonationExists?.(false);
			}

			if (draftDonationId) {
				await router.push(
					{
						query: {
							...router.query,
							draft_donation: draftDonationId,
						},
					},
					undefined,
					{ shallow: true },
				);
			}
			setShowQRCode(true);
		}
	};

	const convertAmountToUSD = (amount: bigint) => {
		if (!stellarToken || !tokenPrice) return '0.00';

		const priceBigInt = BigInt(Math.floor(tokenPrice * 100));
		const amountInUsd = (amount * priceBigInt) / 100n;
		return formatBalance(formatAmountToDisplay(amountInUsd));
	};

	const calculateUsdAmount = (amount?: number) => {
		if (!tokenPrice || !amount) return '0.00';

		return formatBalance(amount * tokenPrice);
	};

	useEffect(() => {
		setUsdAmount(convertAmountToUSD(amount));
	}, [amount, tokenPrice]);

	useEffect(() => {
		const fetchTokenPrice = async () => {
			const coingeckoChainId =
				config.NETWORKS_CONFIG[ChainType.STELLAR].coingeckoChainName;
			const price = await fetchPriceWithCoingeckoId(coingeckoChainId);
			if (price) setTokenPrice(price);
		};

		fetchTokenPrice();
	}, []);

	return (
		<>
			<CardHead>
				<ClickableImage onClick={goBack}>
					<IconArrowLeft size={20} />
				</ClickableImage>
				<Title>
					{formatMessage({
						id: showQRCode
							? 'label.go_back_to_modify_your_donation'
							: 'page.project.donate_with_stellar',
					})}
				</Title>
			</CardHead>
			{pendingDonationExists && (
				<MarginLessInlineToast
					type={EToastType.Warning}
					message={formatMessage({
						id: 'label.you_already_have_another_pending_donation',
					})}
				/>
			)}
			{!showQRCode && !isSignedIn && stellarToken?.isGivbackEligible && (
				<InlineToast
					noIcon
					type={EToastType.Hint}
					message={formatMessage({
						id: 'label.sign_in_with_your_eth_wallet_for_givebacks',
					})}
					link={links.GIVBACK_DOC}
					linkText={capitalizeAllWords(
						formatMessage({
							id: 'label.learn_more',
						}),
					)}
				/>
			)}
			{!showQRCode ? (
				<>
					<StyledInputWrapper>
						<SelectTokenWrapper
							$alignItems='center'
							$justifyContent='space-between'
						>
							<Flex gap='8px' $alignItems='center'>
								<TokenIconWithGIVBack
									showGiveBack={
										stellarToken?.isGivbackEligible
									}
									symbol={stellarToken?.symbol}
									size={32}
								/>
								<TokenSymbol>
									{
										config.NETWORKS_CONFIG[
											ChainType.STELLAR
										].name
									}{' '}
									({stellarToken?.symbol})
								</TokenSymbol>
							</Flex>
						</SelectTokenWrapper>
						<QRDonationInput>
							<Input amount={amount} setAmount={setAmount} />
							<UsdAmountCard>$ {usdAmount}</UsdAmountCard>
						</QRDonationInput>
					</StyledInputWrapper>
					{hasActiveQFRound && isQRDonation && (
						<DonateQFEligibleNetworks goBack={goBack} />
					)}
					<CardBottom>
						<FlexStyled
							$justifyContent='space-between'
							$color={neutralColors.gray[100]}
						>
							<P>
								{formatMessage({ id: 'label.donating_to' })}{' '}
								<strong style={{ textTransform: 'capitalize' }}>
									{project.title || '--'}
								</strong>
							</P>
							<B>{formatAmountToDisplay(amount)}</B>
						</FlexStyled>
						<FlexStyled
							$justifyContent='space-between'
							$color={neutralColors.gray[300]}
						>
							<B>
								{formatMessage({
									id: 'label.your_total_donation',
								})}
							</B>
							<B>{formatAmountToDisplay(amount)}</B>
						</FlexStyled>
						<Button
							label='Next'
							color='primary'
							icon={
								<Image
									src='/images/rarrow.svg'
									alt='Next'
									width={16}
									height={16}
									style={{ marginLeft: '8px' }} // Add margin to the right of the icon
								/>
							}
							onClick={handleNext}
							disabled={amount === 0n}
						/>
					</CardBottom>
				</>
			) : (
				<QRDonationCardContent
					tokenData={stellarToken}
					usdAmount={calculateUsdAmount(draftDonationData?.amount)}
					amount={draftDonationData?.amount?.toString() ?? '0.00'}
					qrDonationStatus={qrDonationStatus}
					draftDonationData={draftDonationData}
					projectAddress={projectAddress}
					draftDonationLoading={draftDonationLoading}
				/>
			)}
		</>
	);
};

const CardHead = styled(Flex)`
	align-items: center;
	padding: 1rem 0;
	gap: 1rem;
`;

const Title = styled(B)`
	color: ${neutralColors.gray[800]};
	text-align: left;
`;

const ClickableImage = styled(Flex)`
	cursor: pointer;
	align-items: center;
`;

const TokenSymbol = styled(B)`
	white-space: nowrap;
`;

export const UsdAmountCard = styled.div`
	padding: 4px 16px;
	margin-inline: 4px;
	white-space: nowrap;
	background: ${neutralColors.gray[300]};
	border-radius: 16px;
	color: ${neutralColors.gray[700]};
`;

const CardBottom = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1rem 0;
	height: 100%;
	justify-content: end;
	min-height: 300px;
`;

const FlexStyled = styled(Flex)<{ $color: string }>`
	border: 1px solid ${props => props.$color};
	background: ${props => props.$color};
	border-radius: 8px;
	padding: 8px;
`;

const Input = styled(AmountInput)`
	width: 100%;

	#amount-input {
		border: none;
		flex: 1;
		font-family: Red Hat Text;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: 24px;
		width: 100%;
	}
`;

const QRDonationInput = styled(Flex)`
	width: 100%;
	border-top: 2px solid ${neutralColors.gray[300]};

	${mediaQueries.tablet} {
		border-left: 2px solid ${neutralColors.gray[300]};
		border-top: none;
	}
`;

const StyledInputWrapper = styled(InputWrapper)`
	flex-direction: column;

	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const MarginLessInlineToast = styled(InlineToast)`
	margin: 0;
`;
