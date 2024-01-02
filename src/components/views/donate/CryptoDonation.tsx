import styled from 'styled-components';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	brandColors,
	Button,
	GLink,
	H4,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
// @ts-ignore
import { captureException } from '@sentry/nextjs';
import { Chain, formatUnits, parseUnits } from 'viem';

import { getContract } from 'wagmi/actions';
import { type Address, erc20ABI } from 'wagmi';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import { Shadow } from '@/components/styled-components/Shadow';
import InputBox from './InputBox';
import CheckBox from '@/components/Checkbox';
import DonateModal from '@/components/views/donate/DonateModal';
import { mediaQueries, minDonationAmount } from '@/lib/constants/constants';
import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import GeminiModal from './GeminiModal';
import config from '@/configuration';
import TokenPicker from './TokenPicker';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { client } from '@/apollo/apolloClient';
import { PROJECT_ACCEPTED_TOKENS } from '@/apollo/gql/gqlProjects';
import { formatBalance, pollEvery, showToastError } from '@/lib/helpers';
import {
	IProjectAcceptedToken,
	IProjectAcceptedTokensGQL,
} from '@/apollo/types/gqlTypes';
import { prepareTokenList } from '@/components/views/donate/helpers';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { getERC20Info } from '@/lib/contracts';
import GIVBackToast from '@/components/views/donate/GIVBackToast';
import { DonateWrongNetwork } from '@/components/modals/DonateWrongNetwork';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import usePurpleList from '@/hooks/usePurpleList';
import DonateToGiveth from '@/components/views/donate/DonateToGiveth';
import TotalDonation from '@/components/views/donate/TotalDonation';
import SaveGasFees from '@/components/views/donate/SaveGasFees';
import SwitchToAcceptedChain from '@/components/views/donate/SwitchToAcceptedChain';
import { useDonateData } from '@/context/donate.context';
import { useModalCallback } from '@/hooks/useModalCallback';
import EstimatedMatchingToast from '@/components/views/donate/EstimatedMatchingToast';
import DonateQFEligibleNetworks from './DonateQFEligibleNetworks';
import { getActiveRound } from '@/helpers/qf';
import QFModal from '@/components/views/donate/QFModal';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { ChainType } from '@/types/config';
import { isRecurringActive } from './DonationCard';

const POLL_DELAY_TOKENS = config.SUBGRAPH_POLLING_INTERVAL;

interface IInputBox {
	error: boolean;
	focused: boolean;
}

