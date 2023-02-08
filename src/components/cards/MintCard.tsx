import {
	B,
	brandColors,
	Button,
	GLink,
	mediaQueries,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Contract } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import { MintModal } from '../modals/MintModal';
import { Flex } from '../styled-components/Flex';
import { useAppDispatch } from '@/features/hooks';
import { formatWeiHelper } from '@/helpers/number';
import { ERC20, GiversPFP } from '@/types/contracts';
import { abi as ERC20_ABI } from '@/artifacts/ERC20.json';
import { switchNetwork } from '@/lib/metamask';
import config from '@/configuration';
import { abi as PFP_ABI } from '@/artifacts/pfpGiver.json';
import { InsufficientFundModal } from '../modals/InsufficientFund';
import { usePFPMintData } from '@/context/pfpmint.context';

const MIN_NFT_QTY = 1;

interface IPFPData {
	price: BigNumber;
	maxMintAmount: number;
	totalSupply: number;
	maxSupply: number;
}

export const MintCard = () => {
	const [qtyNFT, setQtyNFT] = useState('1');
	const [showMintModal, setShowMintModal] = useState(false);
	const [showInsufficientFundModal, setShowInsufficientFundModal] =
		useState(false);
	const [pfpData, setPfpData] = useState<IPFPData>();
	const { account, library, chainId } = useWeb3React();
	const { formatMessage } = useIntl();
	const dispatch = useAppDispatch();
	const { setQty } = usePFPMintData();

	useEffect(() => {
		if (!library) return;
		async function fetchData() {
			try {
				const _provider =
					chainId === config.MAINNET_NETWORK_NUMBER
						? library
						: new JsonRpcProvider(config.MAINNET_CONFIG.nodeUrl);
				const PFPContract = new Contract(
					config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS ?? '',
					PFP_ABI,
					_provider,
				) as GiversPFP;
				const _price = await PFPContract.price();
				const _maxMintAmount = await PFPContract.maxMintAmount();
				const _totalSupply = await PFPContract.totalSupply();
				const _maxSupply = await PFPContract.maxSupply();
				setPfpData({
					price: new BigNumber(_price.toString()),
					maxMintAmount: _maxMintAmount,
					totalSupply: _totalSupply.toNumber(),
					maxSupply: _maxSupply.toNumber(),
				});
			} catch (error) {
				console.log('failed to fetch GIversPFP data');
			}
		}
		fetchData();
	}, [library]);

	function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
		if (!pfpData?.maxMintAmount) return;
		//handle empty input
		if (event.target.value === '') setQtyNFT('');

		//handle number
		const _qty = Number.parseInt(event.target.value);

		//handle range
		if (_qty > pfpData.maxMintAmount || _qty < MIN_NFT_QTY) return;

		if (Number.isInteger(_qty)) setQtyNFT('' + _qty);
	}

	async function handleMint() {
		if (!config.MAINNET_CONFIG.DAI_CONTRACT_ADDRESS) return;
		if (!pfpData?.price) return;

		//handle balance
		const signer = library.getSigner();
		const userAddress = await signer.getAddress();
		const DAIContract = new Contract(
			config.MAINNET_CONFIG.DAI_CONTRACT_ADDRESS,
			ERC20_ABI,
			library,
		) as ERC20;
		const balance = await DAIContract.balanceOf(userAddress);

		const total = pfpData?.price.multipliedBy(qtyNFT);
		if (total.lte(balance.toString())) {
			setQty(Number(qtyNFT));
			setShowMintModal(true);
		} else {
			setShowInsufficientFundModal(true);
		}
	}

	return (
		<>
			<MintCardContainer>
				<InputWrapper gap='16px' flexDirection='column'>
					<Flex justifyContent='space-between'>
						<GLink size='Small'>NFT Amount</GLink>
						<MaxLink
							size='Small'
							onClick={() =>
								setQtyNFT('' + pfpData?.maxMintAmount)
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
					/>
					<InputHint>
						{pfpData?.totalSupply ? pfpData.totalSupply : '-'}/
						{pfpData?.maxSupply ? pfpData.maxSupply : '-'} Minted
					</InputHint>
				</InputWrapper>
				<InfoBox gap='16px' flexDirection='column'>
					<Flex justifyContent='space-between'>
						<InfoBoxTitle>Max Mint </InfoBoxTitle>
						<InfoBoxValue>
							{pfpData?.maxMintAmount
								? pfpData.maxMintAmount
								: '-'}
						</InfoBoxValue>
					</Flex>
					<Flex justifyContent='space-between'>
						<InfoBoxTitle>Mint Prince per</InfoBoxTitle>
						<InfoBoxValue>
							{pfpData?.price
								? formatWeiHelper(pfpData.price)
								: '-'}{' '}
							DAI
						</InfoBoxValue>
					</Flex>
				</InfoBox>
				{!account ? (
					<MintButton
						size='small'
						label={formatMessage({
							id: 'component.button.connect_wallet',
						})}
						buttonType='primary'
						onClick={() => dispatch(setShowWalletModal(true))}
					/>
				) : chainId !== config.MAINNET_NETWORK_NUMBER ? (
					<MintButton
						size='small'
						label={formatMessage({ id: 'label.switch_network' })}
						buttonType='primary'
						onClick={() =>
							switchNetwork(config.MAINNET_NETWORK_NUMBER)
						}
					/>
				) : (
					<MintButton
						size='small'
						label={formatMessage({ id: 'label.mint' })}
						buttonType='primary'
						onClick={handleMint}
						disabled={Number(qtyNFT) < 1 || !pfpData}
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
	margin-bottom: 24px;
`;

const StyledInput = styled(P)`
	padding: 15px 16px;
	width: 100%;
	color: ${brandColors.giv[200]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.giv[500]};
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
