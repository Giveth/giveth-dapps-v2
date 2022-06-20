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

const LockInfo = () => {
	return (
		<LockInfoContainer>
			<Flex alignItems='baseline' gap='12px'>
				<LockInfoTitle>Your multiplier</LockInfoTitle>
				<MultiPlyValue weight={700}>
					x2
					<MultiPlyHelp>
						<IconWithTooltip
							icon={<IconHelp size={16} />}
							direction={'top'}
						>
							<LockInfoooltip>
								The longer you lock your GIV, the greater your
								APR & GIVpower.
							</LockInfoooltip>
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
							<LockInfoooltip>
								This is you rate of return for this set of GIV
								tokens.
							</LockInfoooltip>
						</IconWithTooltip>
					</LockInfoRowHelp>
				</LockInfoRowTitle>
				<LockInfoRowValue>
					0%
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
							<LockInfoooltip>
								GIVpower allows you to support verified projects
								on Giveth while earning rewards.
							</LockInfoooltip>
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
							<LockInfoooltip>
								gGIV is your nontransferable GIVgarden voting
								power, given at a 1:1 ratio with staked GIV.
							</LockInfoooltip>
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

const LockInfoooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 160px;
`;

export default LockInfo;