const CryptoDonation: FC = () => {
	const {
		chain,
		walletChainType,
		walletAddress: address,
		isConnected,
		balance,
	} = useGeneralWallet();
	const { formatMessage } = useIntl();
	const { isEnabled, isSignedIn } = useAppSelector(state => state.user);

	const isPurpleListed = usePurpleList();

	const { project, hasActiveQFRound } = useDonateData();
	const dispatch = useAppDispatch();

	const {
		organization,
		verified,
		id: projectId,
		status,
		title: projectTitle,
	} = project;

	const { supportCustomTokens, label: orgLabel } = organization || {};
	const isActive = status?.name === EProjectStatus.ACTIVE;
	const noDonationSplit = Number(projectId!) === config.GIVETH_PROJECT_ID;
	const [selectedToken, setSelectedToken] = useState<IProjectAcceptedToken>();
	const [selectedTokenBalance, setSelectedTokenBalance] = useState(0n);
	const [customInput, setCustomInput] = useState<any>();
	const [amountTyped, setAmountTyped] = useState<number>();
	const [inputBoxFocused, setInputBoxFocused] = useState(false);
	const [geminiModal, setGeminiModal] = useState(false);
	const [erc20List, setErc20List] = useState<IProjectAcceptedToken[]>();
	const [erc20OriginalList, setErc20OriginalList] = useState<any>();
	const [anonymous, setAnonymous] = useState<boolean>(false);
	const [amountError, setAmountError] = useState<boolean>(false);
	const [tokenIsGivBackEligible, setTokenIsGivBackEligible] =
		useState<boolean>();
	const [showDonateModal, setShowDonateModal] = useState(false);
	const [showInsufficientModal, setShowInsufficientModal] = useState(false);
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [acceptedTokens, setAcceptedTokens] =
		useState<IProjectAcceptedToken[]>();
	const [acceptedChains, setAcceptedChains] = useState<number[]>();
	const [maxDonationEnabled, setMaxDonationEnabled] = useState(false);
	const [donationToGiveth, setDonationToGiveth] = useState(
		noDonationSplit ? 0 : 5,
	);
	const [showQFModal, setShowQFModal] = useState(false);

	const { modalCallback: signInThenDonate } = useModalCallback(() =>
		setShowDonateModal(true),
	);
	const stopPolling = useRef<any>(null);
	const tokenSymbol = selectedToken?.symbol;
	const tokenDecimals = selectedToken?.decimals || 18;
	const projectIsGivBackEligible = !!verified;
	const totalDonation = ((amountTyped || 0) * (donationToGiveth + 100)) / 100;
	const activeRound = getActiveRound(project.qfRounds);
	const networkId = (chain as Chain)?.id;

	const isOnEligibleNetworks =
		networkId && activeRound?.eligibleNetworks?.includes(networkId);

	useEffect(() => {
		if (
			(networkId ||
				(walletChainType && walletChainType !== ChainType.EVM)) &&
			acceptedTokens
		) {
			const acceptedNetworkIds = [
				...new Set(acceptedTokens.map(token => +token.networkId)),
			].filter(i => i); // Exclude network id 0

			const acceptedNonEvmNetworks = [
				...new Set(acceptedTokens.map(({ chainType }) => chainType)),
			].filter(chainType => chainType && chainType !== ChainType.EVM);

			const filteredTokens = acceptedTokens.filter(token => {
				switch (walletChainType) {
					case ChainType.EVM:
						return (
							token.networkId === networkId &&
							acceptedNetworkIds.includes(networkId)
						);
					case ChainType.SOLANA:
						return (
							token.chainType === walletChainType &&
							acceptedNonEvmNetworks.includes(walletChainType)
						);
					default:
						return false;
				}
			});

			setAcceptedChains(acceptedNetworkIds);
			if (filteredTokens.length < 1) {
				setShowChangeNetworkModal(true);
			}
			const tokens = prepareTokenList(filteredTokens);
			setErc20OriginalList(tokens);
			setErc20List(tokens);
			setSelectedToken(tokens[0]);
			setTokenIsGivBackEligible(tokens[0]?.isGivbackEligible);
		}
	}, [networkId, acceptedTokens, walletChainType]);

	useEffect(() => {
		setMaxDonationEnabled(false);
		if (isEnabled) pollToken();
		else {
			setSelectedToken(undefined);
		}
		return () => clearPoll();
	}, [selectedToken, isEnabled, address, balance]);

	useEffect(() => {
		client
			.query({
				query: PROJECT_ACCEPTED_TOKENS,
				variables: { projectId: Number(projectId) },
				fetchPolicy: 'no-cache',
			})
			.then((res: IProjectAcceptedTokensGQL) => {
				setAcceptedTokens(res.data.getProjectAcceptTokens);
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'Crypto Donation UseEffect',
					},
				});
			});
	}, []);

	useEffect(() => {
		setAmountTyped(undefined);
	}, [selectedToken, isEnabled, address, networkId]);

	const checkGIVTokenAvailability = () => {
		if (orgLabel !== ORGANIZATION.givingBlock) return true;
		if (selectedToken?.symbol === 'GIV') {
			setGeminiModal(true);
			return false;
		} else {
			return true;
		}
	};

	const clearPoll = () => {
		if (stopPolling.current) {
			stopPolling.current();
			stopPolling.current = undefined;
		}
	};

	const pollToken = useCallback(async () => {
		clearPoll();
		if (walletChainType === ChainType.SOLANA) {
			return setSelectedTokenBalance(
				BigInt(Number(balance || 0) * LAMPORTS_PER_SOL),
			);
		}

		if (!selectedToken) {
			return setSelectedTokenBalance(0n);
		}
		// Native token balance is provided by the Web3Provider
		const _selectedTokenSymbol = selectedToken.symbol.toUpperCase();
		const nativeCurrency =
			config.EVM_NETWORKS_CONFIG[networkId!]?.nativeCurrency;

		if (_selectedTokenSymbol === nativeCurrency?.symbol?.toUpperCase()) {
			return setSelectedTokenBalance(
				parseUnits(balance || '0', nativeCurrency.decimals),
			);
		}
		stopPolling.current = pollEvery(
			() => ({
				request: async () => {
					try {
						const contract = getContract({
							address: selectedToken.address! as Address,
							abi: erc20ABI,
						});

						const balance = await contract.read.balanceOf([
							address! as `0x${string}`,
						]);
						setSelectedTokenBalance(balance);
						return balance;
					} catch (e) {
						captureException(e, {
							tags: {
								section: 'Polltoken pollEvery',
							},
						});
						return 0;
					}
				},
				onResult: (_balance: bigint) => {
					if (_balance && _balance !== selectedTokenBalance) {
						setSelectedTokenBalance(_balance);
					}
				},
			}),
			POLL_DELAY_TOKENS,
		)();
	}, [address, networkId, tokenSymbol, balance, walletChainType]);

	const handleCustomToken = (i: Address) => {
		if (!supportCustomTokens) return;
		// It's a contract
		if (i?.length === 42) {
			try {
				// setSelectLoading(true);
				getERC20Info({
					contractAddress: i,
					networkId: networkId as number,
				}).then(pastedToken => {
					if (!pastedToken) return;
					const found = erc20List?.find(
						(t: IProjectAcceptedToken) =>
							t.symbol === pastedToken.symbol,
					);
					!found &&
						erc20List &&
						setErc20List([...erc20List, pastedToken]);
					setCustomInput(pastedToken?.address);
					// setSelectLoading(false);
				});
			} catch (error) {
				// setSelectLoading(false);
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'handleCustomToken',
					},
				});
			}
		} else {
			setCustomInput(i);
			setErc20List(erc20OriginalList);
		}
	};

	const handleDonate = () => {
		if (
			parseUnits(String(totalDonation), tokenDecimals) >
			selectedTokenBalance
		) {
			return setShowInsufficientModal(true);
		}
		if (
			hasActiveQFRound &&
			!isOnEligibleNetworks &&
			selectedToken?.chainType === ChainType.EVM
		) {
			setShowQFModal(true);
		} else if (!isSignedIn) {
			signInThenDonate();
		} else {
			setShowDonateModal(true);
		}
	};

	const calcMaxDonation = (givethDonation?: number) => {
		const s = givethDonation ?? donationToGiveth;
		const t = (selectedTokenBalance * 100n) / BigInt(100 + s);
		return Number(formatUnits(t, tokenDecimals));
	};

	const setMaxDonation = (givethDonation?: number) =>
		setAmountTyped(calcMaxDonation(givethDonation ?? donationToGiveth));

	const userBalance = formatUnits(selectedTokenBalance, tokenDecimals);

	const donationDisabled =
		!isActive || !amountTyped || !selectedToken || amountError;

	const donateWithoutMatching = () => {
		if (isSignedIn) {
			setShowDonateModal(true);
		} else {
			signInThenDonate();
		}
	};

	return (
		<MainContainer>
			{!isRecurringActive && (
				<H4Styled weight={700}>
					{formatMessage({ id: 'page.donate.title' })}
				</H4Styled>
			)}
			{showQFModal && (
				<QFModal
					donateWithoutMatching={donateWithoutMatching}
					setShowModal={setShowQFModal}
				/>
			)}
			{geminiModal && <GeminiModal setShowModal={setGeminiModal} />}
			{showChangeNetworkModal && acceptedChains && (
				<DonateWrongNetwork
					setShowModal={setShowChangeNetworkModal}
					acceptedChains={acceptedChains}
				/>
			)}
			{showInsufficientModal && (
				<InsufficientFundModal
					setShowModal={setShowInsufficientModal}
				/>
			)}
			{showDonateModal && selectedToken && amountTyped && (
				<DonateModal
					setShowModal={setShowDonateModal}
					token={selectedToken}
					amount={amountTyped}
					donationToGiveth={donationToGiveth}
					anonymous={anonymous}
					givBackEligible={
						projectIsGivBackEligible && tokenIsGivBackEligible
					}
				/>
			)}
			<InputContainer>
				<SwitchToAcceptedChain acceptedChains={acceptedChains} />
				<SaveGasFees acceptedChains={acceptedChains} />
				<SearchContainer error={amountError} focused={inputBoxFocused}>
					<DropdownContainer>
						<TokenPicker
							tokenList={erc20List}
							selectedToken={selectedToken}
							inputValue={customInput}
							onChange={(i: IProjectAcceptedToken) => {
								setSelectedToken(i);
								setCustomInput('');
								setErc20List(erc20OriginalList);
								setTokenIsGivBackEligible(i.isGivbackEligible);
							}}
							onInputChange={handleCustomToken}
							placeholder={
								supportCustomTokens
									? formatMessage({
											id: 'component.input.search_or_paste',
										})
									: formatMessage({
											id: 'component.input.search_name',
										})
							}
							projectVerified={project?.verified!}
							disabled={!isConnected}
						/>
					</DropdownContainer>

					<InputBox
						value={amountTyped}
						error={amountError}
						onChange={val => {
							setMaxDonationEnabled(false);
							const checkGIV = checkGIVTokenAvailability();
							if (/^0+(?=\d)/.test(String(val))) return;
							setAmountError(
								val !== undefined
									? val < minDonationAmount
									: false,
							);
							if (checkGIV) setAmountTyped(val);
						}}
						onFocus={setInputBoxFocused}
						disabled={!isConnected}
					/>
				</SearchContainer>
				{selectedToken && (
					<AvText
						onClick={() => {
							setMaxDonationEnabled(true);
							setMaxDonation();
						}}
					>
						{formatMessage({ id: 'label.available' })}:{' '}
						{formatBalance(userBalance)} {tokenSymbol}
					</AvText>
				)}
			</InputContainer>
			{hasActiveQFRound && !isOnEligibleNetworks && (
				<DonateQFEligibleNetworks />
			)}
			{hasActiveQFRound && isOnEligibleNetworks && (
				<EstimatedMatchingToast
					projectData={project}
					token={selectedToken}
					amountTyped={amountTyped}
				/>
			)}
			{!noDonationSplit ? (
				<DonateToGiveth
					setDonationToGiveth={e => {
						maxDonationEnabled && setMaxDonation(e);
						setDonationToGiveth(e);
					}}
					donationToGiveth={donationToGiveth}
					title={
						formatMessage({ id: 'label.donation_to' }) + ' Giveth'
					}
				/>
			) : (
				<br />
			)}
			{selectedToken && (
				<GIVBackToast
					projectEligible={projectIsGivBackEligible}
					tokenEligible={tokenIsGivBackEligible}
					userEligible={!isPurpleListed}
				/>
			)}
			{!noDonationSplit ? (
				<TotalDonation
					donationToGiveth={donationToGiveth}
					donationToProject={amountTyped}
					projectTitle={projectTitle}
					tokenSymbol={selectedToken?.symbol}
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
			{isEnabled && (
				<MainButton
					label={formatMessage({ id: 'label.donate' })}
					disabled={donationDisabled}
					size='medium'
					onClick={handleDonate}
				/>
			)}
			{!isEnabled && (
				<MainButton
					label={formatMessage({
						id: 'component.button.connect_wallet',
					})}
					onClick={() => dispatch(setShowWelcomeModal(true))}
				/>
			)}
			<CheckBoxContainer>
				<CheckBox
					label={formatMessage({ id: 'label.donate_privately' })}
					checked={anonymous}
					onChange={() => setAnonymous(!anonymous)}
					size={14}
				/>
				<div>
					{formatMessage({
						id: 'component.tooltip.donate_privately',
					})}
				</div>
			</CheckBoxContainer>
		</MainContainer>
	);
};

const H4Styled = styled(H4)`
	margin-bottom: 30px;
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

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 18px;
`;

const AvText = styled(GLink)`
	color: ${brandColors.deep[500]};
	padding: 4px 0 0 5px;
	:hover {
		cursor: pointer;
		text-decoration: underline;
	}
`;

const SearchContainer = styled.div<IInputBox>`
	display: flex;
	border: 2px solid
		${props =>
			props.error === true
				? semanticColors.punch[500]
				: neutralColors.gray[300]};
	border-radius: 8px;
	box-shadow: ${props => props.focused && Shadow.Neutral[500]};
	:hover {
		box-shadow: ${Shadow.Neutral[500]};
	}
`;

const DropdownContainer = styled.div`
	width: 35%;
	height: 54px;
	min-width: 140px;
	${mediaQueries.mobileL} {
		width: 50%;
	}
`;

const MainButton = styled(Button)`
	width: 100%;
	background-color: ${props =>
		props.disabled ? brandColors.giv[200] : brandColors.giv[500]};
	color: white;
	text-transform: uppercase;
`;

const CheckBoxContainer = styled.div`
	margin-top: 16px;
	> div:nth-child(2) {
		color: ${neutralColors.gray[900]};
		font-size: 12px;
		margin-top: 3px;
		margin-left: 24px;
	}
`;

export default CryptoDonation;
