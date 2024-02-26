import { type FC } from 'react';
import styled from 'styled-components';
import { P, B, neutralColors, Flex } from '@giveth/ui-design-system';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { IToken } from '@/types/superFluid';
import { limitFraction } from '@/helpers/number';

interface IItemProps {
	title: string;
	amount: bigint;
	price?: number;
	token: IToken;
}

export const Item: FC<IItemProps> = ({ title, amount, price, token }) => {
	return (
		<Wrapper gap='4px'>
			<IconWrapper></IconWrapper>
			<Flex $flexDirection='column' gap='4px'>
				<Title>{title}</Title>
				<Flex gap='4px'>
					<B>
						{limitFraction(
							formatUnits(
								amount,
								token.underlyingToken?.decimals || 18,
							),
						)}
						&nbsp;{token.symbol}
					</B>
					<B>~</B>
					<P>
						{price !== undefined &&
							limitFraction(
								formatUnits(
									BigInt(
										new BigNumber(price)
											.multipliedBy(amount.toString())
											.toFixed(0),
									),
									token.underlyingToken?.decimals || 18,
								),
								2,
							)}
						&nbsp;USD
					</P>
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
