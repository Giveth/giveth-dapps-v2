import { FC } from 'react';
import { IToken } from '@/types/config';
import { Flex } from '@/components/styled-components/Flex';

interface ITokenInfoProps {
	token: IToken;
	balance: bigint;
}

export const TokenInfo: FC<ITokenInfoProps> = ({ token, balance }) => {
	return (
		<Flex>
			<Flex></Flex>
		</Flex>
	);
};
