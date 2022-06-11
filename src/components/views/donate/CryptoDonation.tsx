import styled from 'styled-components';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import BigNumber from 'bignumber.js';
import {
	Button,
	Caption,
	neutralColors,
	semanticColors,
	brandColors,
	GLink,
	B,
} from '@giveth/ui-design-system';
// @ts-ignore
import tokenAbi from 'human-standard-token-abi';

import { captureException } from '@sentry/nextjs';
import { Shadow } from '@/components/styled-components/Shadow';
import InputBox from './InputBox';
import CheckBox from '@/components/Checkbox';
import DonateModal from '@/components/modals/DonateModal';
import { mediaQueries } from '@/lib/constants/constants';
import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import { IProject } from '@/apollo/types/types';
import { fetchPrice } from '@/services/token';
import { switchNetwork } from '@/lib/wallet';
import GeminiModal from './GeminiModal';
import config from '@/configuration';
import TokenPicker from './TokenPicker';
import InlineToast from '@/components/toasts/InlineToast';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { client } from '@/apollo/apolloClient';
import { PROJECT_ACCEPTED_TOKENS } from '@/apollo/gql/gqlProjects';
import {
	formatBalance,
	formatTxLink,
	pollEvery,
	showToastError,
} from '@/lib/helpers';
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
import FailedDonation, {
	EDonationFailedType,
} from '@/components/modals/FailedDonation';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowSignWithWallet,
	setShowWalletModal,
} from '@/features/modal/modal.sclie';
import usePurpleList from '@/hooks/usePurpleList';

const ethereumChain = config.PRIMARY_NETWORK;
const xdaiChain = config.SECONDARY_NETWORK;
const stableCoins = [xdaiChain.mainToken, 'DAI', 'USDT'];
const POLL_DELAY_TOKENS = config.SUBGRAPH_POLLING_INTERVAL;

export interface ISuccessDonation {
	txHash: string;
	givBackEligible?: boolean;
}

interface IInputBox {
	error: boolean;
	focused: boolean;
}

