import {
	B,
	brandColors,
	Button,
	GLink,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { useWeb3React } from '@web3-react/core';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Contract } from 'ethers';
import { setShowWalletModal } from '@/features/modal/modal.slice';
import { MintModal } from '../modals/MintModal';
import { Flex } from '../styled-components/Flex';
import { useAppDispatch } from '@/features/hooks';
import { formatWeiHelper } from '@/helpers/number';
import { ERC20 } from '@/types/contracts';
import { abi as ERC20_ABI } from '@/artifacts/ERC20.json';
import { switchNetwork } from '@/lib/metamask';
import config from '@/configuration';
import { abi as PFP_ABI } from '@/artifacts/pfpGiver.json';

const MIN_NFT_QTY = 1;

export const MintCard = () => {
	const [qtyNFT, setQtyNFT] = useState('1');
	const [showModal, setShowModal] = useState(false);
	const [nftPrice, setNFTPrice] = useState<BigNumber>();
	const [maxMintAmount, setMaxMintAmount] = useState<number>();
	const { account, library, chainId } = useWeb3React();
	const { formatMessage } = useIntl();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!library) return;
		async function fetchData() {
			const PFPContract = new Contract(
				config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS ?? '',
				PFP_ABI,
				library,
			);
			const _price = await PFPContract.price();
			const _maxMintAmount = await PFPContract.maxMintAmount();
			console.log('_maxMintAmount', typeof _maxMintAmount);
			setNFTPrice(_price);
			setMaxMintAmount(_maxMintAmount);
		}
		fetchData();
	}, [library]);

	const mintedNFT = 20;
	function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
		if (!maxMintAmount) return;
		//handle empty input
		if (event.target.value === '') setQtyNFT('');

		//handle number
		const _qty = Number.parseInt(event.target.value);

		//handle range
		if (_qty > maxMintAmount || _qty < MIN_NFT_QTY) return;

		if (Number.isInteger(_qty)) setQtyNFT('' + _qty);
	}

	async function handleMint() {
		if (!config.MAINNET_CONFIG.DAI_CONTRACT_ADDRESS) return;

		//handle balance
		const signer = library.getSigner();
		const userAddress = await signer.getAddress();
		const DAIContract = new Contract(
			config.MAINNET_CONFIG.DAI_CONTRACT_ADDRESS,
			ERC20_ABI,
			library,
		) as ERC20;
		const balance = await DAIContract.balanceOf(userAddress);
		// if (balance.lte()) {
		// }
		console.log('balance', balance);

		//mint
		setShowModal(true);
	}

	return (
		<>
			<MintCardContainer>
				<InputWrapper gap='16px' flexDirection='column'>
					<Flex justifyContent='space-between'>
						<GLink size='Small'>NFT Amount</GLink>
						<MaxLink
							size='Small'
							onClick={() => setQtyNFT('' + maxMintAmount)}
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
					<InputHint>{mintedNFT}/1000 Minted</InputHint>
				</InputWrapper>
				<InfoBox gap='16px' flexDirection='column'>
					<Flex justifyContent='space-between'>
						<InfoBoxTitle>Max Mint </InfoBoxTitle>
						<InfoBoxValue>{maxMintAmount}</InfoBoxValue>
					</Flex>
					<Flex justifyContent='space-between'>
						<InfoBoxTitle>Mint Prince per</InfoBoxTitle>
						<InfoBoxValue>
							{nftPrice && formatWeiHelper(nftPrice)} DAI
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
						disabled={Number(qtyNFT) < 1}
					/>
				)}
			</MintCardContainer>
			{showModal && (
				<MintModal
					setShowModal={setShowModal}
					qty={Number(qtyNFT)}
					nftPrice={nftPrice}
				/>
			)}
		</>
	);
};

const MintCardContainer = styled.div`
	padding: 24px;
	background-color: ${brandColors.giv[800]};
	border-radius: 8px;
	max-width: 458px;
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
