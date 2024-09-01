import styled from 'styled-components';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import {
	B,
	brandColors,
	Button,
	Flex,
	IconCaretDown16,
	IconRefresh16,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
// @ts-ignore
import { Address, Chain, formatUnits, zeroAddress } from 'viem';
import { useBalance, useEstimateFeesPerGas, useEstimateGas } from 'wagmi';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import CheckBox from '@/components/Checkbox';

import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import config from '@/configuration';

import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { truncateToDecimalPlaces } from '@/lib/helpers';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import {
	calcDonationShare,
	prepareTokenList,
} from '@/components/views/donate/helpers';
import GIVBackToast from '@/components/views/donate/GIVBackToast';
import { DonateWrongNetwork } from '@/components/modals/DonateWrongNetwork';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import DonateToGiveth from '@/components/views/donate/DonateToGiveth';
import SaveGasFees from './SaveGasFees';
import SwitchToAcceptedChain from '@/components/views/donate/SwitchToAcceptedChain';
import { useDonateData } from '@/context/donate.context';
import { useModalCallback } from '@/hooks/useModalCallback';
import DonateQFEligibleNetworks from './DonateQFEligibleNetworks';
import { getActiveRound } from '@/helpers/qf';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';
import { INetworkIdWithChain } from '../common.types';
import DonateModal from './DonateModal';
import QFModal from './QFModal';
import EstimatedMatchingToast from '@/components/views/donate/OnTime/EstimatedMatchingToast';
import TotalDonation from './TotalDonation';
import {
	GLinkStyled,
	IconWrapper,
	Input,
	InputWrapper,
	SelectTokenPlaceHolder,
	SelectTokenWrapper,
} from '../Recurring/RecurringDonationCard';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { SelectTokenModal } from './SelectTokenModal/SelectTokenModal';
import { Spinner } from '@/components/Spinner';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';

const CryptoDonation: FC<{
	setIsQRDonation: (isQRDonation: boolean) => void;
	acceptedTokens: IProjectAcceptedToken[] | undefined;
}> = ({ acceptedTokens, setIsQRDonation }) => {
	const {
		chain,
		walletChainType,
		walletAddress: address,
		isConnected,
	} = useGeneralWallet();

	const { formatMessage } = useIntl();
	const router = useRouter();
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
	const projectIsGivBackEligible = !!verified;
	const { activeStartedRound } = getActiveRound(project.qfRounds);
	const networkId = (chain as Chain)?.id;

	const isOnEligibleNetworks =
		networkId && activeStartedRound?.eligibleNetworks?.includes(networkId);
	const hasStellarAddress = addresses?.some(
		address => address.chainType === ChainType.STELLAR,
	);

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
			const acceptedChainsWithChaintypeAndNetworkId: INetworkIdWithChain[] =
				[];
			addresses?.forEach(a => {
				if (
					a.chainType === undefined ||
					a.chainType === ChainType.EVM
				) {
					if (acceptedEvmTokensNetworkIds.has(a.networkId!)) {
						acceptedChainsWithChaintypeAndNetworkId.push({
							networkId: a.networkId!,
							chainType: ChainType.EVM,
						});
					}
				} else if (acceptedNonEvmTokenChainTypes.has(a.chainType)) {
					acceptedChainsWithChaintypeAndNetworkId.push({
						networkId: a.networkId!,
						chainType: a.chainType!,
					});
				}
			});

			setAcceptedChains(acceptedChainsWithChaintypeAndNetworkId);
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
			!isOnEligibleNetworks &&
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

	const gasfee = useMemo(() => {
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

	const handleQRDonation = () => {
		setIsQRDonation(true);
		router.push(
			{
				query: {
					...router.query,
					chain: ChainType.STELLAR.toLowerCase(),
				},
			},
			undefined,
			{ shallow: true },
		);
	};

	useEffect(() => {
		if (
			amount > selectedTokenBalance - gasfee &&
			amount < selectedTokenBalance &&
			selectedOneTimeToken?.address === zeroAddress &&
			gasfee > 0n
		) {
			setInsufficientGasFee(true);
		} else {
			setInsufficientGasFee(false);
		}
	}, [selectedTokenBalance, amount, selectedOneTimeToken?.address, gasfee]);

	const amountErrorText = useMemo(() => {
		const totalAmount = Number(formatUnits(gasfee, tokenDecimals)).toFixed(
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
	}, [gasfee, tokenDecimals, selectedOneTimeToken?.symbol, formatMessage]);

	// We need givethDonationAmount here because we need to calculate the donation share
	// for Giveth. If user want to donate minimal amount to projecct, the donation share for Giveth
	// has to be 0, disabled in UI and DonationModal
	const { givethDonation: givethDonationAmount } = calcDonationShare(
		amount,
		donationToGiveth,
		selectedOneTimeToken?.decimals ?? 18,
	);

	return (
		<MainContainer>
			{showQFModal && (
				<QFModal
					donateWithoutMatching={donateWithoutMatching}
					setShowModal={setShowQFModal}
				/>
			)}
			{showChangeNetworkModal && acceptedChains && (
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
						projectIsGivBackEligible &&
						selectedOneTimeToken.isGivbackEligible
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
			{hasStellarAddress && (
				<QRToastLink onClick={handleQRDonation}>
					{config.NETWORKS_CONFIG[ChainType.STELLAR]?.chainLogo(32)}
					{formatMessage({
						id: 'label.try_donating_wuth_stellar',
					})}
				</QRToastLink>
			)}
			<Flex $flexDirection='column' gap='8px'>
				<InputWrapper>
					<SelectTokenWrapper
						$alignItems='center'
						$justifyContent='space-between'
						onClick={() => setShowSelectTokenModal(true)}
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
				</InputWrapper>
				<Flex gap='4px' $alignItems='center'>
					<GLinkStyled
						size='Small'
						onClick={() => setAmount(selectedTokenBalance - gasfee)}
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
					<IconWrapper onClick={() => !isRefetching && refetch()}>
						{isRefetching ? (
							<Spinner size={16} />
						) : (
							<IconRefresh16 />
						)}
					</IconWrapper>
					{insufficientGasFee && (
						<WarnError>{amountErrorText}</WarnError>
					)}
				</Flex>
			</Flex>
			{hasActiveQFRound && !isOnEligibleNetworks && walletChainType && (
				<DonateQFEligibleNetworks />
			)}
			{hasActiveQFRound && isOnEligibleNetworks && (
				<EstimatedMatchingToast
					projectData={project}
					token={selectedOneTimeToken}
					amount={amount}
				/>
			)}
			{!noDonationSplit ? (
				<DonateToGiveth
					setDonationToGiveth={setDonationToGiveth}
					donationToGiveth={donationToGiveth}
					givethDonationAmount={givethDonationAmount}
					title={
						formatMessage({ id: 'label.donation_to' }) + ' Giveth'
					}
				/>
			) : (
				<br />
			)}
			{selectedOneTimeToken && (
				<GIVBackToast
					projectEligible={projectIsGivBackEligible}
					tokenEligible={selectedOneTimeToken.isGivbackEligible}
				/>
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
			{isConnected && (
				<MainButton
					id='Donate_Final'
					label={formatMessage({ id: 'label.donate' })}
					disabled={donationDisabled}
					size='medium'
					onClick={handleDonate}
				/>
			)}
			{!isConnected && (
				<MainButton
					label={formatMessage({
						id: 'component.button.connect_wallet',
					})}
					onClick={() => dispatch(setShowWelcomeModal(true))}
				/>
			)}
			<CheckBoxContainer>
				<CheckBox
					label={formatMessage({
						id: 'label.make_it_anonymous',
					})}
					checked={anonymous}
					onChange={() => setAnonymous(!anonymous)}
					size={14}
				/>
				<div>
					{formatMessage({
						id: 'component.tooltip.donate_anonymously',
					})}
				</div>
			</CheckBoxContainer>
			{showSelectTokenModal && (
				<SelectTokenModal
					setShowModal={setShowSelectTokenModal}
					tokens={erc20List}
					acceptCustomToken={
						project.organization?.supportCustomTokens
					}
				/>
			)}
		</MainContainer>
	);
};

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

export const CheckBoxContainer = styled.div`
	margin-top: 16px;
	> div:nth-child(2) {
		color: ${neutralColors.gray[900]};
		font-size: 12px;
		margin-top: 3px;
		margin-left: 24px;
	}
`;

const QRToastLink = styled(Flex)`
	cursor: pointer;
	align-items: center;
	gap: 12px;
	padding-block: 8px;
	padding-left: 16px;
	margin-block: 16px;
	background-color: ${semanticColors.blueSky[100]};
	color: ${semanticColors.blueSky[700]};
	border-radius: 8px;
	border: 1px solid ${semanticColors.blueSky[300]};
	font-weight: 500;
`;

export default CryptoDonation;
