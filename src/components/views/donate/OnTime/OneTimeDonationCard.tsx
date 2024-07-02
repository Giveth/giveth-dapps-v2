import styled from 'styled-components';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	B,
	brandColors,
	Button,
	Flex,
	GLink,
	IconCaretDown16,
	IconRefresh16,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
// @ts-ignore
import { captureException } from '@sentry/nextjs';
import { Address, Chain, formatUnits, parseUnits, zeroAddress } from 'viem';
import { useConnection } from '@solana/wallet-adapter-react';
import { useBalance } from 'wagmi';
import { setShowWelcomeModal } from '@/features/modal/modal.slice';
import { Shadow } from '@/components/styled-components/Shadow';
import CheckBox from '@/components/Checkbox';

import { donationDecimals, mediaQueries } from '@/lib/constants/constants';
import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import GeminiModal from './GeminiModal';
import config from '@/configuration';

import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { client } from '@/apollo/apolloClient';
import { PROJECT_ACCEPTED_TOKENS } from '@/apollo/gql/gqlProjects';
import { showToastError, truncateToDecimalPlaces } from '@/lib/helpers';
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

const CryptoDonation: FC = () => {
	const {
		chain,
		walletChainType,
		walletAddress: address,
		isConnected,
		balance,
	} = useGeneralWallet();
	const { connection: solanaConnection } = useConnection();
	const { formatMessage } = useIntl();
	const { isSignedIn } = useAppSelector(state => state.user);

	const {
		project,
		hasActiveQFRound,
		selectedOneTimeToken,
		setSelectedOneTimeToken,
	} = useDonateData();
	const dispatch = useAppDispatch();

	const {
		organization,
		verified,
		id: projectId,
		status,
		addresses,
		title: projectTitle,
	} = project;

	const { supportCustomTokens, label: orgLabel } = organization || {};
	const isActive = status?.name === EProjectStatus.ACTIVE;
	const noDonationSplit = Number(projectId!) === config.GIVETH_PROJECT_ID;

	const [customInput, setCustomInput] = useState<any>();
	const [amountTyped, setAmountTyped] = useState<number>();
	const [amount, setAmount] = useState(0n);
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
		refetch,
		isRefetching,
	} = useBalance({
		token:
			selectedOneTimeToken?.address === zeroAddress
				? undefined
				: selectedOneTimeToken?.address,
		address:
			walletChainType === ChainType.EVM
				? (address as Address)
				: undefined,
	});

	const stopPolling = useRef<any>(null);
	const tokenSymbol = selectedOneTimeToken?.symbol;
	const tokenDecimals = selectedOneTimeToken?.decimals || 18;
	const projectIsGivBackEligible = !!verified;
	const { activeStartedRound } = getActiveRound(project.qfRounds);
	const networkId = (chain as Chain)?.id;

	const isOnEligibleNetworks =
		networkId && activeStartedRound?.eligibleNetworks?.includes(networkId);

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
			console.log('tokens', tokens);
			console.log('tokens', tokens.length);
			setErc20OriginalList(tokens);
			setErc20List(tokens);
			setTokenIsGivBackEligible(tokens[0]?.isGivbackEligible);
		}
	}, [networkId, acceptedTokens, walletChainType, addresses]);

	// useEffect(() => {
	// 	if (isConnected || address) pollToken();
	// 	else {
	// 		setSelectedOneTimeToken(undefined);
	// 	}
	// 	return () => clearPoll();
	// }, [selectedOneTimeToken, isConnected, address, balance]);

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
	}, [selectedOneTimeToken, isConnected, address, networkId]);

	const checkGIVTokenAvailability = () => {
		console.log('cheking1');
		if (orgLabel !== ORGANIZATION.givingBlock) return true;
		console.log('cheking2');
		if (selectedOneTimeToken?.symbol === 'GIV') {
			console.log('cheking3');
			setGeminiModal(true);
			return false;
		} else {
			return true;
		}
	};

	const selectedTokenBalance =
		(walletChainType == ChainType.EVM ? evmBalance?.value : 0n) || 0n;

	// const clearPoll = () => {
	// 	if (stopPolling.current) {
	// 		stopPolling.current();
	// 		stopPolling.current = undefined;
	// 	}
	// };

	// const pollToken = useCallback(async () => {
	// 	clearPoll();

	// 	if (!selectedOneTimeToken) {
	// 		return setSelectedTokenBalance(0n);
	// 	}
	// 	// Native token balance is provided by the Web3Provider
	// 	const _selectedTokenSymbol = selectedOneTimeToken.symbol.toUpperCase();
	// 	const nativeCurrency =
	// 		config.NETWORKS_CONFIG[
	// 			!walletChainType || walletChainType == ChainType.EVM
	// 				? networkId
	// 				: walletChainType
	// 		]?.nativeCurrency;

	// 	if (_selectedTokenSymbol === nativeCurrency?.symbol?.toUpperCase()) {
	// 		return setSelectedTokenBalance(
	// 			parseUnits(balance || '0', nativeCurrency.decimals),
	// 		);
	// 	}
	// 	stopPolling.current = pollEvery(
	// 		() => ({
	// 			request: async () => {
	// 				try {
	// 					if (walletChainType === ChainType.SOLANA) {
	// 						const splTokenMintAddress = new PublicKey(
	// 							selectedOneTimeToken.address,
	// 						);
	// 						const tokenAccounts =
	// 							await solanaConnection.getParsedTokenAccountsByOwner(
	// 								new PublicKey(address!),
	// 								{ mint: splTokenMintAddress },
	// 							);
	// 						const accountInfo =
	// 							tokenAccounts.value[0].account.data;
	// 						const splBalance =
	// 							accountInfo.parsed.info.tokenAmount.amount;
	// 						return setSelectedTokenBalance(BigInt(splBalance));
	// 					}

	// 					const _balance = await readContract(wagmiConfig, {
	// 						address: selectedOneTimeToken.address! as Address,
	// 						abi: erc20Abi,
	// 						functionName: 'balanceOf',
	// 						args: [address as Address],
	// 					});
	// 					setSelectedTokenBalance(_balance);
	// 					return _balance;
	// 				} catch (e) {
	// 					captureException(e, {
	// 						tags: {
	// 							section: 'Polltoken pollEvery',
	// 						},
	// 					});
	// 					return setSelectedTokenBalance(0n);
	// 				}
	// 			},
	// 			onResult: (_balance: bigint) => {
	// 				if (_balance && _balance !== selectedTokenBalance) {
	// 					setSelectedTokenBalance(_balance);
	// 				}
	// 			},
	// 		}),
	// 		POLL_DELAY_TOKENS,
	// 	)();
	// }, [address, networkId, tokenSymbol, balance, walletChainType]);

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
			parseUnits(String(amountTyped), tokenDecimals) >
			selectedTokenBalance
		) {
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

	const userBalance = truncateToDecimalPlaces(
		formatUnits(selectedTokenBalance, tokenDecimals),
		donationDecimals,
	);
	const setMaxDonation = () => setAmountTyped(userBalance);

	const donationDisabled =
		!isActive || !amountTyped || !selectedOneTimeToken || amountError;

	const donateWithoutMatching = () => {
		if (isSignedIn) {
			setShowDonateModal(true);
		} else {
			signInThenDonate();
		}
	};

	return (
		<MainContainer>
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
			{showDonateModal && selectedOneTimeToken && amountTyped && (
				<DonateModal
					setShowModal={setShowDonateModal}
					token={selectedOneTimeToken}
					amount={amountTyped}
					donationToGiveth={donationToGiveth}
					anonymous={anonymous}
					givBackEligible={
						projectIsGivBackEligible && tokenIsGivBackEligible
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
			{/* <InputContainer>
				<SearchContainer
					$error={amountError}
					$focused={inputBoxFocused}
				>
					<DropdownContainer>
						<TokenPicker
							tokenList={erc20List}
							selectedOneTimeToken={selectedOneTimeToken}
							inputValue={customInput}
							onChange={(i: IProjectAcceptedToken) => {
								setSelectedOneTimeToken(i);
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
							const checkGIV = checkGIVTokenAvailability();
							if (/^0+(?=\d)/.test(String(val))) return;
							console.log;
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
				{selectedOneTimeToken && (
					<AvText onClick={setMaxDonation}>
						{formatMessage({ id: 'label.available' })}:{' '}
						{userBalance} {tokenSymbol}
					</AvText>
				)}
			</InputContainer> */}
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
								<B>{selectedOneTimeToken.symbol}</B>
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
				<Flex gap='4px'>
					<GLinkStyled
						size='Small'
						onClick={() => setAmount(selectedTokenBalance)}
					>
						{formatMessage({
							id: 'label.available',
						})}
						:{' '}
						{truncateToDecimalPlaces(
							formatUnits(selectedTokenBalance, tokenDecimals),
							tokenDecimals / 3,
						)}
					</GLinkStyled>
					<IconWrapper onClick={() => !isRefetching && refetch()}>
						{isRefetching ? (
							<Spinner size={16} />
						) : (
							<IconRefresh16 />
						)}
					</IconWrapper>
				</Flex>
			</Flex>
			{hasActiveQFRound && !isOnEligibleNetworks && walletChainType && (
				<DonateQFEligibleNetworks />
			)}
			{hasActiveQFRound && isOnEligibleNetworks && (
				<EstimatedMatchingToast
					projectData={project}
					token={selectedOneTimeToken}
					amountTyped={amountTyped}
				/>
			)}
			{!noDonationSplit ? (
				<DonateToGiveth
					setDonationToGiveth={setDonationToGiveth}
					donationToGiveth={donationToGiveth}
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
					tokenEligible={tokenIsGivBackEligible}
				/>
			)}
			{!noDonationSplit ? (
				<TotalDonation
					donationToGiveth={donationToGiveth}
					totalDonation={amountTyped}
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
				/>
			)}
		</MainContainer>
	);
};

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
	&:hover {
		cursor: pointer;
		text-decoration: underline;
	}
`;

interface IInputBox {
	$error: boolean;
	$focused: boolean;
}

const SearchContainer = styled.div<IInputBox>`
	display: flex;
	border: 2px solid
		${props =>
			props.$error === true
				? semanticColors.punch[500]
				: neutralColors.gray[300]};
	border-radius: 8px;
	box-shadow: ${props => props.$focused && Shadow.Neutral[500]};
	&:hover {
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

export const CheckBoxContainer = styled.div`
	margin-top: 16px;
	> div:nth-child(2) {
		color: ${neutralColors.gray[900]};
		font-size: 12px;
		margin-top: 3px;
		margin-left: 24px;
	}
`;

export default CryptoDonation;
