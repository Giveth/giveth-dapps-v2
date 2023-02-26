import { brandColors, B, P, Caption } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '../styled-components/Flex';

export const FlowrateRow = styled(Flex)`
	align-items: center;
	margin-top: 8px;
	gap: 4px;
`;

export const FlowrateAmount = styled(B)`
	padding-left: 4px;
`;

export const FlowrateUnit = styled(P)`
	color: ${brandColors.deep[100]};
`;

export const PartAmount = styled(Caption)``;
export const PartUnit = styled(Caption)``;

export const IconHelpWrapper = styled.div`
	cursor: pointer;
	color: ${brandColors.deep[100]};
`;

export const ForwardWrapper = styled.div`
	position: absolute;
	top: 22px;
	right: 16px;
`;
