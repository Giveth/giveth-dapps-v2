import { neutralColors } from '@giveth/ui-design-system';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';

export const StyledDatePicker = styled(DatePicker)`
	margin-bottom: 20px;
	width: 100%;
	padding: 15px 16px;
	border-radius: 8px;
	border: 2px solid ${neutralColors.gray[300]};
`;
