import { Caption, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC } from 'react';
import { type ChainNativeCurrency } from 'viem/_types/types/chain';
import { formatUnits } from 'viem';
import { IToken } from '@/types/config';
import { Flex } from '@/components/styled-components/Flex';
import { TokenIcon } from '../TokenIcon';

interface ITokenInfoProps {
	token: IToken | ChainNativeCurrency;
	balance: bigint;
	disable: boolean;
	onClick: () => void;
}

export const TokenInfo: FC<ITokenInfoProps> = ({
	token,
	balance,
	disable,
	onClick,
}) => {
	return (
		<Wrapper
			gap='16px'
			alignItems='center'
			disabled={disable}
			onClick={() => {
				if (disable) return;
				onClick();
			}}
		>
			<TokenIcon symbol={token.symbol} size={32} />
			<InfoWrapper flexDirection='column' alignItems='flex-start'>
				<TopRow justifyContent='space-between'>
					<Caption medium>{token.symbol}</Caption>
					<Flex gap='4px'>
						<Caption medium>
							{balance !== undefined
								? formatUnits(balance, token.decimals)
								: '--'}
						</Caption>
						<GrayCaption>{token.symbol}</GrayCaption>
					</Flex>
				</TopRow>
				<GrayCaption>{token.name}</GrayCaption>
			</InfoWrapper>
		</Wrapper>
	);
};

interface IWrapper {
	disabled?: boolean;
}

const Wrapper = styled(Flex)<IWrapper>`
	padding: 4px 8px;
	cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
	&:hover {
		background: ${neutralColors.gray[200]};
	}
	border-radius: 8px;
`;

const InfoWrapper = styled(Flex)`
	flex: 1;
`;

const TopRow = styled(Flex)`
	width: 100%;
`;

const GrayCaption = styled(Caption)`
	color: ${neutralColors.gray[700]};
`;
