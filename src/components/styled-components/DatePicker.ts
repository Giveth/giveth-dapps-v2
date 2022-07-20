import {
	brandColors,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import { Shadow } from './Shadow';

export const StyledDatePicker = styled(DatePicker)<{
	hasRightIcon?: boolean;
	hasError?: boolean;
}>`
	width: 100%;
	border-radius: 8px;
	border: 2px solid ${neutralColors.gray[300]};
	border-color: ${props =>
		props.hasError ? semanticColors.punch[500] : neutralColors.gray[300]};
	padding: 15px 16px;
	padding-right: 50px;
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

export const DatePickerWrapper = styled.div`
	position: relative;
	max-width: 520px;
	> svg {
		z-index: 1;
		position: absolute;
		transform: translateY(-50%);
		padding-right: 14px;
		border-left: 1px solid ${neutralColors.gray[400]};
		width: 40px;
		height: 20px;
		top: 50%;
		right: 0;
		overflow: hidden;
	}
`;
