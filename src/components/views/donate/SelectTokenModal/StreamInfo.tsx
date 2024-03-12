import { Caption, neutralColors, Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC } from 'react';
import { formatUnits } from 'viem';
import { useIntl } from 'react-intl';
import { ISuperfluidStream } from '@/types/superFluid';
import { limitFraction } from '@/helpers/number';
import { TokenIconWithGIVBack } from '../TokenIcon/TokenIconWithGIVBack';

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
	const { formatMessage } = useIntl();

	const totalFlowRate = stream.reduce(
		(acc, curr) => acc + BigInt(curr.currentFlowRate),
		0n,
	);
	const remainingMonths =
		balance !== undefined && totalFlowRate !== 0n
			? balance / totalFlowRate / 2628000n
			: 0n;

	const underlyingToken = stream[0].token.underlyingToken;

	return (
		<Wrapper
			gap='16px'
			$alignItems='flex-start'
			$disabled={disable}
			onClick={() => {
				if (disable) return;
				onClick();
			}}
		>
			<TokenIconWithGIVBack
				showGiveBack
				symbol={underlyingToken ? underlyingToken.symbol : 'ETH'}
				size={32}
			/>
			<InfoWrapper
				$flexDirection='column'
				$alignItems='flex-start'
				gap='8px'
			>
				<Row $justifyContent='space-between'>
					<Symbol>
						<Caption $medium>{stream[0].token.symbol}</Caption>
						<GrayCaption>{stream[0].token.name}</GrayCaption>
					</Symbol>
					<Balance gap='4px'>
						<GrayCaption>Stream Balance</GrayCaption>
						<Caption $medium>
							{balance !== undefined
								? limitFraction(
										formatUnits(
											balance,
											stream[0].token.decimals,
										),
										6,
									)
								: '--'}
						</Caption>
						<Caption $medium>{stream[0].token.symbol}</Caption>
					</Balance>
				</Row>
				{totalFlowRate !== undefined && (
					<Row $justifyContent='space-between'>
						<Flex gap='4px'>
							<GrayCaption>
								{formatMessage({
									id: 'label.stream_runs_out_in',
								})}
							</GrayCaption>
							<Caption $medium>
								{remainingMonths.toString() !== '0'
									? remainingMonths.toString()
									: '<1'}
							</Caption>
							<Caption>
								{formatMessage(
									{
										id: 'label.months',
									},
									{
										count: remainingMonths.toString(),
									},
								)}
							</Caption>
						</Flex>
						<Flex gap='4px'>
							<GrayCaption>
								{formatMessage(
									{ id: 'label.funding_count_projects' },
									{
										count: stream.length.toString(),
									},
								)}
							</GrayCaption>
						</Flex>
					</Row>
				)}
			</InfoWrapper>
		</Wrapper>
	);
};

interface IWrapper {
	$disabled?: boolean;
}

const Wrapper = styled(Flex)<IWrapper>`
	padding: 4px 8px;
	cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
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
