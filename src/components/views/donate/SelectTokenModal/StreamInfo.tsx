import { Caption, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC } from 'react';
import { formatUnits } from 'viem';
import { Flex } from '@/components/styled-components/Flex';
import { TokenIcon } from '../TokenIcon';
import { ISuperfluidStream } from '@/types/superFluid';

interface IStreamInfoProps {
	stream: ISuperfluidStream;
	balance: bigint;
	disable: boolean;
	isSuperToken?: boolean;
	onClick: () => void;
}

export const StreamInfo: FC<IStreamInfoProps> = ({
	stream,
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
			<TokenIcon
				symbol={stream.token.symbol}
				size={32}
				isSuperToken={isSuperToken}
			/>
			<InfoWrapper flexDirection='column' alignItems='flex-start'>
				<TopRow justifyContent='space-between'>
					<Caption medium>{stream.token.symbol}</Caption>
					<Flex gap='4px'>
						<Caption medium>
							{balance !== undefined
								? formatUnits(balance, stream.token.decimals)
								: '--'}
						</Caption>
						<GrayCaption>{stream.token.symbol}</GrayCaption>
					</Flex>
				</TopRow>
				<GrayCaption>{stream.token.name}</GrayCaption>
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
