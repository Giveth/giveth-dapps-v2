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
import { AmountInput } from '@/components/AmountInput/AmountInput';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Spinner } from '@/components/Spinner';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { IToken } from '@/types/superFluid';
import { limitFraction } from '@/helpers/number';

interface IModifySectionProps {
	titleLabel: string;
	token?: IToken;
	setAmount: Dispatch<SetStateAction<bigint>>;
	balance?: GetBalanceReturnType;
	refetch: any;
	isRefetching: boolean;
	error?: string;
}
export const ModifySection: FC<IModifySectionProps> = ({
	titleLabel,
	token,
	setAmount,
	balance,
	refetch,
	isRefetching,
	error,
}) => {
	const { formatMessage } = useIntl();

	return (
		<TopUpSection $flexDirection='column' gap='8px'>
			<Flex gap='8px' $alignItems='center'>
				<Caption $medium>
					{formatMessage({
						id: titleLabel,
					})}
				</Caption>
				<IconWithTooltip
					icon={<IconHelpFilled16 />}
					direction='right'
					align='bottom'
				>
					<FlowRateTooltip>PlaceHolder</FlowRateTooltip>
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
								token?.isSuperToken
									? token.underlyingToken?.symbol
									: token?.symbol
							}
							size={24}
						/>
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
				<GLink size='Small'>
					{formatMessage({
						id: 'label.available',
					})}
					: {limitFraction(balance?.formatted || '0')}
				</GLink>
				<IconWrapper onClick={() => !isRefetching && refetch()}>
					{isRefetching ? <Spinner size={16} /> : <IconRefresh16 />}
				</IconWrapper>
			</Flex>
		</TopUpSection>
	);
};

const TopUpSection = styled(Flex)``;

const SelectTokenWrapper = styled(Flex)`
	min-width: 132px;
	gap: 16px;
	padding: 13px 16px;
`;

interface IInputWrapper {
	$hasError: boolean;
}

const InputWrapper = styled(Flex)<IInputWrapper>`
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

const IconWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.giv[500]};
`;
