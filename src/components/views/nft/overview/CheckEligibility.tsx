import {
	brandColors,
	Button,
	Container,
	H2,
	P,
	QuoteText,
	semanticColors,
} from '@giveth/ui-design-system';
import { Contract } from 'ethers';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { abi as PFP_ABI } from '@/artifacts/pfpGiver.json';
import config from '@/configuration';
import { getAddressFromENS, isAddressENS, switchNetwork } from '@/lib/wallet';
import { Flex } from '@/components/styled-components/Flex';
import EligibilityModal from './EligibilityModal';
import { GiversPFP } from '@/types/contracts';

const CheckEligibility = () => {
	const { library, chainId } = useWeb3React();
	const [walletAddress, setWalletAddress] = useState('');
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [status, setStatus] = useState<boolean | undefined>();
	const onAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
		setWalletAddress(event.target.value);
	};

	const checkAddress = async (address: string) => {
		if (utils.isAddress(address)) {
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
				const res = await PFPContract.allowList(address);
				console.log(res);
				res === true ? setStatus(true) : setStatus(false);
				setShowModal(true);
			} catch (error) {
				setError('Cannot get data');
				console.log('ErrorRRR', error);
			}
		} else {
			setError('Address is not valid');
			console.log('Address is Not valid');
		}
	};

	const handleVerify = async () => {
		//change network to mainnet
		setError('');
		try {
			if (walletAddress) {
				let resolvedAddress;
				if (chainId !== config.MAINNET_NETWORK_NUMBER) {
					await switchNetwork(config.MAINNET_NETWORK_NUMBER);
				}
				if (isAddressENS(walletAddress)) {
					const _provider =
						chainId === config.MAINNET_NETWORK_NUMBER
							? library
							: new JsonRpcProvider(
									config.MAINNET_CONFIG.nodeUrl,
							  );
					console.log('1');
					resolvedAddress = await getAddressFromENS(
						walletAddress,
						_provider,
					);
					checkAddress(resolvedAddress);
				} else {
					console.log('3');
					checkAddress(walletAddress);
				}
			}
		} catch (error) {
			setError('Please connect your wallet');
			console.log('Error', error);
		}
	};

	return (
		<SectionContainer>
			<H2>Early Minting has begun!</H2>
			<br />
			<CustomQuote size='small'>
				Check here to verify your eligibility
			</CustomQuote>
			<InputContainer>
				<Flex flexDirection='column' gap='8px'>
					<StyledInput
						as='input'
						placeholder='Input your wallet address here'
						value={walletAddress}
						onChange={onAddressChange}
					/>
					<CustomError>{error}</CustomError>
				</Flex>
			</InputContainer>
			<CustomButton
				buttonType='primary'
				label='VERIFY'
				onClick={handleVerify}
			/>
			{showModal && (
				<EligibilityModal
					isSuccess={!!status}
					setShowModal={setShowModal}
				/>
			)}
		</SectionContainer>
	);
};

const SectionContainer = styled(Container)`
	position: relative;
	z-index: 1;
`;

const StyledInput = styled(P)`
	padding: 15px 16px;
	width: 100%;
	color: ${brandColors.giv[200]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.giv[500]};
	border-radius: 8px;
	max-width: 440px;
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	-moz-appearance: textfield;
`;

const CustomQuote = styled(QuoteText)`
	margin-bottom: 14px;
	color: ${brandColors.giv[200]};
`;

const CustomButton = styled(Button)`
	margin: 20px 0 100px 0;
	width: 250px;
`;

const InputContainer = styled.div`
	height: 80px;
`;

const CustomError = styled.span`
	color: ${semanticColors.punch[500]};
`;

export default CheckEligibility;
