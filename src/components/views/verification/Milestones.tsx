import {
	brandColors,
	H6,
	IconChevronDown,
	Lead,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { TextArea } from '@/components/styled-components/TextArea';
import {
	StyledDatePicker,
	DatePickerWrapper,
} from '@/components/datePickers/DatePicker.styles';

// interface IImageUploader {
// 	// multiple: boolean;
// 	setUrl: (url: string) => void;
// 	url: string;
// }

export default function Milestones() {
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [file, setFile] = useState<File>();
	// const [uploading, setUploading] = useState(false);

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
			<br />

			<DropZone {...getRootProps()}>
				<input {...getInputProps()} />
				<Image
					src='/images/icons/image.svg'
					width={36}
					height={36}
					alt='image'
				/>
				<br />
				<P>
					{`Drag & drop an image here or`}{' '}
					<span onClick={open}>Upload from device.</span>
				</P>
				<P>Suggested file size up to 16Mb. </P>
			</DropZone>
		</>
	);
}

const Paragraph = styled(P)`
	color: ${neutralColors.gray[700]};
	margin-top: 12px;
`;

const DropZone = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 34px 20px;
	color: ${brandColors.deep[500]};
	background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23EBECF2FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
	border-radius: 8px;
	img {
		margin: 0 0 30px 0;
	}
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;
