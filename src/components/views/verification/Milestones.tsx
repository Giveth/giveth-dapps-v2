import { useIntl } from 'react-intl';
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
import FileUploader from '@/components/FileUploader';
import { ContentSeparator, BtnContainer } from './Common.sc';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import { UPDATE_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import { EVerificationSteps, IProjectMilestones } from '@/apollo/types/types';
import DescriptionInput from '@/components/DescriptionInput';
import { requiredOptions } from '@/lib/constants/regex';

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
	} = useForm<IProjectMilestones>();
	const { formatMessage } = useIntl();

	const handleNext = (formData: IProjectMilestones) => {
		async function sendReq() {
			const { data } = await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: EVerificationSteps.IMPACT,
						milestones: {
							problem: formData.problem,
							foundationDate: formData.foundationDate,
							mission: formData.mission,
							achievedMilestones: formData.achievedMilestones,
							impact: formData.impact,
							plans: formData.plans,
							achievedMilestonesProofs:
								formData.achievedMilestonesProofs
									? formData.achievedMilestonesProofs
									: [],
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
				<H6 weight={700}>
					{formatMessage({ id: 'label.activity_and_milestones' })}
				</H6>
				<LeadStyled>
					{formatMessage({
						id: 'page.verification.activity_and_milestones.problem',
					})}
				</LeadStyled>
				<br />
				<DescriptionInput
					height='82px'
					defaultValue={milestones?.problem}
					register={register}
					registerOptions={isDraft ? requiredOptions.field : {}}
					registerName='problem'
					error={errors.problem}
					disabled={!isDraft}
				/>
				<Lead>
					{formatMessage({
						id: 'page.verification.activity_and_milestones.two',
					})}
				</Lead>
				<Paragraph>
					{formatMessage({
						id: 'page.verification.activity_and_milestones.three',
					})}
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
					{formatMessage({
						id: 'page.verification.activity_and_milestones.one',
					})}
				</Lead>
				<br />
				<DatePickerWrapper>
					<IconChevronDown color={neutralColors.gray[600]} />
					<Controller
						control={control}
						name='foundationDate'
						defaultValue={
							milestones?.foundationDate
								? milestones?.foundationDate
								: undefined
						}
						rules={isDraft ? requiredOptions.date : {}}
						render={({ field }) => (
							<StyledDatePicker
								selected={
									field.value
										? new Date(field.value)
										: undefined
								}
								onChange={date =>
									field.onChange(date?.toString())
								}
								dateFormat='MM/yyyy'
								showMonthYearPicker
								showPopperArrow={false}
								placeholderText={formatMessage({
									id: 'label.select_a_date',
								})}
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
					{formatMessage({
						id: 'page.verification.activity_and_milestones.four',
					})}
				</LeadStyled>
				<Paragraph>
					{formatMessage({
						id: 'page.verification.activity_and_milestones.five',
					})}
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
					{formatMessage({
						id: 'page.verification.activity_and_milestones.impact1',
					})}
				</Lead>
				<Paragraph>
					{formatMessage({
						id: 'page.verification.activity_and_milestones.impact2',
					})}
				</Paragraph>
				<DescriptionInput
					height='82px'
					defaultValue={milestones?.impact}
					register={register}
					registerOptions={isDraft ? requiredOptions.field : {}}
					registerName='impact'
					error={errors.impact}
					disabled={!isDraft}
				/>
				<Lead>
					{formatMessage({
						id: 'page.verification.activity_and_milestones.six',
					})}
				</Lead>
				<Paragraph>{formatMessage({ id: 'label.optional' })}</Paragraph>
				<Controller
					control={control}
					name='achievedMilestonesProofs'
					defaultValue={milestones?.achievedMilestonesProofs}
					render={({ field }) => (
						<FileUploader
							urls={field.value || []}
							setUrls={urls => field.onChange(urls)}
							setIsUploading={setUploading}
							multiple
							limit={5}
						/>
					)}
				/>
				<LeadStyled>
					{formatMessage({
						id: 'page.verification.activity_and_milestones.plans',
					})}
				</LeadStyled>
				<br />
				<DescriptionInput
					height='82px'
					defaultValue={milestones?.plans}
					register={register}
					registerOptions={isDraft ? requiredOptions.field : {}}
					registerName='plans'
					error={errors.plans}
					disabled={!isDraft}
				/>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button
						onClick={() => setStep(4)}
						label={`<     ${formatMessage({
							id: 'label.prev',
						})}`}
					/>
					<Button
						loading={isSubmitting}
						disabled={uploading}
						label={`${formatMessage({
							id: 'label.next',
						})}     >`}
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
