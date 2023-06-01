import {
	B,
	Button,
	Caption,
	GLink,
	H5,
	IconRefresh16,
	Lead,
	brandColors,
	neutralColors,
	semanticColors,
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
import InlineToast from '@/components/toasts/InlineToast';
import { EToastType } from '@/components/toasts/InlineToast';
import ExternalLink from '@/components/ExternalLink';
import { approveERC20tokenTransfer } from '@/lib/stakingPool';

interface IDepositCard {
	givsavingsAccount: GIVSavingsAccount;
}

enum EDepositCardState {
	DEPOSIT,
	APPROVE,
	APPROVING,
	DEPOSITING,
	SUCCESS,
}

export const DepositCard: FC<IDepositCard> = ({ givsavingsAccount }) => {
	const [state, setState] = useState(EDepositCardState.DEPOSIT);
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

	const onApprove = async () => {
		if (displayAmount === '0') return;
		if (!library) {
			console.error('library is null');
			return;
		}

		let valueBn = BigNumber.from(0);

		try {
			valueBn = parseUnits(displayAmount);
		} catch (error) {
			console.debug(
				`Failed to parse input amount: "${displayAmount}"`,
				error,
			);
			captureException(error, {
				tags: {
					section: 'AmountInput',
				},
			});
		}

		setState(EDepositCardState.APPROVING);

		const signer = library.getSigner();

		const userAddress = await signer.getAddress();

		const isApproved = await approveERC20tokenTransfer(
			valueBn.toString(),
			userAddress,
			givsavingsAccount.CONTRACT_ADDRESS,
			givsavingsAccount.token.address,
			library,
		);

		if (isApproved) {
			setState(EDepositCardState.DEPOSITING);
		} else {
			setState(EDepositCardState.DEPOSIT);
		}
	};

	return state === EDepositCardState.DEPOSIT ? (
		<Wrapper>
			<Flex flexDirection='column' gap='8px'>
				<Caption medium>From Wallet</Caption>
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
			</Flex>
			<StyledButton
				label='Deposit'
				onClick={() => setState(EDepositCardState.APPROVE)}
			/>
		</Wrapper>
	) : (
		<Wrapper>
			<Flex flexDirection='column' gap='8px' alignItems='center'>
				{state === EDepositCardState.SUCCESS ? (
					<>
						<SuccessTitle>Successful!</SuccessTitle>
						<Lead>You have deposited</Lead>
					</>
				) : (
					<DepositingTitle>You are depositing </DepositingTitle>
				)}
				<H5>{`${displayAmount} ${givsavingsAccount.token.symbol}`}</H5>
				<Lead>
					to your {givsavingsAccount.token.symbol} GIVsavings account
				</Lead>
			</Flex>
			{(state === EDepositCardState.APPROVE ||
				state === EDepositCardState.APPROVING) && (
				<Flex gap='8px' flexDirection='column' alignItems='center'>
					<StyledButton
						label='Approve'
						onClick={() => onApprove()}
						loading={state === EDepositCardState.APPROVING}
					/>
					<StyledButton
						label='Cancel'
						buttonType='texty-gray'
						onClick={() => setState(EDepositCardState.DEPOSIT)}
					/>
				</Flex>
			)}
			{state === EDepositCardState.DEPOSITING && (
				<Flex gap='24px' flexDirection='column'>
					<InlineToast
						message='Processing your deposit, please wait...'
						type={EToastType.Info}
					/>
					<Flex gap='8px' flexDirection='column' alignItems='center'>
						<StyledButton label='Depositing' loading disabled />
						<StyledButton
							label='Cancel'
							buttonType='texty-gray'
							onClick={() => setState(EDepositCardState.DEPOSIT)}
						/>
					</Flex>
				</Flex>
			)}
			{state === EDepositCardState.SUCCESS && (
				<Flex gap='24px' flexDirection='column'>
					<InlineToast
						message={`Deposit to your ${givsavingsAccount.token.symbol} GIVSavings account successful`}
						type={EToastType.Success}
					/>
					<ExternalLink href='/' title='View on Etherscan' />
					<StyledButton
						label='Done'
						onClick={() => setState(EDepositCardState.DEPOSIT)}
					/>
				</Flex>
			)}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	padding: 24px;
	gap: 24px;
	flex-direction: column;
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

const StyledButton = styled(Button)`
	width: 100%;
`;

const SuccessTitle = styled(H5)`
	color: ${semanticColors.jade[700]};
`;

const DepositingTitle = styled(Lead)`
	color: ${brandColors.giv[300]};
`;
