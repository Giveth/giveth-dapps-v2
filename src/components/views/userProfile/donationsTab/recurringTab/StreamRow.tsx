import { type FC } from 'react';
import styled from 'styled-components';
import { P, semanticColors } from '@giveth/ui-design-system';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { useIntl } from 'react-intl';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import { TableCell } from './ActiveStreamsSection';
import { ISuperfluidStream } from '@/types/superFluid';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { limitFraction } from '@/helpers/number';

interface IStreamRowProps {
	tokenStream: ISuperfluidStream[];
}

export const StreamRow: FC<IStreamRowProps> = ({ tokenStream }) => {
	const { address } = useAccount();
	const { formatMessage } = useIntl();

	const {
		data: balance,
		refetch,
		isRefetching,
	} = useBalance({
		token: tokenStream[0].token.id,
		address: address,
		// watch: true,
		// cacheTime: 5_000,
	});

	const underlyingSymbol =
		tokenStream[0].token.underlyingToken?.symbol || 'ETH';
	const totalFlowRate = tokenStream.reduce(
		(acc, curr) => acc + BigInt(curr.currentFlowRate),
		0n,
	);
	const monthlyFlowRate = totalFlowRate * ONE_MONTH_SECONDS;
	const { symbol, decimals } = tokenStream[0].token;
	const runOutMonth = balance?.value ? balance?.value / monthlyFlowRate : 0n;

	return (
		<RowWrapper>
			<TableCell>
				<TokenIcon symbol={underlyingSymbol} />
				<P>{limitFraction(balance?.formatted || '0')}</P>
				<P>{symbol}</P>
			</TableCell>
			<TableCell>
				<P color={semanticColors.jade[500]}>
					{limitFraction(
						formatUnits(monthlyFlowRate || 0n, decimals),
					)}
					&nbsp;
					{underlyingSymbol}
					&nbsp;monthly
				</P>
			</TableCell>
			<TableCell>{tokenStream.length}</TableCell>
			<TableCell>
				{runOutMonth.toString()}
				{formatMessage(
					{ id: 'label.months' },
					{ count: runOutMonth.toString() },
				)}
			</TableCell>
			<TableCell>Modify stream balance</TableCell>
		</RowWrapper>
	);
};

const RowWrapper = styled.div`
	display: contents;
`;
