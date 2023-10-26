import { Caption, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useState, type FC, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { IToken } from '@/types/config';
import { Flex } from '@/components/styled-components/Flex';
import { TokenIcon } from '../TokenIcon';
import { type ISelectTokenModalProps } from './SelectTokenModal';
import { fetchBalance } from '@/services/token';

interface ITokenInfoProps extends ISelectTokenModalProps {
	token: IToken;
}

enum EState {
	LOADING,
	SUCCESS,
	FAILED,
}

export const TokenInfo: FC<ITokenInfoProps> = ({
	token,
	setSelectedToken,
	setShowModal,
}) => {
	const [balance, setBalance] = useState<bigint>(0n);
	const [state, setState] = useState(EState.LOADING);

	const { address } = useAccount();

	useEffect(() => {
		if (!address || !token.address) return;
		const fetchData = async () => {
			const _balance = await fetchBalance(token.address, address);
			if (_balance !== undefined) {
				setBalance(_balance);
				setState(EState.SUCCESS);
			} else {
				setState(EState.FAILED);
			}
		};
		fetchData();
	}, [address, token.address]);

	return (
		<Wrapper
			gap='16px'
			alignItems='center'
			onClick={() => {
				setSelectedToken({ token, balance });
				setShowModal(false);
			}}
		>
			<TokenIcon symbol={token.symbol} size={32} />
			<InfoWrapper flexDirection='column' alignItems='flex-start'>
				<TopRow justifyContent='space-between'>
					<Caption medium>{token.symbol}</Caption>
					<Flex gap='4px'>
						<Caption medium>
							{state === EState.SUCCESS
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
