import {
	brandColors,
	Button,
	Container,
	H2,
	P,
	QuoteText,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { useAccount, useSwitchChain } from 'wagmi';
import { Address } from 'viem';
import { readContract } from '@wagmi/core';
import { Flex } from '@giveth/ui-design-system';
import { abi as PFP_ABI } from '@/artifacts/pfpGiver.json';
import config from '@/configuration';
import { getAddressFromENS, isAddressENS } from '@/lib/wallet';
import EligibilityModal from './EligibilityModal';
import { wagmiConfig } from '@/wagmiConfigs';

const CheckEligibility = () => {
	const [walletAddress, setWalletAddress] = useState('');
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [status, setStatus] = useState<boolean | undefined>();

	const { chain } = useAccount();
	const { switchChain } = useSwitchChain();

	const chainId = chain?.id;
	const onAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
		setWalletAddress(event.target.value);
	};

	const checkAddress = async (address: Address) => {
		try {
			const isAllowed = await readContract(wagmiConfig, {
				address: config.MAINNET_CONFIG.PFP_CONTRACT_ADDRESS,
				abi: PFP_ABI,
				functionName: 'allowList',
				args: [address],
			});
			isAllowed === true ? setStatus(true) : setStatus(false);
			setShowModal(true);
		} catch (error) {
			setError('Cannot get data');
			console.log('ErrorRRR', error);
		}
	};

	const handleVerify = async () => {
		//change network to mainnet
		setError('');
		try {
			if (walletAddress) {
				let resolvedAddress;
				if (chainId !== config.MAINNET_NETWORK_NUMBER) {
					await switchChain?.({
						chainId: config.MAINNET_NETWORK_NUMBER,
					});
				}
				if (isAddressENS(walletAddress)) {
					resolvedAddress = await getAddressFromENS(walletAddress);
					if (!resolvedAddress) {
						setError('Cannot resolve ENS');
						return;
					}
					checkAddress(resolvedAddress);
				} else {
					checkAddress(walletAddress as Address);
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
				<Flex $flexDirection='column' gap='8px'>
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
