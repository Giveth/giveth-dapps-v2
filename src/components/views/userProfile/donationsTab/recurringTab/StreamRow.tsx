import { useState, type FC } from 'react';
import styled from 'styled-components';
import { P, brandColors, semanticColors } from '@giveth/ui-design-system';
import { formatUnits } from 'viem';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { useIntl } from 'react-intl';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import { TableCell } from './ActiveStreamsSection';
import { ISuperfluidStream } from '@/types/superFluid';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { limitFraction } from '@/helpers/number';
import { ModifySuperTokenModal } from '@/components/views/donate/ModifySuperToken/ModifySuperTokenModal';
import config from '@/configuration';

interface IStreamRowProps {
	tokenStream: ISuperfluidStream[];
}

export const StreamRow: FC<IStreamRowProps> = ({ tokenStream }) => {
	const [showModifyModal, setShowModifyModal] = useState(false);
	const { address, chain } = useAccount();
	const { switchChain } = useSwitchChain();

	const chainId = chain?.id;
	const { formatMessage } = useIntl();

	const { data: balance, refetch } = useBalance({
		token: tokenStream[0].token.id,
		address: address,
		chainId: config.OPTIMISM_NETWORK_NUMBER,
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
			<TableCell>{tokenStream.length} Projects</TableCell>
			<TableCell>
				{runOutMonth < 1 ? (
					' < 1 Month '
				) : (
					<>
						{runOutMonth.toString()}
						{formatMessage(
							{ id: 'label.months' },
							{ count: runOutMonth.toString() },
						)}
					</>
				)}
			</TableCell>
			<TableCell>
				<ModifyButton
					onClick={() => {
						if (chainId !== config.OPTIMISM_NETWORK_NUMBER) {
							switchChain?.({
								chainId: config.OPTIMISM_NETWORK_NUMBER,
							});
						} else {
							setShowModifyModal(true);
						}
					}}
				>
					Deposit/Withdraw
				</ModifyButton>
			</TableCell>
			{showModifyModal && (
				<ModifySuperTokenModal
					tokenStreams={tokenStream}
					setShowModal={setShowModifyModal}
					selectedToken={tokenStream[0].token}
					refreshBalance={refetch}
				/>
			)}
		</RowWrapper>
	);
};

const RowWrapper = styled.div`
	display: contents;
`;

const ModifyButton = styled(P)`
	cursor: pointer;
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;
