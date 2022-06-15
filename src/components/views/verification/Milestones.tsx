import {
	Button,
	H6,
	IconChevronDown,
	Lead,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { TextArea } from '@/components/styled-components/TextArea';
import {
	StyledDatePicker,
	DatePickerWrapper,
} from '@/components/styled-components/DatePicker';
import ImageUploader from '@/components/ImageUploader';
import { ContentSeparator, BtnContainer } from './VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import { UPDATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import { PROJECT_VERIFICATION_STEPS } from '@/apollo/types/types';

export default function Milestones() {
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [file, setFile] = useState<File>();
	const [uploading, setUploading] = useState(false);
	const [loading, setloading] = useState(false);
	const [isChanged, setIsChanged] = useState(false);

	const { verificationData, setVerificationData, setStep } =
		useVerificationData();
	const { milestones } = verificationData || {};
	const [mission, setMission] = useState(milestones?.mission || '');
	const [achievedMilestones, setAchievedMilestones] = useState(
		milestones?.achievedMilestones || '',
	);
	const [url, setUrl] = useState<string>(
		milestones?.achievedMilestonesProof || '',
	);

	const handleNext = () => {
		async function sendReq() {
			setloading(true);
			const { data } = await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: PROJECT_VERIFICATION_STEPS.MILESTONES,
						milestones: {
							foundationDate: startDate,
							mission,
							achievedMilestones,
							achievedMilestonesProof: url,
						},
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setloading(false);
			setStep(6);
		}

		if (isChanged) {
			sendReq();
		} else {
			setStep(6);
		}
	};

	return (
		<>
			<div>
				<H6 weight={700}>Activity and Milestones</H6>
				<LeadStyled>
					When was your organization/project founded?
				</LeadStyled>
				<br />
				<DatePickerWrapper>
					<IconChevronDown color={neutralColors.gray[600]} />
					<StyledDatePicker
						selected={startDate}
						onChange={(date: Date) => {
							setIsChanged(true);
							setStartDate(date);
						}}
						dateFormat='MM/yyyy'
						showMonthYearPicker
						showPopperArrow={false}
						placeholderText='Select a date'
					/>
				</DatePickerWrapper>
				<LeadStyled>
					What is your organization/project's mission and how does it
					align with creating positive change in the world?
				</LeadStyled>
				<Paragraph>
					Please describe how your project is benefiting society and
					the world at large.
				</Paragraph>
				<TextArea
					value={mission}
					height='82px'
					onChange={e => {
						setIsChanged(true);
						setMission(e.target.value);
					}}
				/>
				<LeadStyled>
					Which milestones has your organization/project achieved
					since conception? This question is required.
				</LeadStyled>
				<Paragraph>
					Please provide links to photos, videos, testimonials or
					other evidence of your project's impact.
				</Paragraph>
				<TextArea
					value={achievedMilestones}
					height='82px'
					onChange={e => {
						setIsChanged(true);
						setAchievedMilestones(e.target.value);
					}}
				/>
				<LeadStyled>
					If you cannot provide links to evidence of milestones that
					have already been achieved, you can upload proof here.
				</LeadStyled>
				<Paragraph>Upload photo</Paragraph>
				<ImageUploader
					url={url}
					setUrl={setUrl}
					setIsUploading={setUploading}
				/>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button onClick={() => setStep(4)} label='<     PREVIOUS' />
					<Button
						onClick={() => handleNext()}
						loading={loading}
						disabled={uploading}
						label='NEXT     >'
					/>
				</BtnContainer>
			</div>
		</>
	);
}

const LeadStyled = styled(Lead)`
	margin-top: 25px;
`;

const Paragraph = styled(P)`
	color: ${neutralColors.gray[700]};
	margin-top: 8px;
	margin-bottom: 24px;
`;
