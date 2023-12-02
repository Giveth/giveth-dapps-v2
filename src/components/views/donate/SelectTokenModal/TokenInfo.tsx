import {
	Caption,
	IconGIVBack16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC } from 'react';
import { formatUnits } from 'viem';
import { Flex } from '@/components/styled-components/Flex';
import { TokenIcon } from '../TokenIcon';
import { IToken } from '@/types/superFluid';
import { limitFraction } from '@/helpers/number';

interface ITokenInfoProps {
	token: IToken;
	balance: bigint;
	disable: boolean;
	isSuperToken?: boolean;
	onClick: () => void;
}

export const TokenInfo: FC<ITokenInfoProps> = ({
	token,
	balance,
	disable,
	isSuperToken,
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
			<TokenIconWrapper>
				<TokenIcon symbol={token.symbol} size={32} />
				<GIVBackBadge>
					<IconGIVBack16 size={16} color={brandColors.giv[500]} />
				</GIVBackBadge>
			</TokenIconWrapper>
			<InfoWrapper flexDirection='column' alignItems='flex-start'>
				<TopRow justifyContent='space-between'>
					<Flex gap='4px'>
						<Caption medium>{token.symbol}</Caption>
						<GrayCaption>{token.name}</GrayCaption>
					</Flex>
					<Balance gap='4px'>
						<Caption medium>
							{balance !== undefined
								? limitFraction(
										formatUnits(balance, token.decimals),
										6,
								  )
								: '--'}
						</Caption>
						{token.isSuperToken && (
							<GrayCaption medium>{token.symbol}</GrayCaption>
						)}
					</Balance>
				</TopRow>
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

const TokenIconWrapper = styled.div`
	position: relative;
`;

const GIVBackBadge = styled.div`
	position: absolute;
	bottom: 0;
	right: 0;
	width: 16px;
	height: 16px;
	background: ${neutralColors.gray[100]};
	border-radius: 50%;
`;

const InfoWrapper = styled(Flex)`
	flex: 1;
`;

const TopRow = styled(Flex)`
	width: 100%;
`;

const Balance = styled(Flex)`
	padding: 2px 8px;
	border-radius: 8px;
	background: ${neutralColors.gray[300]};
	align-items: flex-start;
	gap: 8px;
`;

const GrayCaption = styled(Caption)`
	color: ${neutralColors.gray[700]};
`;
