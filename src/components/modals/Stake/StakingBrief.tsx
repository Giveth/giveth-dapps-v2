import { brandColors, H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import type { FC } from 'react';

interface IStakingBrief {
	round: number;
	amount: string;
}
const StakingBrief: FC<IStakingBrief> = ({ round, amount }) => {
	return (
		<StakingBriefContainer>
			<H5>You are locking </H5>
			<H5White weight={700}>{amount} GIV token</H5White>
			<Flex justifyContent='center'>
				<H5>for &nbsp;</H5>
				<H5White weight={700}>
					{round} round{round > 1 && 's'}
				</H5White>
			</Flex>
			<H5White>(until April x, 2023)</H5White>
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

export default StakingBrief;