const CryptoDonation = (props: {
	setSuccessDonation: (i: ISuccessDonation) => void;
	project: IProject;
}) => {
	const { chainId: networkId, account, library } = useWeb3React();
	const dispatch = useAppDispatch();
	const { isEnabled, isSignedIn, balance } = useAppSelector(
		state => state.user,
	);
	const ethPrice = useAppSelector(state => state.price.ethPrice);
	const isPurpleListed = usePurpleList();

	const { project, setSuccessDonation } = props;
	const { organization, verified, id: projectId, status } = project;
	const {
		supportCustomTokens,
		name: orgName,
		label: orgLabel,
	} = organization || {};
	const isActive = status?.name === EProjectStatus.ACTIVE;
	const mainTokenPrice = new BigNumber(ethPrice).toNumber();

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
	const [error, setError] = useState<boolean>(false);
	const [tokenIsGivBackEligible, setTokenIsGivBackEligible] =
		useState<boolean>();
	const [showDonateModal, setShowDonateModal] = useState(false);
	const [showInsufficientModal, setShowInsufficientModal] = useState(false);
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);
	const [acceptedTokens, setAcceptedTokens] =
		useState<IProjectAcceptedToken[]>();
	const [acceptedChains, setAcceptedChains] = useState<number[]>();
	const [failedModalType, setFailedModalType] =
		useState<EDonationFailedType>();
	const [txHash, setTxHash] = useState<string>();

	const stopPolling = useRef<any>(null);
	const tokenSymbol = selectedToken?.symbol;
	const isXdai = networkId === xdaiChain.id;
	const projectIsGivBackEligible = !!verified;

	useEffect(() => {
		if (networkId && acceptedTokens) {
			const filteredTokens = filterTokens(acceptedTokens, networkId);
			const networkIds = getNetworkIds(acceptedTokens);
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
				// coingecko doesn't have these tokens in xdai, so fetching price from ethereum
				if (isXdai && selectedToken.mainnetAddress) {
					tokenAddress = selectedToken.mainnetAddress || '';
				}
				const coingeckoChainId =
					!isXdai || selectedToken.mainnetAddress
						? ethereumChain.id
						: xdaiChain.id;
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
			selectedToken.symbol === xdaiChain.mainToken
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
		if (selectedTokenBalance < amountTyped!) {
			return setShowInsufficientModal(true);
		}
		if (!project.walletAddress) {
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
		!isActive ||
		!amountTyped ||
		amountTyped <= 0 ||
		!selectedToken ||
		error;

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
					setFailedModalType={setFailedModalType}
					setTxHash={setTxHash}
					project={project}
					token={selectedToken}
					amount={amountTyped}
					price={tokenPrice}
					anonymous={anonymous}
					givBackEligible={
						projectIsGivBackEligible && tokenIsGivBackEligible
					}
				/>
			)}
			{failedModalType && (
				<FailedDonation
					txUrl={formatTxLink(networkId, txHash)}
					setShowModal={() => setFailedModalType(undefined)}
					type={failedModalType}
				/>
			)}

			<InputContainer>
				{networkId &&
					acceptedChains &&
					!acceptedChains.includes(networkId) && (
						<NetworkToast>
							<div>
								<Caption medium>
									Projects from {orgName} only accept
									donations on{' '}
									{getNetworkNames(acceptedChains, 'and')}.
								</Caption>
							</div>
							<SwitchCaption
								onClick={() => switchNetwork(ethereumChain.id)}
							>
								Switch network
							</SwitchCaption>
						</NetworkToast>
					)}
				{networkId &&
					networkId === ethereumChain.id &&
					acceptedChains?.includes(xdaiChain.id) && (
						<NetworkToast>
							<div>
								<img src='/images/gas_station.svg' alt='gas' />
								<Caption medium>
									Save on gas fees, switch to Gnosis Chain.
								</Caption>
							</div>
							<SwitchCaption
								onClick={() => switchNetwork(xdaiChain.id)}
							>
								Switch network
							</SwitchCaption>
						</NetworkToast>
					)}
				<SearchContainer error={error} focused={inputBoxFocused}>
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
									? 'Search name or paste an address'
									: 'Search name'
							}
							projectVerified={project?.verified!}
						/>
					</DropdownContainer>
					<InputBox
						value={amountTyped}
						error={error}
						setError={setError}
						errorHandler={{
							condition: value => value >= 0 && value <= 0.000001,
							message: 'Set a valid amount',
						}}
						type='number'
						onChange={val => {
							const checkGIV = checkGIVTokenAvailability();
							if (/^0+(?=\d)/.test(String(val))) return;
							if (checkGIV) setAmountTyped(val);
						}}
						onFocus={(val: any) => setInputBoxFocused(!!val)}
						placeholder='Amount'
					/>
				</SearchContainer>
				{selectedToken && (
					<AvText>
						Available: {formatBalance(selectedTokenBalance)}{' '}
						{tokenSymbol}
					</AvText>
				)}
			</InputContainer>
			{selectedToken && (
				<GIVBackToast
					projectEligible={projectIsGivBackEligible}
					tokenEligible={tokenIsGivBackEligible}
					userEligible={!isPurpleListed}
				/>
			)}
			<CheckBoxContainer>
				<CheckBox
					title={'Make it anonymous'}
					checked={anonymous}
					onChange={() => setAnonymous(!anonymous)}
				/>
				<B>
					By checking this, we won't consider your profile information
					as a donor for this donation and won't show it on public
					pages.
				</B>
			</CheckBoxContainer>

			{!isActive && <InlineToast message='This project is not active.' />}

			{isEnabled && (
				<>
					<MainButton
						label='DONATE'
						disabled={donationDisabled}
						size='large'
						onClick={handleDonate}
					/>
					<AnotherWalletTxt>
						Want to use another wallet?{' '}
						<a onClick={() => dispatch(setShowWalletModal(true))}>
							Change Wallet
						</a>
					</AnotherWalletTxt>
				</>
			)}
			{!isEnabled && (
				<MainButton
					label='CONNECT WALLET'
					onClick={() => dispatch(setShowWalletModal(true))}
				/>
			)}
		</MainContainer>
	);
};

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
const SearchContainer = styled.div`
	display: flex;
	border: ${(props: IInputBox) =>
		props.error === true
			? `2px solid ${semanticColors.punch[500]}`
			: `2px solid ${neutralColors.gray[300]}`};
	border-radius: 6px;

	:focus,
	:visited,
	:active,
	:hover {
		border: 2px solid
			${(props: IInputBox) =>
				props.error === true
					? semanticColors.punch[500]
					: brandColors.giv[500]};
		box-shadow: ${Shadow.Neutral[500]};
	}
	${(props: IInputBox) =>
		props.focused &&
		`
		border: 2px solid ${brandColors.giv[500]};
		box-shadow: ${Shadow.Neutral[500]};
		`}
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
	margin-bottom: 20px;
	color: ${neutralColors.gray[800]};
	> :last-child {
		flex-shrink: 0;
	}
	> div:first-child {
		display: flex;
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
`;

const CheckBoxContainer = styled.div`
	margin: 24px 0;
	> div:nth-child(2) {
		color: ${neutralColors.gray[700]};
		font-size: 12px;
		margin-top: 10px;
	}
`;

const AnotherWalletTxt = styled(GLink)`
	font-size: 14px;
	color: ${neutralColors.gray[800]};
	padding: 16px 0;
	text-align: center;
	a {
		color: ${brandColors.pinky[500]};
		cursor: pointer;
	}
`;

export default CryptoDonation;
