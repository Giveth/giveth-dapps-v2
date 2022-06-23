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
import { Controller, useForm } from 'react-hook-form';
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
import { EVerificationSteps } from '@/apollo/types/types';

export interface IMilestonesForm {
	foundationDate?: Date;
	mission?: string;
	achievedMilestones?: string;
	achievedMilestonesProof?: string;
}

export default function Milestones() {
	const [uploading, setUploading] = useState(false);
	const [loading, setloading] = useState(false);

	const { verificationData, setVerificationData, setStep } =
		useVerificationData();
	const { milestones } = verificationData || {};
	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<IMilestonesForm>();

	const handleNext = (formData: IMilestonesForm) => {
		async function sendReq() {
			setloading(true);
			const { data } = await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: EVerificationSteps.MILESTONES,
						milestones: {
							foundationDate: formData.foundationDate?.toString(),
							mission: formData.mission,
							achievedMilestones: formData.achievedMilestones,
							achievedMilestonesProof:
								formData.achievedMilestonesProof,
						},
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setloading(false);
			setStep(6);
		}

		if (isDirty) {
			sendReq();
		} else {
			setStep(6);
		}
	};

	return (
		<form onSubmit={handleSubmit(handleNext)}>
			<div>
				<H6 weight={700}>Activity and Milestones</H6>
				<LeadStyled>
					When was your organization/project founded?
				</LeadStyled>
				<br />
				<DatePickerWrapper>
					<IconChevronDown color={neutralColors.gray[600]} />
					<Controller
						control={control}
						name='foundationDate'
						defaultValue={
							milestones?.foundationDate
								? new Date(milestones?.foundationDate)
								: undefined
						}
						render={({ field }) => (
							<StyledDatePicker
								selected={field.value}
								onChange={date => field.onChange(date)}
								dateFormat='MM/yyyy'
								showMonthYearPicker
								showPopperArrow={false}
								placeholderText='Select a date'
							/>
						)}
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
					height='82px'
					defaultValue={milestones?.mission}
					{...register('mission')}
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
					height='82px'
					defaultValue={milestones?.achievedMilestones}
					{...register('achievedMilestones')}
				/>
				<LeadStyled>
					If you cannot provide links to evidence of milestones that
					have already been achieved, you can upload proof here.
				</LeadStyled>
				<Paragraph>Upload photo</Paragraph>
				<Controller
					control={control}
					name='achievedMilestonesProof'
					defaultValue={milestones?.achievedMilestonesProof}
					render={({ field }) => (
						<ImageUploader
							url={field.value || ''}
							setUrl={url => field.onChange(url)}
							setIsUploading={setUploading}
						/>
					)}
				/>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button onClick={() => setStep(4)} label='<     PREVIOUS' />
					<Button
						loading={loading}
						disabled={uploading}
						label='NEXT     >'
						type='submit'
					/>
				</BtnContainer>
			</div>
		</form>
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
