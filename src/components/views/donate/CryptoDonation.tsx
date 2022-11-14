import styled from 'styled-components';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import BigNumber from 'bignumber.js';
import { useIntl } from 'react-intl';
import {
	brandColors,
	Button,
	Caption,
	GLink,
	IconGasStation,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
// @ts-ignore
import tokenAbi from 'human-standard-token-abi';
import { captureException } from '@sentry/nextjs';

import { Shadow } from '@/components/styled-components/Shadow';
import InputBox from './InputBox';
import CheckBox from '@/components/Checkbox';
import DonateModal from '@/components/modals/DonateModal';
import { mediaQueries, minDonationAmount } from '@/lib/constants/constants';
import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import { IDonationProject } from '@/apollo/types/types';
import { fetchPrice } from '@/services/token';
import { switchNetwork } from '@/lib/wallet';
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
import {
	filterTokens,
	getNetworkIds,
	getNetworkNames,
	prepareTokenList,
} from '@/components/views/donate/helpers';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { getERC20Info } from '@/lib/contracts';
import GIVBackToast from '@/components/views/donate/GIVBackToast';
import { DonateWrongNetwork } from '@/components/modals/DonateWrongNetwork';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowSignWithWallet,
	setShowWalletModal,
} from '@/features/modal/modal.slice';
import usePurpleList from '@/hooks/usePurpleList';
import DonateToGiveth from '@/components/views/donate/DonateToGiveth';
import TotalDonation from '@/components/views/donate/TotalDonation';
import { Flex } from '@/components/styled-components/Flex';

const ethereumChain = config.PRIMARY_NETWORK;
const gnosisChain = config.SECONDARY_NETWORK;
const stableCoins = [gnosisChain.mainToken, 'DAI', 'USDT'];
const POLL_DELAY_TOKENS = config.SUBGRAPH_POLLING_INTERVAL;

export interface ISuccessDonation {
	txHash: string[];
	givBackEligible?: boolean;
}

interface IInputBox {
	error: boolean;
	focused: boolean;
}

