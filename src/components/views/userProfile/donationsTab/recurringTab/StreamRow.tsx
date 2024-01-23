import { type FC } from 'react';
import styled from 'styled-components';
import { P } from '@giveth/ui-design-system';
import { formatUnits } from 'viem';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import { TableCell } from './ActiveStreamsSection';
import { ISuperfluidStream } from '@/types/superFluid';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { limitFraction } from '@/helpers/number';

interface IStreamRowProps {
	tokenStream: ISuperfluidStream[];
}

export const StreamRow: FC<IStreamRowProps> = ({ tokenStream }) => {
	const symbol = tokenStream[0].token.underlyingToken?.symbol || 'ETH';
	const totalFlowRate = tokenStream.reduce(
		(acc, curr) => acc + BigInt(curr.currentFlowRate),
		0n,
	);
	const monthlyFlowRate = totalFlowRate * ONE_MONTH_SECONDS;

	return (
		<RowWrapper>
			<TableCell>
				<TokenIcon symbol={symbol} />
				<P>{tokenStream[0].token.symbol}</P>
			</TableCell>
			<TableCell>
				{limitFraction(
					formatUnits(
						monthlyFlowRate || 0n,
						tokenStream[0].token.decimals,
					),
				)}
			</TableCell>
			<TableCell>{tokenStream.length}</TableCell>
			<TableCell></TableCell>
			<TableCell>Modify stream balance</TableCell>
		</RowWrapper>
	);
};

const RowWrapper = styled.div`
	display: contents;
`;
