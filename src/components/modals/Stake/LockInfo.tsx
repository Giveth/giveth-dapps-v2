import {
	B,
	brandColors,
	Caption,
	H4,
	H6,
	IconHelp,
	IconSpark,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { useGIVpower } from '@/context/givpower.context';
import { formatEthHelper } from '@/helpers/number';
import type { FC } from 'react';

interface ILockInfo {
	round: number;
}

const LockInfo: FC<ILockInfo> = ({ round }) => {
	const { apr } = useGIVpower();
	const multipler = Math.sqrt(1 + round).toPrecision(3);

	return (
		<LockInfoContainer>
			<Flex alignItems='baseline' gap='12px'>
				<LockInfoTitle>Your multiplier</LockInfoTitle>
				<MultiPlyValue weight={700}>
					x{multipler}
					<MultiPlyHelp>
						<IconWithTooltip
							icon={<IconHelp size={16} />}
							direction={'top'}
						>
							<LockInfotooltip>
								The longer you lock your GIV, the greater your
								APR & GIVpower.
							</LockInfotooltip>
						</IconWithTooltip>
					</MultiPlyHelp>
				</MultiPlyValue>
			</Flex>
			<LockInfoRow justifyContent='space-between'>
				<LockInfoRowTitle medium>
					APR
					<LockInfoRowHelp>
						<IconWithTooltip
							icon={<IconHelp size={16} />}
							direction={'right'}
						>
							<LockInfotooltip>
								This is you rate of return for this set of GIV
								tokens.
							</LockInfotooltip>
						</IconWithTooltip>
					</LockInfoRowHelp>
				</LockInfoRowTitle>
				<LockInfoRowValue>
					{apr
						? `${formatEthHelper(apr.multipliedBy(multipler))}%`
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
							icon={<IconHelp size={16} />}
							direction={'right'}
						>
							<LockInfotooltip>
								GIVpower allows you to support verified projects
								on Giveth while earning rewards.
							</LockInfotooltip>
						</IconWithTooltip>
					</LockInfoRowHelp>
				</LockInfoRowTitle>
				<LockInfoRowValue>0</LockInfoRowValue>
			</LockInfoRow>
			<LockInfoRow justifyContent='space-between'>
				<LockInfoRowTitle medium>
					gGIV
					<LockInfoRowHelp>
						<IconWithTooltip
							icon={<IconHelp size={16} />}
							direction={'right'}
						>
							<LockInfotooltip>
								gGIV is your nontransferable GIVgarden voting
								power, given at a 1:1 ratio with staked GIV.
							</LockInfotooltip>
						</IconWithTooltip>
					</LockInfoRowHelp>
				</LockInfoRowTitle>
				<LockInfoRowValue>0</LockInfoRowValue>
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

const LockInfotooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 160px;
`;

export default LockInfo;
