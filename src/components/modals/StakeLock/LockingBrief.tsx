import { brandColors, H5, Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { formatWeiHelper } from '@/helpers/number';
import { smallFormatDate } from '@/lib/helpers';
import { getUnlockDate } from '@/helpers/givpower';
import config from '@/configuration';
import { fetchSubgraphData } from '@/components/controller/subgraph.ctrl';
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
	const { address } = useAccount();
	const gnosisValues = useQuery({
		queryKey: ['subgraph', config.GNOSIS_NETWORK_NUMBER, address],
		queryFn: async () =>
			await fetchSubgraphData(config.GNOSIS_NETWORK_NUMBER, address),
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
	const givpowerInfo = gnosisValues.data?.givpowerInfo as IGIVpower;
	const unlockDate = new Date(getUnlockDate(givpowerInfo, round));
	return (
		<BriefContainer>
			<H5
				id={`${onLocking ? 'givpower-locking' : 'givpower-locked'}`}
			>{`You ${onLocking ? 'are locking' : 'locked'} `}</H5>
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
