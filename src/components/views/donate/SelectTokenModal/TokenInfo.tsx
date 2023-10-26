import { Caption, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { type ChainNativeCurrency } from 'viem/_types/types/chain';
import { IToken } from '@/types/config';
import { Flex } from '@/components/styled-components/Flex';
import { TokenIcon } from '../TokenIcon';
import { type ISelectTokenModalProps } from './SelectTokenModal';

interface ITokenInfoProps extends ISelectTokenModalProps {
	token: IToken | ChainNativeCurrency;
}

export const TokenInfo: FC<ITokenInfoProps> = ({
	token,
	setSelectedToken,
	setShowModal,
}) => {
	const { address } = useAccount();
	const { data } = useBalance({
		address: address,
		token: 'address' in token ? token.address : undefined,
	});

	return (
		<Wrapper
			gap='16px'
			alignItems='center'
			onClick={() => {
				setSelectedToken({ token, balance: data?.value });
				setShowModal(false);
			}}
		>
			<TokenIcon symbol={token.symbol} size={32} />
			<InfoWrapper flexDirection='column' alignItems='flex-start'>
				<TopRow justifyContent='space-between'>
					<Caption medium>{token.symbol}</Caption>
					<Flex gap='4px'>
						<Caption medium>{data?.formatted}</Caption>
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
	cursor: pointer;
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
