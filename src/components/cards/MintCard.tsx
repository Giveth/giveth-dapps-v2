import {
	B,
	brandColors,
	Button,
	GLink,
	mediaQueries,
	P,
	semanticColors,
	Flex,
} from '@giveth/ui-design-system';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { erc20Abi, Abi, Address } from 'viem';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useSwitchChain } from 'wagmi';
import { readContracts, readContract } from '@wagmi/core';
import { MintModal } from '../modals/Mint/MintModal';
import { formatWeiHelper } from '@/helpers/number';
import config from '@/configuration';
import { abi as PFP_ABI } from '@/artifacts/pfpGiver.json';
import { InsufficientFundModal } from '../modals/InsufficientFund';
import { usePFPMintData } from '@/context/pfpmint.context';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { wagmiConfig } from '@/wagmiConfigs';
import { getReadContractResult } from '@/lib/contracts';
const MIN_NFT_QTY = 1;

interface IpfpContractData {
	price: bigint;
	maxMintAmount: number;
	totalSupply: number;
	maxSupply: number;
}

export const MintCard = () => {
	const [qtyNFT, setQtyNFT] = useState('1');
	const [errorMsg, setErrorMsg] = useState('');
	const [showMintModal, setShowMintModal] = useState(false);
	const [showInsufficientFundModal, setShowInsufficientFundModal] =
		useState(false);
	const [pfpData, setPfpData] = useState<IpfpContractData>();
	const [balance, setBalance] = useState<number>();

	const { chain } = useAccount();
	const chainId = chain?.id;
	const { switchChain } = useSwitchChain();
	const { formatMessage } = useIntl();
	const { open: openConnectModal } = useWeb3Modal();
	const { setQty, isEligible, setIsEligible } = usePFPMintData();
	const {
		handleSignOutAndShowWelcomeModal,
		isOnSolana,
		walletAddress,
		isOnEVM,
	} = useGeneralWallet();
	let mintLeft = '-';
	if (pfpData && balance !== undefined) {
		let mintAmount = pfpData.maxMintAmount - balance;
		if (mintAmount < 0) {
			mintLeft = '0';
		} else {
			mintLeft = mintAmount.toString();
		}
	}

	useEffect(() => {
		async function fetchData() {
			try {
				const baseParams = {
					address: config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS,
					chainId: config.MAINNET_NETWORK_NUMBER,
					abi: PFP_ABI as Abi,
				} as const;
				const result = await readContracts(wagmiConfig, {
					contracts: [
						{
							...baseParams,
							functionName: 'price',
						},
						{
							...baseParams,
							functionName: 'maxMintAmount',
						},
						{
							...baseParams,
							functionName: 'totalSupply',
						},
						{
							...baseParams,
							functionName: 'maxSupply',
						},
					],
				});
				const _price = getReadContractResult(result[0]) as bigint;
				const _maxMintAmount = getReadContractResult(
					result[1],
				) as number;
				const _totalSupply = getReadContractResult(result[2]) as number;
				const _maxSupply = getReadContractResult(result[3]) as number;
				setIsEligible(true);
				setPfpData({
					price: _price,
					maxMintAmount: _maxMintAmount || 0,
					totalSupply: _totalSupply || 0,
					maxSupply: _maxSupply || 0,
				});
			} catch (error) {
				console.log('failed to fetch GIversPFP data');
			}
		}
		fetchData();
	}, []);

	useEffect(() => {
		async function fetchData() {
			if (!walletAddress) return;
			try {
				const _balanceOf = await readContract(wagmiConfig, {
					address: config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS,
					chainId: config.MAINNET_NETWORK_NUMBER,
					abi: PFP_ABI as Abi,
					functionName: 'balanceOf',
					args: [walletAddress],
				});
				setBalance(Number(_balanceOf || '0'));
			} catch (error) {
				console.log('failed to fetch user balance data');
			}
		}
		fetchData();
	}, [walletAddress, chainId]);

	function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
		if (!pfpData?.maxMintAmount) return;
		//handle empty input
		if (event.target.value === '') setQtyNFT('');

		//handle number
		const _qty = Number.parseInt(event.target.value);

		if (Number.isInteger(_qty)) setQtyNFT('' + _qty);
	}

	const handleSwitchNetwork = () => {
		if (isOnSolana) {
			handleSignOutAndShowWelcomeModal();
		} else {
			switchChain?.({ chainId: config.MAINNET_NETWORK_NUMBER });
		}
	};

	useEffect(() => {
		//handle range
		const _qty = Number(qtyNFT);
		if (pfpData && _qty > pfpData.maxMintAmount)
			return setErrorMsg(
				'You can’t mint more than the max mint amount per transaction. ',
			);

		if (pfpData && balance && _qty + balance > pfpData.maxMintAmount)
			return setErrorMsg(
				`You cannot mint or own more than the maximum amount. This wallet holds ${balance} Givers NFT${
					balance > 1 ? 's' : ''
				}`,
			);

		if (_qty < MIN_NFT_QTY)
			return setErrorMsg('Specify an amount greater than 0');

		if (
			pfpData?.maxSupply &&
			pfpData?.totalSupply &&
			_qty > pfpData?.maxSupply - pfpData?.totalSupply
		)
			return setErrorMsg('Oops! You can’t mint over current NFT supply.');

		setErrorMsg('');
	}, [balance, pfpData, qtyNFT]);

	async function handleMint() {
		if (
			isOnSolana ||
			!config.MAINNET_CONFIG.DAI_TOKEN_ADDRESS ||
			!pfpData?.price ||
			!walletAddress
		)
			return;

		const userDaiBalance = await readContract(wagmiConfig, {
			address: config.MAINNET_CONFIG.DAI_TOKEN_ADDRESS,
			chainId: config.MAINNET_NETWORK_NUMBER,
			abi: erc20Abi,
			functionName: 'balanceOf',
			args: [walletAddress as Address],
		});

		const total = pfpData.price * BigInt(qtyNFT);
		if (total <= userDaiBalance) {
			setQty(Number(qtyNFT));
			setShowMintModal(true);
		} else {
			setShowInsufficientFundModal(true);
		}
	}

	return (
		<>
			<MintCardContainer>
				<InputWrapper gap='8px' $flexDirection='column'>
					<Flex $justifyContent='space-between'>
						<GLink size='Small'>Amount of NFTs to mint</GLink>
						<MaxLink
							size='Small'
							onClick={() =>
								setQtyNFT(
									pfpData && balance !== undefined
										? mintLeft
										: '',
								)
							}
						>
							MAX
						</MaxLink>
					</Flex>
					<StyledInput
						as='input'
						type='number'
						value={qtyNFT}
						onChange={onChangeHandler}
						hasError={!!errorMsg}
					/>
					<InputHint>
						{pfpData?.totalSupply
							? pfpData.totalSupply.toString()
							: '-'}
						/
						{pfpData?.maxSupply
							? pfpData.maxSupply.toString()
							: '-'}{' '}
						Minted
					</InputHint>
					<ErrorPlaceHolder>{errorMsg}</ErrorPlaceHolder>
				</InputWrapper>
				<InfoBox gap='16px' $flexDirection='column'>
					<Flex $justifyContent='space-between'>
						<InfoBoxTitle>Max Mint Amount</InfoBoxTitle>
						<InfoBoxValue>
							{pfpData && balance !== undefined && isOnEVM
								? mintLeft
								: '-'}
						</InfoBoxValue>
					</Flex>
					<Flex $justifyContent='space-between'>
						<InfoBoxTitle>Mint price per NFT</InfoBoxTitle>
						<InfoBoxValue>
							{pfpData?.price
								? formatWeiHelper(pfpData.price.toString())
								: '-'}{' '}
							DAI
						</InfoBoxValue>
					</Flex>
				</InfoBox>
				{!walletAddress ? (
					<MintButton
						size='small'
						label={formatMessage({
							id: 'component.button.connect_wallet',
						})}
						buttonType='primary'
						onClick={() => openConnectModal?.()}
					/>
				) : chainId !== config.MAINNET_NETWORK_NUMBER ? (
					<MintButton
						size='small'
						label={formatMessage({ id: 'label.switch_network' })}
						buttonType='primary'
						onClick={handleSwitchNetwork}
					/>
				) : (
					<MintButton
						size='small'
						label={formatMessage({ id: 'label.mint' })}
						buttonType='primary'
						onClick={handleMint}
						disabled={
							Number(qtyNFT) < 1 ||
							!pfpData ||
							!!errorMsg ||
							!isEligible
						}
					/>
				)}
			</MintCardContainer>
			{showMintModal && (
				<MintModal
					setShowModal={setShowMintModal}
					qty={Number(qtyNFT)}
					nftPrice={pfpData?.price}
				/>
			)}
			{showInsufficientFundModal && (
				<InsufficientFundModal
					setShowModal={setShowInsufficientFundModal}
				/>
			)}
		</>
	);
};

