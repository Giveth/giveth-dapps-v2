import { brandColors, H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@giveth/ui-design-system';
import { formatWeiHelper } from '@/helpers/number';
import { smallFormatDate } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import { getUnlockDate } from '@/helpers/givpower';
import type { FC } from 'react';
import type { IGIVpower } from '@/types/subgraph';

interface ILockingBrief {
	round: number;
	amount: bigint;
	onLocking?: boolean;
}
const LockingBrief: FC<ILockingBrief> = ({
	round,
	amount,
	onLocking = false,
}) => {
	const givpowerInfo = useAppSelector(
		state => state.subgraph.gnosisValues.givpowerInfo,
	) as IGIVpower;
	const unlockDate = new Date(getUnlockDate(givpowerInfo, round));
	return (
		<BriefContainer>
			<H5>{`You ${onLocking ? 'are locking' : 'locked'} `}</H5>
			<H5White weight={700}>
				{formatWeiHelper(amount.toString())} GIV
			</H5White>
			<H5White>until {smallFormatDate(unlockDate)}</H5White>
		</BriefContainer>
	);
};

export const BriefContainer = styled(Flex)`
	color: ${brandColors.giv[300]};
	flex-direction: column;
	gap: 8px;
`;
export const H5White = styled(H5)`
	color: ${brandColors.giv['000']};
`;

export default LockingBrief;
