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
	background: linear-gradient(
		180deg,
		rgba(56, 17, 191, 0) 30%,
		rgba(26, 4, 102, 1) 80%
	);
	z-index: 2;
	gap: 16px;
`;
