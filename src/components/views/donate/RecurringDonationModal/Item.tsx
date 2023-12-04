import { type FC } from 'react';
import styled from 'styled-components';
import { P, B, neutralColors } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { IToken } from '@/types/superFluid';

interface IItemProps {
	title: string;
	amount: bigint;
	price: bigint;
	token: IToken;
}

export const Item: FC<IItemProps> = ({ title, amount, price, token }) => {
	return (
		<Wrapper gap='4px'>
			<IconWrapper></IconWrapper>
			<Flex flexDirection='column' gap='4px'>
				<Title>{title}</Title>
				<Flex gap='4px'>
					<B>
						{amount.toString()}&nbsp;{token.symbol}
					</B>
					<B>~</B>
					<P>{(amount * price).toString()}&nbsp;USD</P>
				</Flex>
			</Flex>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	padding: 8px;
	background: ${neutralColors.gray[200]};
	border-radius: 8px;
	max-width: 100%;
	* {
		max-width: 100%;
	}
`;

const IconWrapper = styled.div``;

const Title = styled(P)`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
