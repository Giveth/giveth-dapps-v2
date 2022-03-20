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

import { Shadow } from '@/components/styled-components/Shadow';
import InputBox from '../../InputBox';
import useUser from '@/context/UserProvider';
import FixedToast from '@/components/toasts/FixedToast';
import CheckBox from '@/components/Checkbox';
import WalletModal from '@/components/modals/WalletModal';
import DonateModal from '@/components/modals/DonateModal';
import { ChangeNetworkModal } from '@/components/modals/ChangeNetwork';
import { mediaQueries } from '@/utils/constants';
import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import { SignWithWalletModal } from '@/components/modals/SignWithWalletModal';
import { IProject } from '@/apollo/types/types';
import { getERC20Info } from '@/lib/contracts';
import { getERC20List, pollEvery } from '@/utils';
import { fetchPrice } from '@/services/token';
import { switchNetwork } from '@/lib/wallet';
import { usePrice } from '@/context/price.context';
import GeminiModal from './GeminiModal';
import config from '@/configuration';

// @ts-ignore
import tokenAbi from 'human-standard-token-abi';

import TokenPicker from './TokenPicker';
import Routes from '@/lib/constants/Routes';
import InlineToast from '@/components/toasts/InlineToast';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

const ethereumChain = config.PRIMARY_NETWORK;
const xdaiChain = config.SECONDARY_NETWORK;
const xdaiExcluded = config.XDAI_EXCLUDED_COINS;
const stableCoins = [xdaiChain.mainToken, 'DAI', 'USDT'];
const POLL_DELAY_TOKENS = config.SUBGRAPH_POLLING_INTERVAL;

interface ISuccessDonation {
	transactionHash: string;
	tokenSymbol: string;
	subtotal: number;
	givBackEligible?: boolean;
	tooSlow?: boolean;
}

interface IInputBox {
	error: boolean;
	focused: boolean;
}

interface ISelectObj {
	value: string;
	label: string;
	chainId?: number;
	symbol?: string;
	icon?: string;
	address?: string;
	ethereumAddress?: string;
	decimals?: number;
}

