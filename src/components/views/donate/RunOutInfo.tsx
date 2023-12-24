import { P, B, neutralColors } from '@giveth/ui-design-system';
import { type FC } from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { ONE_MONTH_SECONDS } from '@/lib/constants/constants';
import { formatDate } from '@/lib/helpers';

interface IRunOutInfoProps {
	amount: bigint;
	totalPerMonth: bigint;
}

export const RunOutInfo: FC<IRunOutInfoProps> = ({ amount, totalPerMonth }) => {
	const totalPerSecond = totalPerMonth / ONE_MONTH_SECONDS;
	const secondsUntilRunOut = amount / totalPerSecond;
	const date = new Date();
	date.setSeconds(date.getSeconds() + Number(secondsUntilRunOut.toString()));
	return (
		<RunOutSection>
			<P>Your stream balance will run out funds on </P>
			<B>{formatDate(date)}</B>
			<P>Top-up before then!</P>
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
