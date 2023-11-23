import { Caption, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC } from 'react';
import { formatUnits } from 'viem';
import { Flex } from '@/components/styled-components/Flex';
import { TokenIcon } from '../TokenIcon';
import { ISuperfluidStream } from '@/types/superFluid';
import { limitFraction } from '@/helpers/number';

interface IStreamInfoProps {
	stream: ISuperfluidStream[];
	balance: bigint;
	disable: boolean;
	onClick: () => void;
}

export const StreamInfo: FC<IStreamInfoProps> = ({
	stream,
	balance,
	disable,
	onClick,
}) => {
	console.log(
		'stream[0].currentFlowRate',
		balance,
		BigInt(stream[0].currentFlowRate),
		2628000n,
	);
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
				symbol={stream[0].token.symbol}
				size={32}
				isSuperToken={true}
			/>
			<InfoWrapper flexDirection='column' alignItems='flex-start'>
				<Row justifyContent='space-between'>
					<Symbol>
						<Caption medium>{stream[0].token.symbol}</Caption>
						<GrayCaption>{stream[0].token.name}</GrayCaption>
					</Symbol>
					<Balance gap='4px'>
						<GrayCaption>Stream Balance</GrayCaption>
						<Caption medium>
							{balance !== undefined
								? limitFraction(
										formatUnits(
											balance,
											stream[0].token.decimals,
										),
								  )
								: '--'}
						</Caption>
						<Caption medium>{stream[0].token.symbol}</Caption>
					</Balance>
				</Row>
				<Row justifyContent='space-between'>
					<Flex gap='4px'>
						<GrayCaption>Stream runs out in</GrayCaption>
						<Caption medium>
							{balance !== undefined &&
								(
									balance /
									BigInt(stream[1].currentFlowRate) /
									2628000n
								).toString()}
						</Caption>
					</Flex>
				</Row>
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

const Row = styled(Flex)`
	width: 100%;
`;

const Symbol = styled(Flex)`
	gap: 8px;
`;

const Balance = styled(Flex)`
	background: ${neutralColors.gray[300]};
	padding: 2px 8px;
	align-items: flex-start;
	gap: 8px;
	border-radius: 8px;
`;

const GrayCaption = styled(Caption)`
	color: ${neutralColors.gray[700]};
`;
