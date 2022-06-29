import { brandColors, H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { formatWeiHelper } from '@/helpers/number';
import type { FC } from 'react';

interface ILockingBrief {
	round: number;
	amount: string;
}
const LockingBrief: FC<ILockingBrief> = ({ round, amount }) => {
	return (
		<StakingBriefContainer>
			<H5>You are locking </H5>
			<H5White weight={700}>{formatWeiHelper(amount, 2)} GIV</H5White>
			<H5White>until April x, 2023</H5White>
		</StakingBriefContainer>
	);
};

const StakingBriefContainer = styled(Flex)`
	color: ${brandColors.giv[300]};
	flex-direction: column;
	gap: 8px;
`;
const H5White = styled(H5)`
	color: ${brandColors.giv['000']};
`;

export default LockingBrief;
