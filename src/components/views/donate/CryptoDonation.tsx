import styled from 'styled-components';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { useIntl } from 'react-intl';
import {
	brandColors,
	Button,
	GLink,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
// @ts-ignore
import tokenAbi from 'human-standard-token-abi';
import { captureException } from '@sentry/nextjs';
import { BigNumber } from '@ethersproject/bignumber';
import { BigNumberish, utils } from 'ethers';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { Shadow } from '@/components/styled-components/Shadow';
import InputBox from './InputBox';
import CheckBox from '@/components/Checkbox';
import DonateModal from '@/components/modals/DonateModal';
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
import {
	filterTokens,
	getNetworkIds,
	prepareTokenList,
} from '@/components/views/donate/helpers';
import { ORGANIZATION } from '@/lib/constants/organizations';
import { getERC20Info } from '@/lib/contracts';
import GIVBackToast from '@/components/views/donate/GIVBackToast';
import { DonateWrongNetwork } from '@/components/modals/DonateWrongNetwork';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import usePurpleList from '@/hooks/usePurpleList';
import DonateToGiveth from '@/components/views/donate/DonateToGiveth';
import TotalDonation from '@/components/views/donate/TotalDonation';
import SaveGasFees from '@/components/views/donate/SaveGasFees';
import SwitchToAcceptedChain from '@/components/views/donate/SwitchToAcceptedChain';
import { useDonateData } from '@/context/donate.context';
import { useModalCallback } from '@/hooks/useModalCallback';
import EstimatedMatchingToast from '@/components/views/donate/EstimatedMatchingToast';

const POLL_DELAY_TOKENS = config.SUBGRAPH_POLLING_INTERVAL;

interface IInputBox {
	error: boolean;
	focused: boolean;
}

const CryptoDonation: FC = () => {
	const { chainId: networkId, account, library, active } = useWeb3React();
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();
	const { isEnabled, isSignedIn, balance } = useAppSelector(
		state => state.user,
	);
	const isPurpleListed = usePurpleList();

	const { project, hasActiveQFRound } = useDonateData();

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

	const [selectedToken, setSelectedToken] = useState<IProjectAcceptedToken>();
	const [selectedTokenBalance, setSelectedTokenBalance] =
		useState<BigNumberish>(BigNumber.from(0));
	const [customInput, setCustomInput] = useState<any>();
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
	const { modalCallback: signInThenDonate } = useModalCallback(() =>
		setShowDonateModal(true),
	);

	const stopPolling = useRef<any>(null);
	const tokenSymbol = selectedToken?.symbol;
	const tokenDecimals = selectedToken?.decimals || 18;
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
	}, [selectedToken, isEnabled, account, balance]);

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
			return setSelectedTokenBalance(BigNumber.from(0));
		}
		// Native token balance is provided by the Web3Provider
		const _selectedTokenSymbol = selectedToken.symbol.toUpperCase();
		const nativeCurrency =
			config.NETWORKS_CONFIG[networkId!]?.nativeCurrency;
		if (_selectedTokenSymbol === nativeCurrency.symbol.toUpperCase()) {
			return setSelectedTokenBalance(
				utils.parseUnits(balance || '0', nativeCurrency.decimals),
			);
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
						const balance: BigNumber = await instance.balanceOf(
							account,
						);
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
				onResult: (_balance: BigNumber) => {
					if (_balance && !_balance.eq(selectedTokenBalance)) {
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
		if (
			parseUnits(String(totalDonation), tokenDecimals).gt(
				selectedTokenBalance,
			)
		) {
			return setShowInsufficientModal(true);
		}
		if (!isSignedIn) {
			signInThenDonate();
		} else {
			setShowDonateModal(true);
		}
	};

	const donationDisabled =
		!isActive || !amountTyped || !selectedToken || amountError;

	return (
		<MainContainer>
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
						{formatBalance(
							formatUnits(selectedTokenBalance, tokenDecimals),
						)}{' '}
						{tokenSymbol}
					</AvText>
				)}
			</InputContainer>

			{hasActiveQFRound && (
				<EstimatedMatchingToast
					projectData={project}
					token={selectedToken}
					amountTyped={amountTyped}
				/>
			)}

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
