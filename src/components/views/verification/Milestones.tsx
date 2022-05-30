import { H6, Lead, neutralColors } from '@giveth/ui-design-system';
import { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { StyledDatePicker } from '@/components/datePickers/DatePicker.styles';

export default function Milestones() {
	const [startDate, setStartDate] = useState(new Date());
	return (
		<>
			<H6 weight={700}>Activity and Milestones</H6>
			<br />
			<Lead>When was your organization/project founded?</Lead>
			<br />
			<StyledDatePicker
				selected={startDate}
				onChange={(date: Date) => setStartDate(date)}
				dateFormat='MM/yyyy'
			/>
			{/* <StyledInput
				selected={startDate}
				onChange={(date: Date) => setStartDate(date)}
			/> */}

			<Lead>
				What is your organization/project's mission and how does it
				align with creating positive change in the world?
			</Lead>
		</>
	);
}

const StyledInput = styled(DatePicker)`
	margin-bottom: 20px;
	width: 100%;
	padding: 15px 16px;
	border-radius: 8px;
	border: 2px solid ${neutralColors.gray[300]};
`;
