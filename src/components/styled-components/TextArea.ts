import styled from 'styled-components';
import { brandColors, neutralColors } from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';

interface ITextareaProps {
	height?: string;
}

export const TextArea = styled.textarea<ITextareaProps>`
	width: 100%;
	border-radius: 8px;
	font-family: 'Red Hat Text', sans-serif;
	font-size: 1rem;
	border: 2px solid ${neutralColors.gray[300]};
	padding: 16px;
	height: ${props => props.height || '274px'};
	resize: none;
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
	:hover {
		box-shadow: ${Shadow.Neutral[400]};
	}
	:focus-within {
		border-color: ${brandColors.giv[600]};
	}
`;
