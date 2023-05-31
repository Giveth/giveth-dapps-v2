import {
	B,
	Caption,
	GLink,
	IconRefresh16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';
import { Contract } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { NumericalInput } from '@/components/input';
import { Flex } from '@/components/styled-components/Flex';
import NetworkLogo from '@/components/NetworkLogo';
import { GIVSavingsAccount } from '@/types/config';
import { abi as ERC20_ABI } from '@/artifacts/ERC20.json';
import { ERC20 } from '@/types/contracts';

interface IDepositCard {
	givsavingsAccount: GIVSavingsAccount;
}

export const DepositCard: FC<IDepositCard> = ({ givsavingsAccount }) => {
	const [displayAmount, setDisplayAmount] = useState('');
	// const [amount, setAmount] = useState('0');
	const [balance, setBalance] = useState('0');

	const { chainId: networkId, account, library, active } = useWeb3React();

	const onUserInput = useCallback((value: string) => {
		setDisplayAmount(value);
		let valueBn = BigNumber.from(0);

		try {
			valueBn = parseUnits(value);
		} catch (error) {
			console.debug(`Failed to parse input amount: "${value}"`, error);
			captureException(error, {
				tags: {
					section: 'AmountInput',
				},
			});
		}
		// setAmount(valueBn.toString());
	}, []);

	const fetchBalance = useCallback(async () => {
		if (!account) return;
		try {
			const tokenContract = new Contract(
				givsavingsAccount.token.address,
				ERC20_ABI,
				library,
			) as ERC20;
			const balance = await tokenContract.balanceOf(account);
			setBalance(formatUnits(balance));
		} catch (error) {
			console.debug(`Failed to fetch balance`, error);
			captureException(error, {
				tags: {
					section: 'AmountInput',
				},
			});
		}
	}, [account, library, givsavingsAccount.token.address]);

	useEffect(() => {
		fetchBalance();
	}, [fetchBalance]);

	return (
		<Wrapper>
			<Caption>From Wallet</Caption>
			<InputWrapper>
				<TokenInfo alignItems='center'>
					{/* TODO: Change to Token Icon */}
					<NetworkLogo chainId={5} logoSize={24} />
					<B>{givsavingsAccount.token.name}</B>
				</TokenInfo>
				<StyledNumericalInput
					value={displayAmount}
					onUserInput={onUserInput}
					disabled={false}
				/>
			</InputWrapper>
			<BalanceRow justifyContent='space-between'>
				<Flex alignItems='center' gap='6px'>
					<GLink>Available: ${balance}</GLink>
					<IconWrapper onClick={() => fetchBalance()}>
						<IconRefresh16 color={brandColors.giv[500]} />
					</IconWrapper>
				</Flex>
				<MaxButton
					onClick={() => {
						setDisplayAmount(balance);
					}}
				>
					Max
				</MaxButton>
			</BalanceRow>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 24px;
`;

const InputWrapper = styled(Flex)`
	border: 2px solid ${neutralColors.gray[400]};
	border-radius: 8px;
	overflow: hidden;
`;

const TokenInfo = styled(Flex)`
	min-width: 140px;
	padding: 15px;
`;

const StyledNumericalInput = styled(NumericalInput)`
	background-color: ${neutralColors.gray[100]};
	color: ${neutralColors.gray[800]};
	border: none;
	border-radius: 0;
	border-left: 2px solid ${neutralColors.gray[400]};
	padding: 15px;
	margin: 0;
	::placeholder {
		color: ${neutralColors.gray[800]};
	}
`;

const BalanceRow = styled(Flex)`
	margin-top: 4px;
	color: ${neutralColors.gray[700]};
`;

const IconWrapper = styled.div`
	cursor: pointer;
	height: 16px;
`;

const MaxButton = styled(GLink)`
	cursor: pointer;
`;
