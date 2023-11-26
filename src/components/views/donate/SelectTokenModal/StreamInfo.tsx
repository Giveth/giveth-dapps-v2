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
	const totalFlowRate = stream.reduce(
		(acc, curr) => acc + BigInt(curr.currentFlowRate),
		0n,
	);
	const remainingMonths =
		balance !== undefined ? balance / totalFlowRate / 2628000n : 0n;
	return (
		<Wrapper
			gap='16px'
			alignItems='flex-start'
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
			<InfoWrapper
				flexDirection='column'
				alignItems='flex-start'
				gap='8px'
			>
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
				{totalFlowRate !== undefined && (
					<Row justifyContent='space-between'>
						<Flex gap='4px'>
							<GrayCaption>Stream runs out in</GrayCaption>
							<Caption medium>
								{remainingMonths.toString()}
							</Caption>
							<Caption>
								Month
								{remainingMonths === 1n ? '' : 's'}
							</Caption>
						</Flex>
						<Flex gap='4px'>
							<GrayCaption>Funding</GrayCaption>
							<Caption medium>{stream.length}</Caption>
							<GrayCaption>
								Project{stream.length === 1 ? '' : 's'}
							</GrayCaption>
						</Flex>
					</Row>
				)}
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