const CryptoDonation = (props: {
	setSuccessDonation: any;
	project: IProject;
}) => {
	const { chainId, account, library } = useWeb3React();
	const {
		state: { isSignedIn, isEnabled, balance },
	} = useUser();
	const { ethPrice } = usePrice();

	const { project, setSuccessDonation } = props;
	const isActive = project.status?.name === EProjectStatus.ACTIVE;
	const mainTokenPrice = new BigNumber(ethPrice).toNumber();
	const networkId = chainId;

	const [selectedToken, setSelectedToken] = useState<ISelectObj>();
	const [selectedTokenBalance, setSelectedTokenBalance] = useState<any>();
	const [customInput, setCustomInput] = useState<any>();
	const [tokenPrice, setTokenPrice] = useState<number>(1);
	const [amountTyped, setAmountTyped] = useState('');
	const [inputBoxFocused, setInputBoxFocused] = useState(false);
	const [geminiModal, setGeminiModal] = useState(false);
	const [txHash, setTxHash] = useState<any>();
	const [erc20List, setErc20List] = useState<any>();
	const [erc20OriginalList, setErc20OriginalList] = useState<any>();
	// TODO: Set this to a better flow, gotta discuss with design team but it is needed
	const [unconfirmed, setUnconfirmed] = useState<any>();
	const [inProgress, setInProgress] = useState<any>();
	const [anonymous, setAnonymous] = useState<boolean>(false);
	// const [selectLoading, setSelectLoading] = useState(false);
	const [error, setError] = useState<boolean>(false);
	const [givBackEligible, setGivBackEligible] = useState(true);
	const [showWalletModal, setShowWalletModal] = useState(false);
	const [showDonateModal, setShowDonateModal] = useState(false);
	const [showInsufficientModal, setShowInsufficientModal] = useState(false);
	const [showWelcomeSignin, setShowWelcomeSignin] = useState<boolean>(false);
	const [showChangeNetworkModal, setShowChangeNetworkModal] = useState(false);

	const tokenSymbol = selectedToken?.symbol;
	const isXdai = networkId === xdaiChain.id;
	const isGivingBlockProject = project?.givingBlocksId;
	const stopPolling = useRef<any>(null);
	const projectIsGivBackEligible = givBackEligible && project?.verified;
	const givingBlockReady = isGivingBlockProject
		? networkId === ethereumChain.id
		: true;
	// Checks network changes to fetch proper token list
	useEffect(() => {
		let netId = networkId as Number | string;
		// Show change network modal when needed'
		if (
			netId !== 'thegivingblock' &&
			netId !== 'rapsten_thegivingblock' &&
			netId !== config.PRIMARY_NETWORK.id &&
			netId !== config.SECONDARY_NETWORK.id
		) {
			return setShowChangeNetworkModal(true);
		}
		let givIndex: number | undefined;
		const erc20List: any = getERC20List(netId).tokens;
		const tokens = erc20List.map((token: any, index: any) => {
			token.value = token;
			token.label = token.symbol;
			if (
				token.symbol === 'GIV' ||
				token.symbol === 'TestGIV' ||
				token.name === 'Giveth'
			) {
				givIndex = index;
			}
			return token;
		});
		const givToken = erc20List[givIndex!];
		if (givToken && givIndex) {
			tokens.splice(givIndex, 1);
		}
		tokens?.sort((a: any, b: any) => {
			const tokenA = a.name.toUpperCase();
			const tokenB = b.name.toUpperCase();
			return tokenA < tokenB ? -1 : tokenA > tokenB ? 1 : 0;
		});
		if (givToken) {
			tokens.splice(0, 0, givToken);
		}
		setErc20List(tokens);
		setErc20OriginalList(tokens);
		setSelectedToken(tokens[0]);
	}, [networkId]);

	// Polls selected token data
	useEffect(() => {
		if (isEnabled) pollToken();
		return () => clearPoll();
	}, [selectedToken, isEnabled, account, networkId, balance]);

	// Gets price of selected token
	useEffect(() => {
		const setPrice = async () => {
			if (
				selectedToken?.symbol &&
				stableCoins.includes(selectedToken.symbol)
			) {
				setTokenPrice(1);
			} else if (selectedToken?.address) {
				let chain = ethereumChain.name.split(' ')[0].toLowerCase();
				let tokenAddress: string | undefined = selectedToken.address;
				if (isXdai) {
					// coingecko doesn't have these tokens in xdai, so fetching price from ethereum
					if (xdaiExcluded.includes(selectedToken.symbol!)) {
						tokenAddress = selectedToken.ethereumAddress;
					} else {
						chain = xdaiChain.name.toLowerCase();
					}
				}
				const fetchedPrice = await fetchPrice(
					chain?.toLowerCase(),
					tokenAddress,
					setTokenPrice,
				);
				fetchedPrice && setTokenPrice(fetchedPrice);
			} else if (
				selectedToken?.symbol &&
				selectedToken.symbol === ethereumChain.mainToken
			) {
				mainTokenPrice && setTokenPrice(mainTokenPrice);
			}
		};
		setPrice();
	}, [selectedToken, mainTokenPrice]);

	// Gets GAS price
	// useEffect(() => {
	// 	library?.getGasPrice().then((wei: any) => {
	// 		const ethFromWei = formatEther(isXdai ? '1' : Number(wei));
	// 		const gwei = isXdai ? 1 : formatUnits(wei, 'gwei');
	// 		gwei && setGasPrice(Number(gwei));
	// 		ethFromWei && setGasETHPrice(Number(ethFromWei) * 21000);
	// 	});

	// }, [networkId, selectedToken]);

	const checkGIVTokenAvailability = () => {
		if (!isGivingBlockProject) return true;
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
		// Native token balance is provided by the Web3Provider
		if (
			!selectedToken?.address ||
			selectedToken.symbol === 'XDAI' ||
			selectedToken.symbol === 'ETH'
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

	return (
		<MainContainer>
			<GeminiModal
				showModal={geminiModal}
				setShowModal={setGeminiModal}
			/>
			{showChangeNetworkModal && (
				<ChangeNetworkModal
					showModal={showChangeNetworkModal}
					setShowModal={setShowChangeNetworkModal}
					targetNetwork={
						isGivingBlockProject
							? config.MAINNET_NETWORK_NUMBER
							: config.XDAI_NETWORK_NUMBER
					}
				/>
			)}
			{showInsufficientModal && (
				<InsufficientFundModal
					showModal={showInsufficientModal}
					setShowModal={setShowInsufficientModal}
				/>
			)}
			{showWalletModal && !txHash && (
				<WalletModal
					showModal={showWalletModal}
					setShowModal={setShowWalletModal}
				/>
			)}
			{showDonateModal && selectedToken && amountTyped && (
				<DonateModal
					showModal={showDonateModal}
					setShowModal={setShowDonateModal}
					setSuccessDonation={(successTxHash: ISuccessDonation) => {
						setSuccessDonation(successTxHash);
						setTxHash(successTxHash);
					}}
					project={project}
					token={selectedToken}
					userTokenBalance={selectedTokenBalance}
					amount={parseFloat(amountTyped)}
					price={tokenPrice}
					setInProgress={setInProgress}
					setUnconfirmed={setUnconfirmed}
					givBackEligible={projectIsGivBackEligible}
					anonymous={anonymous}
				/>
			)}

			<InputContainer>
				{isGivingBlockProject &&
					networkId !== config.PRIMARY_NETWORK.id && (
						<XDaiContainer>
							<div>
								<img src='/images/gas_station.svg' />
								<Caption color={neutralColors.gray[900]}>
									Projects from The Giving Block only accept
									donations on mainnet.{' '}
								</Caption>
							</div>
							<SwitchCaption
								style={{}}
								onClick={() => switchNetwork(1)}
							>
								Switch network
							</SwitchCaption>
						</XDaiContainer>
					)}
				{!isGivingBlockProject &&
					isEnabled &&
					networkId !== xdaiChain.id && (
						<XDaiContainer>
							<div>
								<img src='/images/gas_station.svg' />
								<Caption color={neutralColors.gray[900]}>
									Save on gas fees, switch to xDAI network.
								</Caption>
							</div>
							<SwitchCaption
								onClick={() => switchNetwork(100)}
								style={{
									textAlign: 'right',
								}}
							>
								Switch network
							</SwitchCaption>
						</XDaiContainer>
					)}
				<SearchContainer error={error} focused={inputBoxFocused}>
					<DropdownContainer>
						<TokenPicker
							tokenList={Array.from(new Set(erc20List))}
							selectedToken={selectedToken}
							inputValue={customInput}
							onChange={(i: any) => {
								// setSelectedToken(i || selectedToken)
								setSelectedToken(i);
								// setIsComponentVisible(false)
								setCustomInput('');
								setErc20List(erc20OriginalList);
								let givBackEligibilty: any =
									erc20OriginalList?.find(
										(t: any) => t?.symbol === i?.symbol,
									);
								if (
									i?.symbol?.toUpperCase() ===
										ethereumChain.mainToken ||
									i?.symbol?.toUpperCase() ===
										xdaiChain.mainToken
								) {
									givBackEligibilty = true;
								}
								setGivBackEligible(givBackEligibilty);
							}}
							onInputChange={(i: string) => {
								// It's a contract
								if (i?.length === 42) {
									try {
										// setSelectLoading(true);
										getERC20Info({
											library,
											tokenAbi,
											contractAddress: i,
											chainId: networkId!,
										}).then(pastedToken => {
											if (!pastedToken) return;
											const found = erc20List?.find(
												(t: any) =>
													t?.symbol ===
													pastedToken?.symbol,
											);
											!found &&
												setErc20List([
													...erc20List,
													pastedToken,
												]);
											setCustomInput(
												pastedToken?.address,
											);
											// setSelectLoading(false);
										});
									} catch (error) {
										// setSelectLoading(false);
										console.log({ error });
									}
								} else {
									setCustomInput(i);
									erc20OriginalList &&
										erc20OriginalList?.length > 0 &&
										setErc20List([...erc20OriginalList]);
								}
							}}
							placeholder={
								isGivingBlockProject
									? 'Search name'
									: 'Search name or paste an address'
							}
						/>
					</DropdownContainer>
					<InputBox
						// onChange={a => {
						//   setShowDonateModal(false)
						//   setAmountTyped(a)
						// }}}
						value={amountTyped}
						error={error}
						setError={setError}
						errorHandler={{
							condition: (value: any) =>
								value >= 0 && value <= 0.000001,
							message: 'Set a valid amount',
						}}
						type='number'
						onChange={val => {
							const checkGIV = checkGIVTokenAvailability();
							if (/^0+(?=\d)/.test(val)) return;
							if (checkGIV) setAmountTyped(val);
						}}
						onFocus={(val: any) => setInputBoxFocused(!!val)}
						placeholder='Amount'
					/>
				</SearchContainer>
				<AvText>
					{' '}
					Available:{' '}
					{parseFloat(selectedTokenBalance || 0).toLocaleString(
						'en-US',
						{
							minimumFractionDigits: 2,
							maximumFractionDigits: 6,
						} || '',
					)}{' '}
					{tokenSymbol}
				</AvText>
			</InputContainer>
			{!givBackEligible && projectIsGivBackEligible ? (
				<ToastContainer>
					<FixedToast
						message='This token is not eligible for GIVbacks.'
						color={brandColors.mustard[700]}
						boldColor={brandColors.mustard[800]}
						backgroundColor={brandColors.mustard[200]}
						href={Routes.GIVbacks}
					/>
				</ToastContainer>
			) : (
				projectIsGivBackEligible && (
					<ToastContainer>
						<FixedToast
							message='This token is eligible for GIVbacks.'
							color={brandColors.giv[300]}
							boldColor={brandColors.giv[600]}
							backgroundColor={brandColors.giv[100]}
							href={Routes.GIVbacks}
						/>
					</ToastContainer>
				)
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

			{showWelcomeSignin && (
				<SignWithWalletModal
					showModal={true}
					setShowModal={() => setShowWelcomeSignin(false)}
				/>
			)}

			{!isActive && <InlineToast message='This project is not active.' />}

			{isEnabled && givingBlockReady && (
				<>
					<MainButton
						label='DONATE'
						disabled={
							!isActive ||
							!amountTyped ||
							parseInt(amountTyped) < 0
						}
						size='large'
						onClick={() => {
							if (selectedTokenBalance < amountTyped) {
								return setShowInsufficientModal(true);
							}
							if (!isSignedIn && isEnabled) {
								setShowWelcomeSignin(true);
							}
							setShowDonateModal(true);
						}}
					/>
					<AnotherWalletTxt>
						Want to use another wallet?{' '}
						<a onClick={() => setShowWalletModal(true)}>
							Change Wallet
						</a>
					</AnotherWalletTxt>
				</>
			)}
			{!isEnabled && !givingBlockReady && (
				<MainButton
					label='CONNECT WALLET'
					onClick={() => setShowWalletModal(true)}
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
`;
const AvText = styled(GLink)`
	color: ${brandColors.deep[500]};
	padding: 4px 0 0 5px;
`;
const SearchContainer = styled.div`
	display: flex;
	flex-direction: row;
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
	${mediaQueries.mobileL} {
		width: 50%;
	}
`;

const XDaiContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 18.5px 0;
	border-radius: 8px;
	align-items: center;
	word-wrap: break-word;
	width: 100%;
	div:first-child {
		display: flex;
		flex-direction: row;
		color: ${neutralColors.gray[800]};
	}
	img {
		padding-right: 12px;
	}
	${mediaQueries.mobileL} {
		flex-direction: column;
		align-items: center;
		margin-bottom: 20px;
		div:first-child {
			text-align: center;
		}
	}
`;

const SwitchCaption = styled(Caption)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	padding: 0 0 0 12px;
	word-wrap: break-word;
	width: 120px;
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
	${mediaQueries['mobileM']} {
		div:nth-child(2) {
			margin: 14px 0 0 0;
		}
	}
	${mediaQueries['mobileS']} {
		div:nth-child(2) {
			margin: 14px 0 0 0;
		}
	}
`;

const ToastContainer = styled.div`
	margin: 12px 0;
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
