import { brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FlexCenter } from '../styled-components/Flex';

export const Cover = styled(FlexCenter)`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 24px;
	background: ${brandColors.giv[900]}dd;
	z-index: 2;
	gap: 16px;
`;
