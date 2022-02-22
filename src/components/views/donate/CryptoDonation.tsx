import styled from 'styled-components';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import InputBox from '../../InputBox';
import { useWeb3React } from '@web3-react/core';
import { Contract } from '@ethersproject/contracts';
import { useQuery } from '@apollo/client';
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
import useUser from '@/context/UserProvider';
import FixedToast from '@/components/FixedToast';
import CheckBox from '@/components/Checkbox';
import WalletModal from '@/components/modals/WalletModal';
import DonateModal from '@/components/modals/DonateModal';
import { InsufficientFundModal } from '@/components/modals/InsufficientFund';
import { WelcomeSigninModal } from '@/components/modals/WelcomeSigninModal';
import { IProject } from '../../../apollo/types/types';
import { getERC20Info } from '../../../lib/contracts';
import { getERC20List, pollEvery } from '../../../utils';
import { fetchPrice } from '../../../services/token';
import { switchNetwork } from '@/lib/wallet';
import { usePrice } from '@/context/price.context';
import GeminiModal from './GeminiModal';
import config from '@/configuration';

// @ts-ignore
import tokenAbi from 'human-standard-token-abi';

import TokenPicker from './TokenPicker';

const ethereumChain = config.PRIMARY_NETWORK;
const xdaiChain = config.SECONDARY_NETWORK;
const xdaiExcluded = config.XDAI_EXCLUDED_COINS;
const stableCoins = [xdaiChain.mainToken, 'DAI', 'USDT'];
const POLL_DELAY_TOKENS = config.SUBGRAPH_POLLING_INTERVAL;

type SuccessFunction = (param: boolean) => void;

