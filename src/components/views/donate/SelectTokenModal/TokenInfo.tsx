import { FC } from 'react';
import { Caption, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IToken } from '@/types/config';
import { Flex } from '@/components/styled-components/Flex';
import { TokenIcon } from '../TokenIcon';

interface ITokenInfoProps {
	token: IToken;
	balance: bigint;
}

export const TokenInfo: FC<ITokenInfoProps> = ({ token, balance }) => {
	return (
		<Wrapper gap='16px' alignItems='center'>
			<TokenIcon symbol={token.symbol} size={32} />
			<InfoWrapper flexDirection='column' alignItems='flex-start'>
				<TopRow justifyContent='space-between'>
					<Caption medium>{token.symbol}</Caption>
					<Flex gap='4px'>
						<Caption medium>{balance.toString()}</Caption>
						<GrayCaption>{token.symbol}</GrayCaption>
					</Flex>
				</TopRow>
				<GrayCaption>{token.name}</GrayCaption>
			</InfoWrapper>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	padding: 4px 8px;
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
