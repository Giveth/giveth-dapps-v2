import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
	B,
	P,
	Flex,
	neutralColors,
	IconArrowLeft,
	mediaQueries,
	IconWalletOutline24,
	OutlineButton,
	IconArrowRight16,
	Button,
	SublineBold,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { formatUnits } from 'viem';

import { ethers } from 'ethers';
import {
	InputWrapper,
	SelectTokenWrapper,
	BadgesBase,
	ForEstimatedMatchingAnimation,
} from '../../../common/common.styled';
import { TokenIconWithGIVBack } from '../../../TokenIcon/TokenIconWithGIVBack';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { fetchPriceWithCoingeckoId } from '@/services/token';
import { ChainType } from '@/types/config';
import config from '@/configuration';
import {
	truncateToDecimalPlaces,
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
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import EligibilityBadges from '@/components/views/donate/common/EligibilityBadges';
import EstimatedMatchingToast from '../../EstimatedMatchingToast';

interface QRDonationCardProps extends IDonationCardProps {
	qrAcceptedTokens: IProjectAcceptedToken[];
	setIsQRDonation: (isQRDonation: boolean) => void;
}

const decimals = 18;
const formatAmountToDisplay = (amount: bigint) => {
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
	const [_showDonateModal, setShowDonateModal] = useState(false);
	const { modalCallback: signInThenDonate } = useModalCallback(() =>
		setShowDonateModal(true),
	);
	const { isConnected, chain } = useGeneralWallet();

	const {
		project,
		hasActiveQFRound,
		activeStartedRound,
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

	const { addresses, id, isGivbackEligible } = project;
	const draftDonationId = Number(router.query.draft_donation!);
	const [amount, setAmount] = useState(0n);
	const [usdAmount, setUsdAmount] = useState(0);
	const [tokenPrice, setTokenPrice] = useState(0);

	const stellarToken = qrAcceptedTokens.find(
		token => token.chainType === ChainType.STELLAR,
	);
	const projectAddress = addresses?.find(
		address => address.chainType === ChainType.STELLAR,
	);

	const isOnEligibleNetworks = activeStartedRound?.eligibleNetworks?.includes(
		config.STELLAR_NETWORK_NUMBER,
	);
	const isProjectGivbacksEligible = !!isGivbackEligible;
	const isInQF = !!isOnEligibleNetworks;
	const showConnectWallet = isProjectGivbacksEligible || isInQF;

	const textToDisplayOnConnect = () => {
		const onlyInQF =
			activeStartedRound?.eligibleNetworks?.length === 1 &&
			activeStartedRound?.eligibleNetworks[0] ===
				config.STELLAR_NETWORK_NUMBER;

		if (isProjectGivbacksEligible && onlyInQF) {
			return 'label.sign_into_giveth_for_a_chance_to_win_givbacks';
		}

		if (isProjectGivbacksEligible && isInQF && !!activeStartedRound) {
			return 'label.please_connect_your_wallet_to_win_givbacks_and_match';
		}

		if (isProjectGivbacksEligible) {
			return 'label.sign_into_giveth_for_a_chance_to_win_givbacks';
		}

		if (!onlyInQF) {
			return 'label.please_connect_your_wallet_to_match';
		}

		return null;
	};

	const donationUsdValue =
		(tokenPrice || 0) * Number(ethers.utils.formatEther(amount));
	const isDonationMatched =
		!!activeStartedRound &&
		isOnEligibleNetworks &&
		donationUsdValue >= (activeStartedRound?.minimumValidUsdValue || 0);

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

	const calculateUsdAmount = (amount?: number) => {
		if (!tokenPrice || !amount) return '0.00';

		return formatBalance(amount * tokenPrice);
	};

	useEffect(() => {
		const donationUsdValue =
			(tokenPrice || 0) *
			(truncateToDecimalPlaces(formatUnits(amount, decimals), decimals) ||
				0);
		setUsdAmount(donationUsdValue);
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

	const showEstimatedMatching =
		!showQRCode &&
		!!chain &&
		hasActiveQFRound &&
		!!activeStartedRound?.eligibleNetworks?.includes(
			config.NON_EVM_NETWORKS_CONFIG[ChainType.STELLAR].networkId,
		) &&
		isDonationMatched &&
		!!amount;

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
			{!showQRCode &&
				!isConnected &&
				showConnectWallet &&
				textToDisplayOnConnect() && (
					<ConnectWallet>
						<IconWalletOutline24 color={neutralColors.gray[700]} />
						{formatMessage({
							id: textToDisplayOnConnect() || '',
						})}
					</ConnectWallet>
				)}
			{!showQRCode && (
				<EligibilityBadges
					amount={amount}
					token={stellarToken}
					tokenPrice={tokenPrice}
					style={{ marginBottom: '5px' }}
				/>
			)}
			<div>
				{!showQRCode && (
					<EstimatedMatchingToast
						projectData={project}
						token={stellarToken}
						amount={amount}
						tokenPrice={tokenPrice}
						show={showEstimatedMatching}
						isStellar
					/>
				)}
				{!showQRCode ? (
					<ForEstimatedMatchingAnimation
						showEstimatedMatching={showEstimatedMatching}
					>
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
								<UsdAmountCard>
									$ {usdAmount.toFixed(2)}
								</UsdAmountCard>
							</QRDonationInput>
						</StyledInputWrapper>
						<CardBottom>
							<FlexStyled
								$justifyContent='space-between'
								$color={neutralColors.gray[100]}
							>
								<P>
									{formatMessage({ id: 'label.donating_to' })}{' '}
									<strong
										style={{ textTransform: 'capitalize' }}
									>
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
							{amount === 0n ? (
								<OutlineButton
									label='Next'
									color='primary'
									icon={<IconArrowRight16 />}
									disabled
								/>
							) : (
								<Button
									label='Next'
									color='primary'
									icon={<IconArrowRight16 />}
									onClick={handleNext}
								/>
							)}
						</CardBottom>
					</ForEstimatedMatchingAnimation>
				) : (
					<QRDonationCardContent
						tokenData={stellarToken}
						usdAmount={calculateUsdAmount(
							draftDonationData?.amount,
						)}
						amount={draftDonationData?.amount?.toString() ?? '0.00'}
						qrDonationStatus={qrDonationStatus}
						draftDonationData={draftDonationData}
						projectAddress={projectAddress}
						draftDonationLoading={draftDonationLoading}
					/>
				)}
			</div>
		</>
	);
};

const ConnectWallet = styled(BadgesBase)`
	margin-bottom: 5px;
`;

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

export const UsdAmountCard = styled(SublineBold)`
	padding: 2px 8px;
	white-space: nowrap;
	background: ${neutralColors.gray[300]};
	border-radius: 4px;
	color: ${neutralColors.gray[700]} !important;
	display: flex;
	align-items: center;
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
	padding-right: 8px;
	${mediaQueries.tablet} {
		border-left: 2px solid ${neutralColors.gray[300]};
		border-top: none;
	}
`;

const StyledInputWrapper = styled(InputWrapper)`
	flex-direction: column;
	background-color: white;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const MarginLessInlineToast = styled(InlineToast)`
	margin: 0;
`;
