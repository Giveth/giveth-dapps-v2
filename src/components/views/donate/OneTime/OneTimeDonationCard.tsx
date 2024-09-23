import styled from 'styled-components';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	B,
	brandColors,
	Button,
	Flex,
	IconCaretDown16,
	IconRefresh16,
	IconWalletOutline24,
	neutralColors,
	OutlineButton,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
// @ts-ignore
import { Address, Chain, formatUnits, zeroAddress } from 'viem';
import { useBalance, useEstimateFeesPerGas, useEstimateGas } from 'wagmi';
import { ethers } from 'ethers';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';

import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import config from '@/configuration';

import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { truncateToDecimalPlaces } from '@/lib/helpers';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import {
	calcDonationShare,
	prepareTokenList,
} from '@/components/views/donate/common/helpers';
import { DonateWrongNetwork } from '@/components/modals/DonateWrongNetwork';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import DonateToGiveth from '@/components/views/donate/DonateToGiveth';
import SaveGasFees from './SaveGasFees';
import SwitchToAcceptedChain from '@/components/views/donate/SwitchToAcceptedChain';
import { useDonateData } from '@/context/donate.context';
import { useModalCallback } from '@/hooks/useModalCallback';
import { getActiveRound } from '@/helpers/qf';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';
import { INetworkIdWithChain } from '../common/common.types';
import DonateModal from './DonateModal';
import QFModal from './QFModal';
import EstimatedMatchingToast from '@/components/views/donate/OneTime/EstimatedMatchingToast';
import TotalDonation from './TotalDonation';
import {
	BadgesBase,
	ForEstimatedMatchingAnimation,
	GLinkStyled,
	IconWrapper,
	Input,
	InputWrapper,
	SelectTokenPlaceHolder,
	SelectTokenWrapper,
} from '../common/common.styled';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { SelectTokenModal } from './SelectTokenModal/SelectTokenModal';
import { Spinner } from '@/components/Spinner';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';
import { isWalletSanctioned } from '@/services/donation';
import SanctionModal from '@/components/modals/SanctionedModal';
import { useTokenPrice } from '@/hooks/useTokenPrice';
import EligibilityBadges from '@/components/views/donate/common/EligibilityBadges';
import DonateAnonymously from '@/components/views/donate/common/DonateAnonymously';

