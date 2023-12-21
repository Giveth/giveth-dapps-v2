import { useState, type FC, useMemo } from 'react';
import styled from 'styled-components';
import {
	Caption,
	IconHelpFilled16,
	B,
	GLink,
	IconRefresh16,
	neutralColors,
	brandColors,
	Button,
} from '@giveth/ui-design-system';

import { useAccount, useBalance } from 'wagmi';
import { Flex } from '@/components/styled-components/Flex';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Spinner } from '@/components/Spinner';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { ISuperToken, IToken } from '@/types/superFluid';
import { AddressZero, ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { AmountInput } from '@/components/AmountInput/AmountInput';
import { findSuperTokenByTokenAddress } from '@/helpers/donate';
import { ITokenStreams } from '@/context/donate.context';
import { ModifyInfoToast } from './ModifyInfoToast';

interface IDepositSuperTokenProps {
	tokenStreams: ITokenStreams;
	selectedToken: IToken;
}

export const DepositSuperToken: FC<IDepositSuperTokenProps> = ({
	selectedToken,
	tokenStreams,
}) => {
	const [amount, setAmount] = useState(0n);

	const { address } = useAccount();

	const [token, superToken] = useMemo(
		() =>
			selectedToken.isSuperToken
				? [selectedToken.underlyingToken, selectedToken as ISuperToken]
				: [
						selectedToken,
						findSuperTokenByTokenAddress(selectedToken.id),
					],
		[selectedToken],
	);

	const {
		data: balance,
		refetch,
		isRefetching,
	} = useBalance({
		token: token?.id === AddressZero ? undefined : token?.id,
		address: address,
	});

	const { data: SuperTokenBalance } = useBalance({
		token: superToken?.id,
		address: address,
	});

	const tokenStream = tokenStreams[superToken?.id || ''];
	const totalStreamPerSec =
		tokenStream?.reduce(
			(acc, stream) => acc + BigInt(stream.currentFlowRate),
			0n,
		) || 0n;
	const streamRunOutInMonth =
		SuperTokenBalance !== undefined &&
		totalStreamPerSec > 0 &&
		SuperTokenBalance.value > 0n
			? SuperTokenBalance.value / totalStreamPerSec / ONE_MONTH_SECONDS
			: 0n;

	return (
		<Wrapper>
			<TopUpSection flexDirection='column' gap='8px'>
				<Flex gap='8px' alignItems='center'>
					<Caption medium>Top up stream Balance</Caption>
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction='right'
						align='bottom'
					>
						<FlowRateTooltip>PlaceHolder</FlowRateTooltip>
					</IconWithTooltip>
				</Flex>
				<InputWrapper>
					<SelectTokenWrapper
						alignItems='center'
						justifyContent='space-between'
					>
						<Flex gap='8px' alignItems='center'>
							{token?.symbol && (
								<TokenIcon symbol={token?.symbol} size={24} />
							)}
							<B>{token?.symbol}</B>
						</Flex>
					</SelectTokenWrapper>
					<Input
						setAmount={setAmount}
						disabled={token === undefined}
						decimals={token?.decimals}
					/>
				</InputWrapper>
				<Flex gap='4px'>
					<GLink size='Small'>Available: {balance?.formatted}</GLink>
					<IconWrapper onClick={() => !isRefetching && refetch()}>
						{isRefetching ? (
							<Spinner size={16} />
						) : (
							<IconRefresh16 />
						)}
					</IconWrapper>
				</Flex>
				<StreamSection>
					<Flex alignItems='center' justifyContent='space-between'>
						<Caption medium>Stream Balance</Caption>
						<StreamBalanceInfo medium>
							1200 {superToken?.symbol}
						</StreamBalanceInfo>
					</Flex>
					<Flex alignItems='center' justifyContent='space-between'>
						<Caption>
							Balance runs out in{' '}
							<strong>
								{' '}
								{streamRunOutInMonth.toString()} Month
								{streamRunOutInMonth > 1n ? 's' : ''}
							</strong>
						</Caption>
						<Caption>
							Funding <strong>{tokenStream.length}</strong>{' '}
							Project
							{tokenStream.length > 1 ? 's' : ''}
						</Caption>
					</Flex>
				</StreamSection>
			</TopUpSection>
			<ModifyInfoToast />
			<ActionButton
				label='Confirm'
				disabled={
					amount <= 0 ||
					balance === undefined ||
					amount > balance.value
				}
			/>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 24px;
`;

const TopUpSection = styled(Flex)``;

const SelectTokenWrapper = styled(Flex)`
	min-width: 132px;
	gap: 16px;
`;

const InputWrapper = styled(Flex)`
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	overflow: hidden;
	& > * {
		padding: 13px 16px;
	}
	align-items: center;
`;

const Input = styled(AmountInput)`
	width: 100%;
	border-left: 2px solid ${neutralColors.gray[300]};
	#amount-input {
		border: none;
		flex: 1;
		font-family: Red Hat Text;
		font-size: 16px;
		font-style: normal;
		font-weight: 500;
		line-height: 150%; /* 24px */
		width: 100%;
	}
`;

const IconWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.giv[500]};
`;

const StreamSection = styled(Flex)`
	flex-direction: column;
	padding: 8px;
	gap: 16px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[200]};
	margin-top: 16px;
	color: ${neutralColors.gray[800]};
`;

const StreamBalanceInfo = styled(Caption)`
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 2px 8px;
`;

const ActionButton = styled(Button)``;
