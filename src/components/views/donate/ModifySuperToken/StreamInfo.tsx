import { formatEther } from 'viem';
import { Caption, neutralColors, Flex } from '@giveth/ui-design-system';
import { Dispatch, SetStateAction, type FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { type GetBalanceReturnType } from '@wagmi/core';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { limitFraction } from '@/helpers/number';
import { ISuperToken, ISuperfluidStream } from '@/types/superFluid';
import { countActiveStreams } from '@/helpers/donate';

interface IStreamInfoProps {
	tokenStreams: ISuperfluidStream[];
	superToken?: ISuperToken;
	SuperTokenBalance?: GetBalanceReturnType;
	inputAmount?: bigint;
	type?: string;
	setIsWarning?: Dispatch<SetStateAction<boolean>>;
}

export const StreamInfo: FC<IStreamInfoProps> = ({
	tokenStreams,
	superToken,
	SuperTokenBalance,
	inputAmount,
	type,
	setIsWarning,
}) => {
	inputAmount == null && (inputAmount = 0n);
	const { formatMessage } = useIntl();
	const totalStreamPerSec =
		tokenStreams?.reduce(
			(acc, stream) => acc + BigInt(stream.currentFlowRate),
			0n,
		) || 0n;
	const estimatedBalance =
		(SuperTokenBalance?.value || 0n) +
		(type == 'withdraw' ? -BigInt(inputAmount) : BigInt(inputAmount));
	const streamRunOutInMonth =
		SuperTokenBalance !== undefined &&
		totalStreamPerSec > 0 &&
		SuperTokenBalance.value > 0n
			? estimatedBalance / totalStreamPerSec / ONE_MONTH_SECONDS
			: 0n;

	if (streamRunOutInMonth < 1n && totalStreamPerSec > 0 && setIsWarning) {
		setIsWarning(true);
	} else if (setIsWarning) {
		setIsWarning(false);
	}
	const activeStreamsCount = countActiveStreams(tokenStreams);

	return (
		<StreamSection>
			<Flex $alignItems='center' $justifyContent='space-between'>
				<Caption $medium>
					{formatMessage({
						id: 'label.new_stream_balance',
					})}
				</Caption>
				<StreamBalanceInfo $medium>
					{estimatedBalance < 0n
						? '0'
						: limitFraction(formatEther(estimatedBalance))}{' '}
					{superToken?.symbol}
				</StreamBalanceInfo>
			</Flex>
			<Flex $alignItems='center' $justifyContent='space-between'>
				<Caption>
					{formatMessage({
						id: 'label.balance_runs_out_in',
					})}{' '}
					{totalStreamPerSec > 0 ? (
						<strong>
							{streamRunOutInMonth < 1n ? (
								' < 1 Month '
							) : (
								<>
									{streamRunOutInMonth.toString()}{' '}
									{formatMessage(
										{
											id: 'label.months',
										},
										{
											count: streamRunOutInMonth.toString(),
										},
									)}
								</>
							)}
						</strong>
					) : (
						'--'
					)}
				</Caption>
				<Caption>
					{formatMessage({ id: 'label.funding' })}{' '}
					<strong>{activeStreamsCount}</strong>{' '}
					{formatMessage(
						{ id: 'label.projects_count' },
						{
							count: activeStreamsCount,
						},
					)}
				</Caption>
			</Flex>
		</StreamSection>
	);
};

const StreamSection = styled(Flex)`
	flex-direction: column;
	padding: 8px;
	gap: 16px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[200]};
	margin-top: 16px;
	color: ${neutralColors.gray[800]};
`;

const StreamBalanceInfo = styled(Caption)`
	background-color: ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 2px 8px;
`;
