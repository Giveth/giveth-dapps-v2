import { useState, useMemo, type FC } from 'react';
import styled from 'styled-components';
import { P, brandColors, semanticColors } from '@giveth/ui-design-system';
import { formatUnits } from 'viem';
import { useAccount, useBalance, useSwitchChain } from 'wagmi';
import { useIntl } from 'react-intl';
import { TokenIcon } from '@/components/views/donate/TokenIcon/TokenIcon';
import { TableCell } from './ActiveStreamsSection';
import { ISuperfluidStream } from '@/types/superFluid';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { limitFraction, formatDonation } from '@/helpers/number';
import config from '@/configuration';
import { countActiveStreams } from '@/helpers/donate';
import { findTokenByAddress } from '@/helpers/superfluid';
import { ModifySuperTokenModal } from '@/components/views/donate/Recurring/ModifySuperToken/ModifySuperTokenModal';

interface IStreamRowProps {
	tokenStream: ISuperfluidStream[];
}

export const StreamRow: FC<IStreamRowProps> = ({ tokenStream }) => {
	const superToken = useMemo(
		() =>
			config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
				s => s.id === tokenStream[0].token.id,
			),
		[tokenStream],
	);
	const [showModifyModal, setShowModifyModal] = useState(false);
	const { address, chain } = useAccount();
	const { switchChain } = useSwitchChain();
	const { formatMessage } = useIntl();

	const chainId = chain?.id;

	const { data: balance, refetch } = useBalance({
		token: tokenStream[0].token.id,
		address: address,
		chainId: config.OPTIMISM_NETWORK_NUMBER,
	});

	const token = findTokenByAddress(tokenStream[0].token.id);
	const underlyingSymbol = token?.underlyingToken?.symbol || '';
	const totalFlowRate = tokenStream.reduce(
		(acc, curr) => acc + BigInt(curr.currentFlowRate),
		0n,
	);
	const monthlyFlowRate = totalFlowRate * ONE_MONTH_SECONDS;
	// const { symbol } = tokenStream[0].token;
	const runOutMonth =
		monthlyFlowRate > 0 && balance?.value
			? balance?.value / monthlyFlowRate
			: 0n;
	const activeStreamCount = countActiveStreams(tokenStream);

	return (
		<RowWrapper>
			<TableCell>
				<TokenIcon symbol={underlyingSymbol} />
				<P>
					{balance && balance.value
						? limitFraction(
								formatUnits(balance.value, balance.decimals),
							)
						: '0'}
				</P>
				<P>{superToken?.symbol}</P>
			</TableCell>
			<TableCell>
				<P color={semanticColors.jade[500]}>
					{formatDonation(
						limitFraction(formatUnits(BigInt(monthlyFlowRate), 18)),
					)}
					&nbsp;
					{underlyingSymbol}
					&nbsp;monthly
				</P>
			</TableCell>
			<TableCell>
				{activeStreamCount}
				&nbsp;
				{formatMessage(
					{ id: 'label.number_projects' },
					{
						count: activeStreamCount,
					},
				)}
			</TableCell>
			<TableCell>
				{totalFlowRate === 0n ? (
					'--'
				) : runOutMonth < 1 ? (
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
			{showModifyModal && superToken && (
				<ModifySuperTokenModal
					tokenStreams={tokenStream}
					setShowModal={setShowModifyModal}
					selectedToken={superToken}
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
