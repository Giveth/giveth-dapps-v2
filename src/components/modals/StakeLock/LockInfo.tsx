import {
	B,
	brandColors,
	Caption,
	H4,
	H6,
	IconHelpFilled16,
	IconSpark,
	mediaQueries,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { Flex } from '@/components/styled-components/Flex';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { formatEthHelper, formatWeiHelper } from '@/helpers/number';
import { getGivStakingConfig } from '@/helpers/networkProvider';
import { useStakingPool } from '@/hooks/useStakingPool';
import config from '@/configuration';
import type { FC } from 'react';

interface ILockInfo {
	round: number;
	amount: string;
}

const LockInfo: FC<ILockInfo> = ({ round, amount }) => {
	const { apr } = useStakingPool(getGivStakingConfig(config.XDAI_CONFIG));
	const multipler = Math.sqrt(1 + round);

	return (
		<LockInfoContainer>
			<Flex alignItems='baseline' gap='12px'>
				<LockInfoTitle>Your multiplier</LockInfoTitle>
				<MultiPlyValue weight={700}>
					x{multipler.toFixed(2)}
					<MultiPlyHelp>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction={'top'}
						>
							<LockInfoTooltip>
								The longer you lock your GIV, the greater your
								APR & GIVpower.
							</LockInfoTooltip>
						</IconWithTooltip>
					</MultiPlyHelp>
				</MultiPlyValue>
			</Flex>
			<LockInfoRow justifyContent='space-between'>
				<LockInfoRowTitle medium>
					APR
					<LockInfoRowHelp>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction={'right'}
						>
							<LockInfoTooltip>
								This is your rate of return for this set of GIV
								tokens.
							</LockInfoTooltip>
						</IconWithTooltip>
					</LockInfoRowHelp>
				</LockInfoRowTitle>
				<LockInfoRowValue>
					{apr
						? `${formatEthHelper(
								apr.effectiveAPR.multipliedBy(multipler),
						  )}%`
						: ' ? '}
					<LockInfoRowSpark>
						<IconSpark size={16} />
					</LockInfoRowSpark>
				</LockInfoRowValue>
			</LockInfoRow>
			<LockInfoRow justifyContent='space-between'>
				<LockInfoRowTitle medium>
					GIVpower
					<LockInfoRowHelp>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction={'right'}
						>
							<LockInfoTooltip>
								GIVpower allows you to support verified projects
								on Giveth while earning rewards.
							</LockInfoTooltip>
						</IconWithTooltip>
					</LockInfoRowHelp>
				</LockInfoRowTitle>
				<LockInfoRowValue>
					{amount
						? formatWeiHelper(
								new BigNumber(amount).multipliedBy(multipler),
						  )
						: 0}
				</LockInfoRowValue>
			</LockInfoRow>
		</LockInfoContainer>
	);
};

const LockInfoTitle = styled(H6)`
	color: ${brandColors.giv[200]};
`;

const LockInfoContainer = styled.div`
	border: 2px solid ${brandColors.giv[500]};
	border-radius: 8px;
	padding: 24px 16px 16px;
	margin: 24px 0;
`;

const MultiPlyValue = styled(H4)`
	position: relative;
`;

const MultiPlyHelp = styled.div`
	position: absolute;
	top: -16px;
	right: -20px;
	cursor: pointer;
	&:hover {
		color: ${brandColors.giv[200]};
	}
`;
const LockInfoRow = styled(Flex)`
	margin-top: 8px;
`;

const LockInfoRowTitle = styled(Caption)`
	position: relative;
`;

const LockInfoRowValue = styled(B)`
	position: relative;
`;

const LockInfoRowHelp = styled.div`
	position: absolute;
	top: 1px;
	right: -24px;
	cursor: pointer;
	&:hover {
		color: ${brandColors.giv[200]};
	}
`;

const LockInfoRowSpark = styled.div`
	position: absolute;
	top: 3px;
	left: -18px;
	cursor: pointer;
	color: ${brandColors.mustard[500]};
	&:hover {
		color: ${brandColors.mustard[400]};
	}
`;

export const LockInfoTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	${mediaQueries.tablet} {
		width: 160px;
	}
`;

export default LockInfo;
