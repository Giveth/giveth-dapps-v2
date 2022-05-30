import {
	B,
	brandColors,
	Caption,
	H4,
	H6,
	IconHelp,
	IconSpark,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

const LockInfo = () => {
	return (
		<LockInfoContainer>
			<Flex alignItems='baseline' gap='12px'>
				<LockInfoTitle>Your multiplier</LockInfoTitle>
				<MultiPlyValue weight={700}>
					x2
					<MultiPlyHelp>
						<IconHelp size={16} />
					</MultiPlyHelp>
				</MultiPlyValue>
			</Flex>
			<LockInfoRow justifyContent='space-between'>
				<LockInfoRowTitle medium>
					APR
					<LockInfoRowHelp>
						<IconHelp size={16} />
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
						<IconHelp size={16} />
					</LockInfoRowHelp>
				</LockInfoRowTitle>
				<LockInfoRowValue>0</LockInfoRowValue>
			</LockInfoRow>
			<LockInfoRow justifyContent='space-between'>
				<LockInfoRowTitle medium>
					gGIV
					<LockInfoRowHelp>
						<IconHelp size={16} />
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

export default LockInfo;
