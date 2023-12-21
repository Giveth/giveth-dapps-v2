import { useState, type FC } from 'react';
import styled from 'styled-components';
import {
	Caption,
	IconHelpFilled16,
	B,
	GLink,
	IconRefresh16,
	neutralColors,
	brandColors,
} from '@giveth/ui-design-system';

import { useAccount, useBalance } from 'wagmi';
import { Flex } from '@/components/styled-components/Flex';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Spinner } from '@/components/Spinner';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { IToken } from '@/types/superFluid';
import { AddressZero } from '@/lib/constants/constants';
import { AmountInput } from '@/components/AmountInput/AmountInput';

interface IDepositSuperTokenProps {
	selectedToken: IToken;
}

export const DepositSuperToken: FC<IDepositSuperTokenProps> = ({
	selectedToken,
}) => {
	const [amount, setAmount] = useState(0n);

	const { address } = useAccount();
	const {
		data: balance,
		refetch,
		isRefetching,
	} = useBalance({
		token: selectedToken.id === AddressZero ? undefined : selectedToken.id,
		address: address,
	});
	const underlyingToken = selectedToken.underlyingToken;

	return (
		<Wrapper>
			<TopUpSection flexDirection='column' gap='8px'>
				<Flex gap='8px' alignItems='center'>
					<Caption medium>Stream Balance</Caption>
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
							<TokenIcon
								symbol={
									underlyingToken
										? underlyingToken.symbol
										: selectedToken.symbol
								}
								size={24}
							/>
							<B>{selectedToken.symbol}</B>
						</Flex>
					</SelectTokenWrapper>
					<Input
						setAmount={setAmount}
						disabled={selectedToken === undefined}
						decimals={selectedToken.decimals}
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
			</TopUpSection>
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
