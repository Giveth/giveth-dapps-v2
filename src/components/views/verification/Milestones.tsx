import {
	Button,
	GLink,
	H6,
	IconChevronDown,
	Lead,
	neutralColors,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
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
import DescriptionInput from '@/components/DescriptionInput';
import { requiredOptions } from '@/lib/constants/regex';

export interface IMilestonesForm {
	foundationDate?: Date;
	mission?: string;
	achievedMilestones?: string;
	achievedMilestonesProof?: string;
}

export default function Milestones() {
	const [uploading, setUploading] = useState(false);

	const { verificationData, setVerificationData, setStep, isDraft } =
		useVerificationData();
	const { milestones } = verificationData || {};
	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isDirty, isSubmitting },
	} = useForm<IMilestonesForm>();

	const handleNext = (formData: IMilestonesForm) => {
		async function sendReq() {
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
								formData.achievedMilestonesProof
									? formData.achievedMilestonesProof
									: '',
						},
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setStep(6);
		}

		if (isDirty && isDraft) {
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
						rules={isDraft ? requiredOptions.date : {}}
						render={({ field }) => (
							<StyledDatePicker
								selected={field.value}
								onChange={date => field.onChange(date)}
								dateFormat='MM/yyyy'
								showMonthYearPicker
								showPopperArrow={false}
								placeholderText='Select a date'
								disabled={!isDraft}
								hasError={
									!!errors?.foundationDate?.message ?? false
								}
							/>
						)}
					/>
				</DatePickerWrapper>
				{errors?.foundationDate?.message && (
					<DateError>{errors.foundationDate?.message}</DateError>
				)}
				<LeadStyled>
					What is your organization/project's mission and how does it
					align with creating positive change in the world?
				</LeadStyled>
				<Paragraph>
					Please describe how your project is benefiting society and
					the world at large.
				</Paragraph>
				<DescriptionInput
					height='82px'
					defaultValue={milestones?.mission}
					register={register}
					registerOptions={isDraft ? requiredOptions.field : {}}
					registerName='mission'
					error={errors.mission}
					disabled={!isDraft}
				/>
				<Lead>
					Which milestones has your organization/project achieved
					since conception?
				</Lead>
				<Paragraph>
					Please provide links to photos, videos, testimonials or
					other evidence of your project's impact.
				</Paragraph>
				<DescriptionInput
					height='82px'
					defaultValue={milestones?.achievedMilestones}
					register={register}
					registerOptions={isDraft ? requiredOptions.field : {}}
					registerName='achievedMilestones'
					error={errors.achievedMilestones}
					disabled={!isDraft}
				/>
				<Lead>
					If you cannot provide links to evidence of milestones that
					have already been achieved, you can upload proof here.
				</Lead>
				<Paragraph>Optional</Paragraph>
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
						loading={isSubmitting}
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

const DateError = styled(GLink)`
	color: ${semanticColors.punch[500]};
`;
