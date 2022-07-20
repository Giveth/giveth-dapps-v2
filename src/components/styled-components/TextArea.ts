import styled from 'styled-components';
import {
	brandColors,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { InputHTMLAttributes } from 'react';
import { Shadow } from '@/components/styled-components/Shadow';
import { EInputValidation, IInputValidation } from '@/types/inputValidation';

interface ITextareaProps
	extends InputHTMLAttributes<HTMLTextAreaElement>,
		IInputValidation {}

export const TextArea = styled.textarea<ITextareaProps>`
	width: 100%;
	border-radius: 8px;
	font-family: 'Red Hat Text', sans-serif;
	font-size: 16px;
	height: ${props => props.height || '274px'};
	padding: 16px;
	resize: none;
	border: 2px solid
		${props => {
			switch (props.validation) {
				case EInputValidation.NORMAL:
					return neutralColors.gray[300];
				case EInputValidation.WARNING:
					return semanticColors.golden[600];
				case EInputValidation.ERROR:
					return semanticColors.punch[500];
				case EInputValidation.SUCCESS:
					return semanticColors.jade[500];
				default:
					return neutralColors.gray[300];
			}
		}};
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
	:hover {
		box-shadow: ${Shadow.Neutral[400]};
	}
	:focus {
		border: 2px solid
			${props => {
				switch (props.validation) {
					case EInputValidation.NORMAL:
						return brandColors.giv[600];
					case EInputValidation.WARNING:
						return semanticColors.golden[700];
					case EInputValidation.ERROR:
						return semanticColors.punch[700];
					case EInputValidation.SUCCESS:
						return semanticColors.jade[700];
					default:
						return brandColors.giv[600];
				}
			}};
	}
`;