const CryptoDonation: FC<{
	acceptedTokens: IProjectAcceptedToken[] | undefined;
}> = ({ acceptedTokens }) => {
	const {
		chain,
		walletChainType,
		walletAddress: address,
		isConnected,
	} = useGeneralWallet();

	const { formatMessage } = useIntl();
	const { isSignedIn } = useAppSelector(state => state.user);

	const { project, hasActiveQFRound, selectedOneTimeToken } = useDonateData();
	const dispatch = useAppDispatch();

	const {
		verified,
		id: projectId,
		status,
		addresses,
		title: projectTitle,
	} = project;

	const isActive = status?.name === EProjectStatus.ACTIVE;
	const noDonationSplit = Number(projectId!) === config.GIVETH_PROJECT_ID;
	const [amount, setAmount] = useState(0n);
	const [erc20List, setErc20List] = useState<IProjectAcceptedToken[]>();
	const [anonymous, setAnonymous] = useState<boolean>(false);
	const [insufficientGasFee, setInsufficientGasFee] =
		useState<boolean>(false);
	const [showDonateModal, setShowDonateModal] = useState(false);
	const [showInsufficientModal, setShowInsufficientModal] = useState(false);
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [isSanctioned, setIsSanctioned] = useState<boolean>(false);
	const [acceptedChains, setAcceptedChains] = useState<INetworkIdWithChain[]>(
		[],
	);
	const [donationToGiveth, setDonationToGiveth] = useState(
		noDonationSplit ? 0 : 5,
	);
	const [showQFModal, setShowQFModal] = useState(false);
	const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);

	const { modalCallback: signInThenDonate } = useModalCallback(() =>
		setShowDonateModal(true),
	);

	const {
		data: evmBalance,
		refetch: evmRefetch,
		isRefetching: evmIsRefetching,
	} = useBalance({
		token:
			selectedOneTimeToken?.address === zeroAddress
				? undefined
				: selectedOneTimeToken?.address,
		address:
			walletChainType === ChainType.EVM && !!selectedOneTimeToken?.address // disable when selected token is undefined
				? (address as Address)
				: undefined,
	});

	const {
		data: solanaBalance,
		refetch: solanaRefetch,
		isRefetching: solanaIsRefetching,
	} = useSolanaBalance({
		token: selectedOneTimeToken?.address,
		address:
			walletChainType === ChainType.SOLANA
				? address || undefined
				: undefined,
	});

	const tokenDecimals = selectedOneTimeToken?.decimals || 18;
	const { activeStartedRound } = getActiveRound(project.qfRounds);
	const networkId = (chain as Chain)?.id;

	const isOnQFEligibleNetworks =
		networkId && activeStartedRound?.eligibleNetworks?.includes(networkId);

	const tokenPrice = useTokenPrice(selectedOneTimeToken);

	useEffect(() => {
		validateSanctions();
	}, [project, address]);

	useEffect(() => {
		if (
			(networkId ||
				(walletChainType && walletChainType !== ChainType.EVM)) &&
			acceptedTokens
		) {
			const acceptedEvmTokensNetworkIds = new Set<Number>();
			const acceptedNonEvmTokenChainTypes = new Set<ChainType>();

			acceptedTokens.forEach(t => {
				if (
					t.chainType === ChainType.EVM ||
					t.chainType === undefined
				) {
					acceptedEvmTokensNetworkIds.add(t.networkId);
				} else {
					acceptedNonEvmTokenChainTypes.add(t.chainType);
				}
			});

			const addressesChainTypes = new Set(
				addresses?.map(({ chainType }) => chainType),
			);

			const filteredTokens = acceptedTokens.filter(token => {
				switch (walletChainType) {
					case ChainType.EVM:
						return (
							token.networkId === networkId &&
							addresses?.some(
								token =>
									token.networkId === networkId &&
									token.chainType === walletChainType,
							)
						);
					case ChainType.SOLANA:
						return (
							addressesChainTypes.has(ChainType.SOLANA) &&
							token.chainType === walletChainType &&
							token.networkId === config.SOLANA_CONFIG.networkId
						);
					default:
						return false;
				}
			});
			const acceptedChainsWithChainTypeAndNetworkId: INetworkIdWithChain[] =
				[];
			addresses?.forEach(a => {
				if (
					a.chainType === undefined ||
					a.chainType === ChainType.EVM
				) {
					if (acceptedEvmTokensNetworkIds.has(a.networkId!)) {
						acceptedChainsWithChainTypeAndNetworkId.push({
							networkId: a.networkId!,
							chainType: ChainType.EVM,
						});
					}
				} else if (acceptedNonEvmTokenChainTypes.has(a.chainType)) {
					acceptedChainsWithChainTypeAndNetworkId.push({
						networkId: a.networkId!,
						chainType: a.chainType!,
					});
				}
			});

			setAcceptedChains(acceptedChainsWithChainTypeAndNetworkId);
			if (filteredTokens.length < 1) {
				setShowChangeNetworkModal(true);
			}
			const tokens = prepareTokenList(filteredTokens);
			setErc20List(tokens);
		}
	}, [networkId, acceptedTokens, walletChainType, addresses]);

	useEffect(() => {
		setAmount(0n);
	}, [selectedOneTimeToken, isConnected, address, networkId]);

	const selectedTokenBalance =
		(walletChainType == ChainType.EVM
			? evmBalance?.value
			: solanaBalance) || 0n;
	const refetch =
		walletChainType === ChainType.EVM ? evmRefetch : solanaRefetch;
	const isRefetching =
		walletChainType === ChainType.EVM
			? evmIsRefetching
			: solanaIsRefetching;

	const handleDonate = () => {
		if (amount > selectedTokenBalance) {
			return setShowInsufficientModal(true);
		}
		if (
			hasActiveQFRound &&
			!isOnQFEligibleNetworks &&
			selectedOneTimeToken?.chainType === ChainType.EVM
		) {
			setShowQFModal(true);
		} else if (!isSignedIn) {
			signInThenDonate();
		} else {
			setShowDonateModal(true);
		}
	};

	const donationDisabled =
		!isActive || !amount || !selectedOneTimeToken || insufficientGasFee;

	const donateWithoutMatching = () => {
		if (isSignedIn) {
			setShowDonateModal(true);
		} else {
			signInThenDonate();
		}
	};

	const estimatedGasFeeObj = useMemo(() => {
		const selectedChain = chain as Chain;
		return {
			chainId: selectedChain?.id,
			to: addresses?.find(a => a.chainType === walletChainType)
				?.address as Address,
			value: selectedTokenBalance,
		};
	}, [chain, addresses, selectedTokenBalance, walletChainType]);

	const { data: estimatedGas } = useEstimateGas(estimatedGasFeeObj);
	const { data: estimatedGasPrice } =
		useEstimateFeesPerGas(estimatedGasFeeObj);

	const gasFee = useMemo((): bigint => {
		if (
			selectedOneTimeToken?.address !== zeroAddress ||
			!estimatedGas ||
			!estimatedGasPrice?.maxFeePerGas
		) {
			return 0n;
		}
		return estimatedGas * estimatedGasPrice.maxFeePerGas;
	}, [
		estimatedGas,
		estimatedGasPrice?.maxFeePerGas,
		selectedOneTimeToken?.address,
	]);

	useEffect(() => {
		if (
			amount > selectedTokenBalance - gasFee &&
			amount < selectedTokenBalance &&
			selectedOneTimeToken?.address === zeroAddress &&
			gasFee > 0n
		) {
			setInsufficientGasFee(true);
		} else {
			setInsufficientGasFee(false);
		}
	}, [selectedTokenBalance, amount, selectedOneTimeToken?.address, gasFee]);

	const validateSanctions = async () => {
		if (project?.organization?.label === 'endaoment' && address) {
			// We just need to check if the wallet is sanctioned for endaoment projects
			const sanctioned = await isWalletSanctioned(address);
			if (sanctioned) {
				setIsSanctioned(true);
				return;
			}
		}
	};

	const amountErrorText = useMemo(() => {
		const totalAmount = Number(formatUnits(gasFee, tokenDecimals)).toFixed(
			10,
		);
		const tokenSymbol = selectedOneTimeToken?.symbol;
		return formatMessage(
			{ id: 'label.exceed_wallet_balance' },
			{
				totalAmount,
				tokenSymbol,
			},
		);
	}, [gasFee, tokenDecimals, selectedOneTimeToken?.symbol, formatMessage]);

	// We need givethDonationAmount here because we need to calculate the donation share
	// for Giveth. If user want to donate minimal amount to projecct, the donation share for Giveth
	// has to be 0, disabled in UI and DonationModal
	const {
		givethDonation: givethDonationAmount,
		projectDonation: projectDonationAmount,
	} = calcDonationShare(
		amount,
		donationToGiveth,
		selectedOneTimeToken?.decimals ?? 18,
	);

	const isProjectGivbacksEligible = !!verified;
	const donationUsdValue =
		(tokenPrice || 0) * Number(ethers.utils.formatEther(amount));
	const isDonationMatched =
		!!activeStartedRound &&
		isOnQFEligibleNetworks &&
		donationUsdValue >= (activeStartedRound?.minimumValidUsdValue || 0);
	const showEstimatedMatching =
		hasActiveQFRound &&
		!!isOnQFEligibleNetworks &&
		!!selectedTokenBalance &&
		!!isDonationMatched;

	return (
		<MainContainer>
			{isSanctioned && (
				<SanctionModal
					closeModal={() => {
						setIsSanctioned(false);
					}}
				/>
			)}
			{showQFModal && (
				<QFModal
					donateWithoutMatching={donateWithoutMatching}
					setShowModal={setShowQFModal}
				/>
			)}
			{!isSanctioned && showChangeNetworkModal && acceptedChains && (
				<DonateWrongNetwork
					setShowModal={setShowChangeNetworkModal}
					acceptedChains={acceptedChains.filter(
						chain => chain.chainType !== ChainType.STELLAR,
					)}
				/>
			)}
			{showInsufficientModal && (
				<InsufficientFundModal
					setShowModal={setShowInsufficientModal}
				/>
			)}
			{showDonateModal && selectedOneTimeToken && amount && (
				<DonateModal
					setShowModal={setShowDonateModal}
					token={selectedOneTimeToken}
					amount={amount}
					donationToGiveth={donationToGiveth}
					givethDonationAmount={givethDonationAmount}
					anonymous={anonymous}
					givBackEligible={
						isProjectGivbacksEligible &&
						selectedOneTimeToken.isGivbackEligible &&
						tokenPrice !== undefined &&
						tokenPrice * projectDonationAmount >= 4
					}
				/>
			)}
			{walletChainType && (
				<SwitchToAcceptedChain
					acceptedChains={acceptedChains}
					setShowChangeNetworkModal={setShowChangeNetworkModal}
				/>
			)}
			<SaveGasFees acceptedChains={acceptedChains} />
			{!isConnected && (
				<ConnectWallet>
					<IconWalletOutline24 color={neutralColors.gray[700]} />
					{formatMessage({
						id: 'label.please_connect_your_wallet',
					})}
				</ConnectWallet>
			)}
			<EligibilityBadges
				token={selectedOneTimeToken}
				amount={amount}
				tokenPrice={tokenPrice}
				style={{ margin: '12px 0 24px' }}
			/>
			<EstimatedMatchingToast
				projectData={project}
				token={selectedOneTimeToken}
				amount={amount}
				tokenPrice={tokenPrice}
				show={showEstimatedMatching}
			/>
			<ForEstimatedMatchingAnimation
				showEstimatedMatching={showEstimatedMatching}
			>
				<FlexStyled
					$flexDirection='column'
					gap='8px'
					disabled={!isConnected}
				>
					<InputWrapper>
						<SelectTokenWrapper
							$alignItems='center'
							$justifyContent='space-between'
							onClick={() =>
								isConnected && setShowSelectTokenModal(true)
							}
							disabled={!isConnected}
							style={{
								color:
									selectedOneTimeToken || !isConnected
										? 'inherit'
										: brandColors.giv[500],
							}}
						>
							{selectedOneTimeToken ? (
								<Flex gap='8px' $alignItems='center'>
									<TokenIcon
										symbol={selectedOneTimeToken.symbol}
										size={24}
									/>
									<TokenSymbol>
										{selectedOneTimeToken.symbol}
									</TokenSymbol>
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
						<Input
							amount={amount}
							setAmount={setAmount}
							disabled={selectedOneTimeToken === undefined}
							decimals={selectedOneTimeToken?.decimals}
						/>
						<DonationPrice
							disabled={!selectedOneTimeToken || !isConnected}
						>
							{'$ ' + donationUsdValue.toFixed(2)}
						</DonationPrice>
					</InputWrapper>
					{selectedOneTimeToken ? (
						<FlexStyled
							gap='4px'
							$alignItems='center'
							disabled={!selectedOneTimeToken}
						>
							<GLinkStyled
								size='Small'
								onClick={() =>
									setAmount(selectedTokenBalance - gasFee)
								}
							>
								{formatMessage({
									id: 'label.available',
								})}
								:{' '}
								{selectedOneTimeToken
									? truncateToDecimalPlaces(
											formatUnits(
												selectedTokenBalance,
												tokenDecimals,
											),
											tokenDecimals / 3,
										)
									: 0.0}
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
							{insufficientGasFee && (
								<WarnError>{amountErrorText}</WarnError>
							)}
						</FlexStyled>
					) : (
						<div style={{ height: '21.5px' }} />
					)}
				</FlexStyled>
				{!noDonationSplit ? (
					<DonateToGiveth
						setDonationToGiveth={setDonationToGiveth}
						donationToGiveth={donationToGiveth}
						title={
							formatMessage({ id: 'label.donate_to' }) + ' Giveth'
						}
						disabled={!selectedOneTimeToken || !isConnected}
					/>
				) : (
					<br />
				)}
				{!noDonationSplit ? (
					<TotalDonation
						donationToGiveth={donationToGiveth}
						totalDonation={amount}
						projectTitle={projectTitle}
						token={selectedOneTimeToken}
						isActive={!donationDisabled}
					/>
				) : (
					<EmptySpace />
				)}
				{!isActive && (
					<InlineToast
						type={EToastType.Warning}
						message={formatMessage({
							id: 'label.this_project_is_not_active',
						})}
					/>
				)}
				{isConnected &&
					(donationDisabled ? (
						<OutlineButtonStyled
							label={formatMessage({ id: 'label.donate' })}
							disabled
							size='medium'
						/>
					) : (
						<MainButton
							id='Donate_Final'
							label={formatMessage({ id: 'label.donate' })}
							size='medium'
							onClick={handleDonate}
						/>
					))}
				{!isConnected && (
					<MainButton
						label={formatMessage({
							id: 'component.button.connect_wallet',
						})}
						onClick={() => dispatch(setShowWelcomeModal(true))}
					/>
				)}
				<DonateAnonymously
					anonymous={anonymous}
					setAnonymous={setAnonymous}
					selectedToken={selectedOneTimeToken}
				/>
				{showSelectTokenModal && (
					<SelectTokenModal
						setShowModal={setShowSelectTokenModal}
						tokens={erc20List}
						acceptCustomToken={
							project.organization?.supportCustomTokens
						}
					/>
				)}
			</ForEstimatedMatchingAnimation>
		</MainContainer>
	);
};

const OutlineButtonStyled = styled(OutlineButton)`
	width: 100%;
`;

const DonationPrice = styled(SublineBold)<{ disabled?: boolean }>`
	position: absolute;
	right: 16px;
	border-radius: 4px;
	background: ${neutralColors.gray[300]};
	padding: 2px 8px !important;
	margin: 16px 0px;
	color: ${neutralColors.gray[700]} !important;
	opacity: ${props => (props.disabled ? 0.4 : 1)};
	height: 22px;
`;

const FlexStyled = styled(Flex)<{ disabled: boolean }>`
	border-radius: 8px;
	background-color: white;
	${props =>
		props.disabled &&
		`
		opacity: 0.5;
		pointer-events: none;
	`}
`;

const ConnectWallet = styled(BadgesBase)`
	margin: 12px 0 24px;
`;

const WarnError = styled.div`
	color: ${semanticColors.punch[500]};
	font-size: 11px;
	padding: 12px;
`;

const EmptySpace = styled.div`
	margin-top: 70px;
`;

const MainContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 60%;
	justify-content: space-between;
	text-align: left;
`;

const TokenSymbol = styled(B)`
	white-space: nowrap;
`;

const MainButton = styled(Button)`
	width: 100%;
	background-color: ${props =>
		props.disabled ? brandColors.giv[200] : brandColors.giv[500]};
	color: white;
	text-transform: uppercase;
`;

export default CryptoDonation;
