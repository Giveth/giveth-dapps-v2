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
import NetworkLogo from '@/components/NetworkLogo';

interface IStreamRowProps {
	tokenStream: ISuperfluidStream[];
}

export const StreamRow: FC<IStreamRowProps> = ({ tokenStream }) => {
	const superToken = useMemo(() => {
		const networkId = tokenStream[0].networkId;

		// Use the appropriate configuration based on the networkId
		const tokenConfig =
			networkId === config.BASE_NETWORK_NUMBER
				? config.BASE_CONFIG.SUPER_FLUID_TOKENS
				: networkId === config.OPTIMISM_NETWORK_NUMBER
					? config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS
					: [];

		// Find the super token in the selected configuration
		return (
			tokenConfig.find(
				s =>
					s.id.toLowerCase() ===
					tokenStream[0].token.id.toLowerCase(),
			) || null
		);
	}, [tokenStream]);

	const [showModifyModal, setShowModifyModal] = useState(false);
	const { address, chain } = useAccount();
	const { switchChain } = useSwitchChain();
	const { formatMessage } = useIntl();

	const recurringNetworkId = tokenStream[0].networkId;

	const chainId = chain?.id;

	const { data: balance, refetch } = useBalance({
		token: tokenStream[0].token.id,
		address: address,
		chainId: tokenStream[0].networkId,
	});

	const token = findTokenByAddress(
		tokenStream[0].token.id,
		tokenStream[0].networkId,
	);
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
								3,
							)
						: '0'}
				</P>
				<P>{superToken?.symbol}</P>
			</TableCell>
			<TableCell>
				<P color={semanticColors.jade[500]}>
					{formatDonation(
						limitFraction(formatUnits(BigInt(monthlyFlowRate), 18)),
						undefined,
						undefined,
						undefined,
						3,
					)}
					&nbsp;
					{underlyingSymbol}
					&nbsp;monthly
				</P>
			</TableCell>
			<TableCell>
				<NetworkLogoWrapper>
					<NetworkLogo chainId={recurringNetworkId} logoSize={32} />
				</NetworkLogoWrapper>
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
						if (chainId !== recurringNetworkId) {
							switchChain?.({
								chainId: recurringNetworkId,
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
				<>
					<ModifySuperTokenModal
						tokenStreams={tokenStream}
						setShowModal={setShowModifyModal}
						selectedToken={superToken}
						refreshBalance={refetch}
						recurringNetworkID={recurringNetworkId}
					/>
				</>
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

const NetworkLogoWrapper = styled.div`
	margin-left: 5px;
`;
