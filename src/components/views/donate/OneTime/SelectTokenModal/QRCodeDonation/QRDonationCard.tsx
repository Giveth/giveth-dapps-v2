import React, { FC, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
	B,
	P,
	Flex,
	brandColors,
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
import { captureException } from '@sentry/nextjs';

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
import {
	clearStoredDraftDonationId,
	getStoredDraftDonationId,
	useQRCodeDonation,
} from '@/hooks/useQRCodeDonation';
import { useDonateData } from '@/context/donate.context';
import { AmountInput } from '@/components/AmountInput/AmountInput';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { shouldShowGivbacksSignInPrompt } from '@/helpers/qf';
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
	const dispatch = useAppDispatch();

	const {
		project,
		selectedQFRound,
		setQRDonationStatus,
		setDraftDonationData,
		fetchDraftDonation,
		qrDonationStatus,
		draftDonationData,
		draftDonationLoading,
	} = useDonateData();
	const {
		createDraftDonation,
		markDraftDonationAsFailed,
		checkDraftDonationStatus,
		retrieveDraftDonation,
		renewExpirationDate,
	} = useQRCodeDonation(project);

	const { addresses, id, isGivbackEligible } = project;
	const draftDonationId = Number(router.query.draft_donation!);
	const [amount, setAmount] = useState(0n);
	const [usdAmount, setUsdAmount] = useState(0);
	const [tokenPrice, setTokenPrice] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const isSubmittingRef = useRef(false);

	const stellarToken = qrAcceptedTokens.find(
		token => token.chainType === ChainType.STELLAR,
	);
	const projectAddress = addresses?.find(
		address => address.chainType === ChainType.STELLAR,
	);

	const isOnEligibleNetworks = selectedQFRound?.eligibleNetworks?.includes(
		config.STELLAR_NETWORK_NUMBER,
	);
	const isProjectGivbacksEligible = !!isGivbackEligible;
	const isTokenGivbacksEligible = !!stellarToken?.isGivbackEligible;

	// Stellar QR donations are matched without connecting a wallet — matching is
	// surfaced by EligibilityBadges / the estimated matching UI. The only action
	// worth prompting here is signing in for GIVbacks. This shared predicate is
	// the single source of truth: EligibilityBadges renders in the complementary
	// case, so the prompt and the badges never overlap or leave a gap.
	const showGivbacksSignInPrompt = shouldShowGivbacksSignInPrompt({
		isProjectGivbacksEligible,
		isTokenGivbacksEligible,
		isSignedIn,
		isEnabled,
	});
	// Signing in requires a wallet, so only offer the optional click-through when
	// one is connected. A wallet-less donor reads the prompt as guidance and can
	// use the header Sign In. Ignoring either path never blocks QR generation.
	const canSignIn = isEnabled && !isSignedIn;
	const openSignIn = () => dispatch(setShowSignWithWallet(true));
	const handleSignInKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openSignIn();
		}
	};

	const donationUsdValue =
		(tokenPrice || 0) * Number(ethers.utils.formatEther(amount));
	const isDonationMatched =
		!!selectedQFRound &&
		isOnEligibleNetworks &&
		donationUsdValue >= (selectedQFRound?.minimumValidUsdValue || 0);

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
		if (isSubmittingRef.current) return;
		isSubmittingRef.current = true;
		setIsSubmitting(true);

		try {
			const projectAddress = project.addresses?.find(
				address => address.chainType === ChainType.STELLAR,
			);
			if (!stellarToken?.symbol || !projectAddress?.address) return;

			const projectId = Number(id);
			const requestedAmount = Number(formatAmountToDisplay(amount));
			let draftDonationId = getStoredDraftDonationId(
				projectId,
				projectAddress.address,
			);
			let retDraftDonation;

			if (draftDonationId) {
				try {
					retDraftDonation = await retrieveDraftDonation(
						draftDonationId,
						{
							throwOnError: true,
						},
					);
				} catch {
					showToastError(
						formatMessage({
							id: 'label.unable_to_check_pending_donation',
						}),
					);
					return;
				}

				if (retDraftDonation === null) {
					clearStoredDraftDonationId(
						projectId,
						projectAddress.address,
					);
					draftDonationId = undefined;
				}
			}

			const belongsToCurrentProject =
				retDraftDonation?.projectId === projectId;
			const isPending = retDraftDonation?.status === 'pending';
			const expiresAt = retDraftDonation?.expiresAt
				? new Date(retDraftDonation.expiresAt).getTime()
				: undefined;
			const isExpired =
				expiresAt !== undefined &&
				(!Number.isFinite(expiresAt) || expiresAt <= Date.now());
			// The stored amount round-trips through the API as a float, so compare
			// with a tolerance far below the 6-decimal granularity the amount input
			// exposes — tight enough that two distinct amounts never collide.
			const amountMatches =
				Math.abs(Number(retDraftDonation?.amount) - requestedAmount) <
				1e-9;
			// Stellar addresses can be shared across projects. Reuse a stored draft
			// only when it represents exactly the donation the donor just confirmed.
			const canReuseDraft =
				belongsToCurrentProject &&
				isPending &&
				!isExpired &&
				amountMatches;

			if (canReuseDraft && retDraftDonation) {
				const renewedExpirationDate = await renewExpirationDate(
					retDraftDonation.id,
				);
				setDraftDonationData({
					...retDraftDonation,
					expiresAt:
						renewedExpirationDate ?? retDraftDonation.expiresAt,
				});
				setQRDonationStatus('waiting');
			} else {
				if (belongsToCurrentProject && isPending && draftDonationId) {
					let verifiedDraftDonation;
					try {
						verifiedDraftDonation =
							await checkDraftDonationStatus(draftDonationId);
					} catch (error) {
						console.error(
							'Error verifying draft donation status',
							error,
						);
						captureException(error, {
							tags: {
								section: 'QRDonationCard handleNext verify',
							},
						});
						showToastError(
							formatMessage({
								id: 'label.unable_to_check_pending_donation',
							}),
						);
						return;
					}

					if (verifiedDraftDonation?.status === 'matched') {
						setQRDonationStatus('success');
						setDraftDonationData(verifiedDraftDonation);
						return;
					}

					await markDraftDonationAsFailed(draftDonationId);
				}

				try {
					const payload = {
						walletAddress: projectAddress.address,
						projectId,
						amount: requestedAmount,
						token: stellarToken,
						anonymous: !(isSignedIn && isEnabled),
						symbol: stellarToken.symbol,
						setFailedModalType: () => {},
						useDonationBox: false,
						chainId: stellarToken?.networkId,
						memo: projectAddress.memo,
						qfRoundId: Number(selectedQFRound?.id) || undefined,
					};

					draftDonationId = await createDraftDonation(payload);
				} catch (error) {
					showToastError(error);
					return;
				}
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
		} catch (error) {
			console.error('Error preparing QR donation', error);
			captureException(error, {
				tags: {
					section: 'QRDonationCard handleNext',
				},
			});
			showToastError(
				formatMessage({
					id: 'label.something_went_wrong',
				}),
			);
		} finally {
			isSubmittingRef.current = false;
			setIsSubmitting(false);
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

	// Stellar QR donations don't connect an EVM/Solana wallet, so `chain` is
	// always undefined here. The estimated matching is computed purely from
	// project data + amount, so show it regardless of wallet/sign-in state.
	const showEstimatedMatching =
		!showQRCode &&
		selectedQFRound &&
		!!selectedQFRound?.eligibleNetworks?.includes(
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
			{!showQRCode && showGivbacksSignInPrompt && (
				<ConnectWallet
					$clickable={canSignIn}
					role={canSignIn ? 'button' : undefined}
					tabIndex={canSignIn ? 0 : undefined}
					onClick={canSignIn ? openSignIn : undefined}
					onKeyDown={canSignIn ? handleSignInKeyDown : undefined}
				>
					<IconWalletOutline24 color={neutralColors.gray[700]} />
					{formatMessage({
						id: 'label.sign_into_giveth_for_a_chance_to_win_givbacks',
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
									loading={isSubmitting}
									disabled={isSubmitting}
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

const ConnectWallet = styled(BadgesBase)<{ $clickable?: boolean }>`
	margin-bottom: 5px;
	cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

	&:focus-visible {
		outline: 2px solid ${brandColors.giv[500]};
		outline-offset: 2px;
	}
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
