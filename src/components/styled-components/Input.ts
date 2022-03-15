import { neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

export const Regular_Input = styled.input`
	width: 100%;
	height: 56px;
	border: 1px solid #ebecf2;
	border-radius: 8px;
	padding: 17.5px 0 17.5px 16px;
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;
