import {
	brandColors,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';

export const Input = styled.input<{ error?: boolean }>`
	width: 100%;
	height: 56px;
	border: 2px solid
		${props =>
			props.error ? semanticColors.punch[500] : neutralColors.gray[300]};
	border-radius: 8px;
	padding: 17.5px 0 17.5px 16px;
	font-size: 16px;
	box-shadow: ${Shadow.Neutral[400]};
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
	:disabled {
		background: ${neutralColors.gray[300]};
	}
	:focus-within {
		border: ${props => !props.error && `2px solid ${brandColors.giv[600]}`};
	}
`;