interface IInputBox {
	error: boolean;
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

interface IToken {
	name: string;
	chainId: number;
	symbol: string;
	icon?: string;
}

interface ISuccessDonation {
	transactionHash: string;
	tokenSymbol: string;
	subtotal: number;
	givBackEligible?: boolean;
	tooSlow?: boolean;
}

const customStyles = {
	control: () => ({
		// match with the menu
		borderRadius: '0 !important',
		borderRightColor: 'transparent !important',
		padding: '8px 0 0 16px !important',
	}),
	menu: (base: any) => ({
		...base,
		// override border radius to match the box
		borderRadius: 0,
		// beautify the word cut by adding a dash see https://caniuse.com/#search=hyphens for the compatibility
		hyphens: 'auto',
		// kill the gap
		marginTop: 0,
		textAlign: 'left',
		// prevent menu to scroll y
		wordWrap: 'break-word',
		width: '280px',
	}),
	menuList: (base: any) => ({
		...base,
		borderRadius: 0,
		// kill the white space on first and last option
		padding: 0,
	}),
	singleValue: (base: any) => ({
		...base,
		padding: 0,
	}),
};

const CryptoDonation = (props: {
	setSuccessDonation: SuccessFunction;
	project: IProject;
}) => {
	const { chainId, account, library } = useWeb3React();
	const {
		state: { isSignedIn, isEnabled, user, balance },
		actions: { signIn },
	} = useUser();
	const { project, setSuccessDonation } = props;
	const { ethPrice } = usePrice();
	const mainTokenPrice = new BigNumber(ethPrice).toNumber();
	const networkId = chainId;
	const [selectedToken, setSelectedToken] = useState<ISelectObj>();
	const [selectedTokenBalance, setSelectedTokenBalance] = useState<any>();
	const [customInput, setCustomInput] = useState<any>();
	const [tokenPrice, setTokenPrice] = useState<number>(1);
	const [amountTyped, setAmountTyped] = useState('');
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

	const tokenSymbol = selectedToken?.symbol;
	const isXdai = networkId === xdaiChain.id;
	const isGivingBlockProject = project?.givingBlocksId;
	const stopPolling = useRef<any>(null);
	const isGivBackEligible = givBackEligible && project?.verified;

	// Checks network changes to fetch proper token list
	useEffect(() => {
		if (networkId) {
			let netId = networkId as Number | string;
			if (isGivingBlockProject) netId = 'thegivingblock';
			if (isGivingBlockProject && networkId === 3)
				netId = 'ropsten_thegivingblock';
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
				var tokenA = a.name.toUpperCase();
				var tokenB = b.name.toUpperCase();
				return tokenA < tokenB ? -1 : tokenA > tokenB ? 1 : 0;
			});
			if (givToken) {
				tokens.splice(0, 0, givToken);
			}
			setErc20List(tokens);
			setErc20OriginalList(tokens);
			setSelectedToken(tokens[0]);
		}
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
			} else if (selectedToken?.address && selectedToken.address) {
				let chain = xdaiChain.name;
				let tokenAddress: string | undefined = selectedToken.address;
				if (isXdai) {
					// coingecko doesn't have these tokens in xdai, so fetching price from ethereum
					if (xdaiExcluded.includes(selectedToken.symbol!)) {
						tokenAddress = selectedToken.ethereumAddress;
						chain = ethereumChain.name;
					}
				} else {
					chain = ethereumChain.name;
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
		if (!selectedToken?.address) {
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
					givBackEligible={isGivBackEligible}
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
				<SearchContainer error={error}>
					<DropdownContainer>
						<TokenPicker
							tokenList={erc20List}
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
											setCustomInput(pastedToken?.symbol);
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
						error={error}
						setError={setError}
						errorHandler={{
							condition: (value: any) =>
								value >= 0 && value <= 0.0001,
							message: 'Set a valid amount',
						}}
						type='number'
						onChange={val => {
							const checkGIV = checkGIVTokenAvailability();
							if (checkGIV) setAmountTyped(val);
						}}
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
			{!givBackEligible ? (
				<ToastContainer>
					<FixedToast
						message='This token is not eligible for GIVbacks.'
						color={brandColors.mustard[500]}
						boldColor={brandColors.mustard[600]}
						backgroundColor={brandColors.mustard[200]}
						href='/givbacks'
					/>
				</ToastContainer>
			) : (
				<ToastContainer>
					<FixedToast
						message='This token is eligible for GIVbacks.'
						color={brandColors.giv[300]}
						boldColor={brandColors.giv[600]}
						backgroundColor={brandColors.giv[100]}
						href='/givbacks'
					/>
				</ToastContainer>
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
				<WelcomeSigninModal
					showModal={true}
					setShowModal={() => setShowWelcomeSignin(false)}
				/>
			)}

			{isEnabled && (
				<>
					<MainButton
						label='DONATE'
						disabled={!amountTyped || parseInt(amountTyped) < 0}
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
			{!isEnabled && (
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

	:active,
	:hover {
		border: 2px solid
			${(props: IInputBox) =>
				props.error === true
					? semanticColors.punch[500]
					: brandColors.giv[500]};
	}
`;
const DropdownContainer = styled.div`
	width: 35%;
	height: 54px;
`;
const XDaiContainer = styled.div`
	display: flex;
	flex: row;
	justify-content: space-between;
	padding: 8px 16px 18.5px 16px;
	border-radius: 8px;
	div:first-child {
		display: flex;
		flex-direction: row;
		color: ${neutralColors.gray[800]};
	}
	img {
		padding-right: 12px;
	}
`;
const SwitchCaption = styled(Caption)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
	padding: 0 0 0 12px;
`;

const MainButton = styled(Button)`
	width: 100%;
	background-color: ${props =>
		props.disabled ? brandColors.giv[200] : brandColors.giv[500]};
	color: white;
`;

const CheckBoxContainer = styled.div`
	margin: 24px 0;
	div:nth-child(2) {
		color: ${neutralColors.gray[700]};
		font-size: 12px;
		margin: 4px 0 0 50px;
		width: 422px;
	}
`;

const ToastContainer = styled.div`
	margin: 12px 0;
`;

const AnotherWalletTxt = styled(GLink)`
	font-size 14px;
	color: ${neutralColors.gray[800]};
	padding: 16px 0;
	text-align: center;
	a {
		color: ${brandColors.pinky[500]};
		cursor: pointer;
	}
`;

export default CryptoDonation;