const MintCardContainer = styled.div`
	padding: 24px;
	background-color: ${brandColors.giv[800]};
	border-radius: 8px;
	position: relative;
	z-index: 2;
	width: 100%;
	${mediaQueries.tablet} {
		max-width: 458px;
	}
`;

const InputWrapper = styled(Flex)`
	margin-bottom: 16px;
`;

interface IStyledInput {
	hasError: boolean;
}

const StyledInput = styled(P)<IStyledInput>`
	padding: 15px 16px;
	width: 100%;
	color: ${props =>
		props.hasError ? semanticColors.punch[500] : brandColors.giv[200]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid
		${props =>
			props.hasError ? semanticColors.punch[500] : brandColors.giv[500]};
	border-radius: 8px;
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	-moz-appearance: textfield;
`;

const MaxLink = styled(GLink)`
	color: ${semanticColors.blueSky[500]};
	cursor: pointer;
`;

const InputHint = styled(GLink)`
	color: ${brandColors.deep[100]};
`;

const InfoBox = styled(Flex)`
	margin-bottom: 32px;
`;

const InfoBoxTitle = styled(B)`
	color: ${brandColors.giv[300]};
`;

const InfoBoxValue = styled(B)`
	color: ${brandColors.giv['000']};
`;

const MintButton = styled(Button)`
	margin: auto;
	width: 100%;
	max-width: 332px;
`;

const ErrorPlaceHolder = styled(GLink)`
	min-height: 44px;
	color: ${semanticColors.punch[700]};
`;