const CryptoDonation = (props: {
	setSuccessDonation: (i: ISuccessDonation) => void;
	project: IDonationProject;
}) => {
	const { chainId: networkId, account, library, active } = useWeb3React();
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();
	const { isEnabled, isSignedIn, balance } = useAppSelector(
		state => state.user,
	);
	const ethPrice = useAppSelector(state => state.price.ethPrice);
	const isPurpleListed = usePurpleList();

	const { project, setSuccessDonation } = props;
	const {
		organization,
		verified,
		id: projectId,
		status,
		addresses,
		givethAddresses,
		title: projectTitle,
	} = project;

	const {
		supportCustomTokens,
		name: orgName,
		label: orgLabel,
	} = organization || {};
	const isActive = status?.name === EProjectStatus.ACTIVE;
	const mainTokenPrice = new BigNumber(ethPrice).toNumber();
	const noDonationSplit = Number(projectId!) === config.GIVETH_PROJECT_ID;

	const projectWalletAddress =
		addresses?.find(a => a.isRecipient && a.networkId === networkId)
			?.address || '';
	const givethWalletAddress =
		givethAddresses?.find(a => a.isRecipient && a.networkId === networkId)
			?.address || '';

	const [selectedToken, setSelectedToken] = useState<IProjectAcceptedToken>();
	const [selectedTokenBalance, setSelectedTokenBalance] = useState<any>();
	const [customInput, setCustomInput] = useState<any>();
	const [tokenPrice, setTokenPrice] = useState<number>(1);
	const [amountTyped, setAmountTyped] = useState<number>();
	const [inputBoxFocused, setInputBoxFocused] = useState(false);
	const [geminiModal, setGeminiModal] = useState(false);
	const [erc20List, setErc20List] = useState<IProjectAcceptedToken[]>();
	const [erc20OriginalList, setErc20OriginalList] = useState<any>();
	const [anonymous, setAnonymous] = useState<boolean>(false);
	// const [selectLoading, setSelectLoading] = useState(false);
	const [amountError, setAmountError] = useState<boolean>(false);
	const [tokenIsGivBackEligible, setTokenIsGivBackEligible] =
		useState<boolean>();
	const [showDonateModal, setShowDonateModal] = useState(false);
	const [showInsufficientModal, setShowInsufficientModal] = useState(false);
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [acceptedTokens, setAcceptedTokens] =
		useState<IProjectAcceptedToken[]>();
	const [acceptedChains, setAcceptedChains] = useState<number[]>();
	const [donationToGiveth, setDonationToGiveth] = useState(
		noDonationSplit ? 0 : 5,
	);

	const stopPolling = useRef<any>(null);
	const tokenSymbol = selectedToken?.symbol;
	const isGnosis = networkId === gnosisChain.id;
	const projectIsGivBackEligible = !!verified;
	const totalDonation = ((amountTyped || 0) * (donationToGiveth + 100)) / 100;

	useEffect(() => {
		if (networkId && acceptedTokens) {
			const networkIds = getNetworkIds(acceptedTokens, addresses);
			const filteredTokens = filterTokens(
				acceptedTokens,
				networkId,
				networkIds,
			);
			setAcceptedChains(networkIds);
			if (filteredTokens.length < 1) {
				setShowChangeNetworkModal(true);
			}
			const tokens = prepareTokenList(filteredTokens);
			setErc20OriginalList(tokens);
			setErc20List(tokens);
			setSelectedToken(tokens[0]);
			setTokenIsGivBackEligible(tokens[0]?.isGivbackEligible);
		}
	}, [networkId, acceptedTokens]);

	useEffect(() => {
		if (isEnabled) pollToken();
		return () => clearPoll();
	}, [selectedToken, isEnabled, account, networkId, balance]);

	useEffect(() => {
		if (!active) {
			setSelectedToken(undefined);
			setAmountTyped(undefined);
		}
	}, [active]);

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
		const setPrice = async () => {
			if (
				selectedToken?.symbol &&
				stableCoins.includes(selectedToken.symbol)
			) {
				setTokenPrice(1);
			} else if (selectedToken?.symbol === ethereumChain.mainToken) {
				setTokenPrice(mainTokenPrice || 0);
			} else if (selectedToken?.address) {
				let tokenAddress = selectedToken.address;
				// Coingecko doesn't have these tokens in Gnosis Chain, so fetching price from ethereum
				if (isGnosis && selectedToken.mainnetAddress) {
					tokenAddress = selectedToken.mainnetAddress || '';
				}
				const coingeckoChainId =
					!isGnosis || selectedToken.mainnetAddress
						? ethereumChain.id
						: gnosisChain.id;
				const fetchedPrice = await fetchPrice(
					coingeckoChainId,
					tokenAddress,
					setTokenPrice,
				);
				setTokenPrice(fetchedPrice || 0);
			}
		};

		if (selectedToken) {
			setPrice().then();
		}
	}, [selectedToken, mainTokenPrice]);

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

	const pollToken = useCallback(() => {
		clearPoll();
		if (!selectedToken) {
			return setSelectedTokenBalance(undefined);
		}
		// Native token balance is provided by the Web3Provider
		if (
			selectedToken.symbol === ethereumChain.mainToken ||
			selectedToken.symbol === gnosisChain.mainToken
		) {
			return setSelectedTokenBalance(balance);
		}
		stopPolling.current = pollEvery(
			() => ({
				request: async () => {
					try {
						const instance = new Contract(
							selectedToken.address!,
							tokenAbi,
							library,
						);
						return (
							(await instance.balanceOf(account)) /
							10 ** selectedToken.decimals!
						);
					} catch (e) {
						captureException(e, {
							tags: {
								section: 'Polltoken pollEvery',
							},
						});
						return 0;
					}
				},
				onResult: (_balance: number) => {
					if (
						_balance !== undefined &&
						(!selectedTokenBalance ||
							selectedTokenBalance !== _balance)
					) {
						setSelectedTokenBalance(_balance);
					}
				},
			}),
			POLL_DELAY_TOKENS,
		)();
	}, [account, networkId, tokenSymbol, balance]);

	const handleCustomToken = (i: string) => {
		if (!supportCustomTokens) return;
		// It's a contract
		if (i?.length === 42) {
			try {
				// setSelectLoading(true);
				getERC20Info({
					library,
					tokenAbi,
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
		if (selectedTokenBalance < totalDonation) {
			return setShowInsufficientModal(true);
		}
		if (!projectWalletAddress) {
			return showToastError(
				'There is no eth address assigned for this project',
			);
		}
		if (!isSignedIn) {
			return dispatch(setShowSignWithWallet(true));
		}
		setShowDonateModal(true);
	};

	const donationDisabled =
		!isActive || !amountTyped || !selectedToken || amountError;

	return (
		<MainContainer>
			{geminiModal && <GeminiModal setShowModal={setGeminiModal} />}
			{showChangeNetworkModal && acceptedChains && (
				<DonateWrongNetwork
					setShowModal={setShowChangeNetworkModal}
					targetNetworks={acceptedChains}
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
					setSuccessDonation={setSuccessDonation}
					project={project}
					projectWalletAddress={projectWalletAddress}
					givethWalletAddress={givethWalletAddress}
					token={selectedToken}
					amount={amountTyped}
					donationToGiveth={donationToGiveth}
					price={tokenPrice}
					anonymous={anonymous}
					givBackEligible={
						projectIsGivBackEligible && tokenIsGivBackEligible
					}
				/>
			)}

			<InputContainer>
				{networkId &&
					acceptedChains &&
					!acceptedChains.includes(networkId) && (
						<NetworkToast>
							<Caption medium>
								{formatMessage({
									id: 'label.projects_from',
								})}{' '}
								{orgName}{' '}
								{formatMessage({
									id: 'label.only_accept_on',
								})}{' '}
								{getNetworkNames(acceptedChains, 'and')}.
							</Caption>
							<SwitchCaption
								onClick={() => switchNetwork(ethereumChain.id)}
							>
								{formatMessage({ id: 'label.switch_network' })}
							</SwitchCaption>
						</NetworkToast>
					)}
				{networkId &&
					networkId === ethereumChain.id &&
					acceptedChains?.includes(gnosisChain.id) && (
						<NetworkToast>
							<Flex alignItems='center' gap='9px'>
								<IconGasStation />
								<Caption medium>
									{formatMessage({
										id: 'label.save_on_gas_fees',
									})}
								</Caption>
							</Flex>
							<SwitchCaption
								onClick={() => switchNetwork(gnosisChain.id)}
							>
								{formatMessage({ id: 'label.switch_network' })}
							</SwitchCaption>
						</NetworkToast>
					)}
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
							disabled={!active}
						/>
					</DropdownContainer>
					<InputBox
						value={amountTyped}
						error={amountError}
						onChange={val => {
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
						disabled={!active}
					/>
				</SearchContainer>
				{selectedToken && (
					<AvText>
						{formatMessage({ id: 'label.available' })}:{' '}
						{formatBalance(selectedTokenBalance)} {tokenSymbol}
					</AvText>
				)}
			</InputContainer>

			{!noDonationSplit ? (
				<DonateToGiveth
					setDonationToGiveth={setDonationToGiveth}
					donationToGiveth={donationToGiveth}
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
					onClick={() => dispatch(setShowWalletModal(true))}
				/>
			)}

			<CheckBoxContainer>
				<CheckBox
					label={formatMessage({ id: 'label.make_it_anonymous' })}
					checked={anonymous}
					onChange={() => setAnonymous(!anonymous)}
					size={14}
				/>
				<div>
					{formatMessage({
						id: 'component.tooltip.by_checking_this',
					})}
				</div>
			</CheckBoxContainer>
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
`;

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 18px;
`;

const AvText = styled(GLink)`
	color: ${brandColors.deep[500]};
	padding: 4px 0 0 5px;
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

const NetworkToast = styled.div`
	display: flex;
	gap: 10px;
	width: 100%;
	margin-bottom: 9px;
	color: ${neutralColors.gray[800]};
	> :last-child {
		flex-shrink: 0;
	}
	> div:first-child > svg {
		flex-shrink: 0;
	}
	img {
		padding-right: 12px;
	}
`;

const SwitchCaption = styled(Caption)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	margin: 0 auto;
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
