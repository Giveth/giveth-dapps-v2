import { P, B, neutralColors, Flex } from '@giveth/ui-design-system';
import { type FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { smallFormatDate } from '@/lib/helpers';

interface IRunOutInfoProps {
	superTokenBalance: bigint;
	streamFlowRatePerMonth: bigint;
	symbol: string;
}

export const RunOutInfo: FC<IRunOutInfoProps> = ({
	superTokenBalance,
	streamFlowRatePerMonth,
	symbol,
}) => {
	const { formatMessage } = useIntl();
	const totalPerSecond = streamFlowRatePerMonth / ONE_MONTH_SECONDS;
	const secondsUntilRunOut =
		totalPerSecond > 0 ? superTokenBalance / totalPerSecond : 0n;
	const date = new Date();
	date.setSeconds(date.getSeconds() + Number(secondsUntilRunOut.toString()));

	return (
		<RunOutSection>
			<P>
				{formatMessage({
					id: 'label.your_stream_balance',
				})}{' '}
				{symbol}{' '}
				{formatMessage({
					id: 'label.runout_info',
				})}
			</P>
			<B>{smallFormatDate(date)}</B>
			<P>
				{formatMessage({
					id: 'label.runout_info_topup',
				})}
			</P>
		</RunOutSection>
	);
};

const RunOutSection = styled(Flex)`
	flex-direction: column;
	gap: 8px;
	border-top: 1px solid ${neutralColors.gray[600]};
	padding-top: 16px;
	align-items: flex-start;
`;
