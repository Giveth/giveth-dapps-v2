import {
	H6,
	IconChevronDown,
	Lead,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { TextArea } from '@/components/styled-components/TextArea';
import {
	StyledDatePicker,
	DatePickerWrapper,
} from '@/components/datePickers/DatePicker.styles';
import ImageUploader from '@/components/ImageUploader';

export default function Milestones() {
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [file, setFile] = useState<File>();
	const [url, setUrl] = useState<string>('');
	const [uploading, setUploading] = useState(false);

	const { getRootProps, getInputProps, open } = useDropzone({
		accept: 'image/*',
		multiple: false,
		noClick: true,
		noKeyboard: true,
		onDrop: async (acceptedFiles: File[]) => {
			setFile(acceptedFiles[0]);
			// setUploading(true);
			// await onDrop(acceptedFiles);
			// setUploading(false);
		},
	});
	return (
		<>
			<H6 weight={700}>Activity and Milestones</H6>
			<br />
			<Lead>When was your organization/project founded?</Lead>
			<br />
			<DatePickerWrapper>
				<IconChevronDown color={neutralColors.gray[600]} />
				<StyledDatePicker
					selected={startDate}
					onChange={(date: Date) => setStartDate(date)}
					dateFormat='MM/yyyy'
					showMonthYearPicker
					showPopperArrow={false}
					placeholderText='Select a date'
				/>
			</DatePickerWrapper>

			<Lead style={{ marginTop: '20px' }}>
				What is your organization/project's mission and how does it
				align with creating positive change in the world?
			</Lead>
			<Paragraph>
				Please describe how your project is benefiting society and the
				world at large.
			</Paragraph>
			<br />
			<TextArea height='82px' />
			<br />
			<Lead>
				Which milestones has your organization/project achieved since
				conception? This question is required.
			</Lead>
			<Paragraph>
				Please provide links to photos, videos, testimonials or other
				evidence of your project's impact.
			</Paragraph>
			<br />
			<TextArea height='82px' />
			<br />
			<Lead>
				If you cannot provide links to evidence of milestones that have
				already been achieved, you can upload proof here.
			</Lead>
			<Paragraph>Upload photo</Paragraph>
			<ImageUploader url={url} setUrl={setUrl} />
		</>
	);
}

const Paragraph = styled(P)`
	color: ${neutralColors.gray[700]};
	margin-top: 12px;
`;
