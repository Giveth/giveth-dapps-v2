import {
	Caption,
	IconHelpFilled16,
	B,
	GLink,
	IconRefresh16,
	neutralColors,
	brandColors,
	semanticColors,
	Flex,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Dispatch, SetStateAction, type FC } from 'react';
import { type GetBalanceReturnType } from '@wagmi/core';
import { formatUnits } from 'viem';
import { AmountInput } from '@/components/AmountInput/AmountInput';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Spinner } from '@/components/Spinner';
import { IToken } from '@/types/superFluid';
import { truncateToDecimalPlaces } from '@/lib/helpers';
import { findTokenByAddress } from '@/helpers/superfluid';
import { TokenIcon } from '../../TokenIcon/TokenIcon';

export enum EModifySectionPlace {
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
}

interface IModifySectionProps {
	titleLabel: string;
	token?: IToken;
	amount: bigint;
	setAmount: Dispatch<SetStateAction<bigint>>;
	balance?: GetBalanceReturnType;
	refetch: any;
	isRefetching: boolean;
	error?: string;
	maxAmount: bigint;
	tooltipText?: string;
	modifySectionPlace: EModifySectionPlace;
}

export const ModifySection: FC<IModifySectionProps> = ({
	titleLabel,
	token,
	amount,
	setAmount,
	balance,
	refetch,
	isRefetching,
	error,
	maxAmount,
	tooltipText,
	modifySectionPlace,
}) => {
	const { formatMessage } = useIntl();

	const handleSetMaxAmount = () => {
		if (!balance || !balance.value) return; // If balance is not available, return
		setAmount(balance.value); // Set the amount to the balance value
	};

	const _token = findTokenByAddress(token?.id);
	const ProperGlink =
		modifySectionPlace === EModifySectionPlace.DEPOSIT
			? CustomGLink
			: GLink;

	return (
		<TopUpSection $flexDirection='column' gap='8px'>
			<Flex gap='8px' $alignItems='center'>
				<Caption $medium>{formatMessage({ id: titleLabel })}</Caption>
				<IconWithTooltip
					icon={<IconHelpFilled16 />}
					direction='right'
					align='bottom'
				>
					<FlowRateTooltip>
						{formatMessage({ id: tooltipText })}
					</FlowRateTooltip>
				</IconWithTooltip>
			</Flex>
			<InputWrapper $hasError={!!error}>
				<SelectTokenWrapper
					$alignItems='center'
					$justifyContent='space-between'
				>
					<Flex gap='8px' $alignItems='center'>
						<TokenIcon
							symbol={
								_token?.isSuperToken
									? _token?.underlyingToken.symbol
									: _token?.symbol
							}
							size={24}
						/>
						<B>{token?.symbol}</B>
					</Flex>
				</SelectTokenWrapper>
				<Input
					amount={amount}
					setAmount={setAmount}
					disabled={!token}
					decimals={token?.decimals}
				/>
			</InputWrapper>
			<Flex gap='4px'>
				<ProperGlink
					size='Small'
					onClick={
						modifySectionPlace === EModifySectionPlace.DEPOSIT
							? handleSetMaxAmount
							: undefined
					}
				>
					{formatMessage({ id: 'label.available' })}:
					{balance
						? truncateToDecimalPlaces(
								formatUnits(maxAmount, balance.decimals),
								balance.decimals / 3,
							)
						: '--'}
				</ProperGlink>
				<IconWrapper onClick={() => !isRefetching && refetch()}>
					{isRefetching ? <Spinner size={16} /> : <IconRefresh16 />}
				</IconWrapper>
			</Flex>
		</TopUpSection>
	);
};

// Styled Components
const TopUpSection = styled(Flex)``;

const SelectTokenWrapper = styled(Flex)`
	min-width: 132px;
	gap: 16px;
	padding: 13px 16px;
`;
const InputWrapper = styled(Flex)<{ $hasError: boolean }>`
	border: 2px solid
		${props =>
			props.$hasError
				? semanticColors.punch[300]
				: neutralColors.gray[300]};
	border-radius: 8px;
	overflow: hidden;
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
		padding: 13px 16px;
	}
`;

const CustomGLink = styled(GLink)`
	&&:hover {
		cursor: pointer;
		text-decoration: underline;
	}
`;

const IconWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.giv[500]};
`;
