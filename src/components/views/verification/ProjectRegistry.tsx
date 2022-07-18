import { Button, H6, Lead, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import RadioButton from '../../RadioButton';
import Input from '@/components/Input';
import { Label } from '../create/Create.sc';
import selectCustomStyles from '@/lib/constants/selectCustomStyles';
import { BtnContainer, ContentSeparator } from './VerificationIndex';
import { useVerificationData } from '@/context/verification.context';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_ALLOWED_COUNTRIES,
	UPDATE_PROJECT_VERIFICATION,
} from '@/apollo/gql/gqlVerification';
import { EVerificationSteps } from '@/apollo/types/types';
import { mediaQueries } from '@/lib/constants/constants';
import { requiredOptions } from '@/lib/constants/regex';
import { isObjEmpty, showToastError } from '@/lib/helpers';
import DescriptionInput from '@/components/DescriptionInput';
import FileUploader from '@/components/FileUploader';

enum ERegistryType {
	NOT_SELECTED = 'notSelected',
	YES = 'yes',
	NO = 'no',
}

interface IOption {
	value: string;
	label: string;
}

interface IRegistryForm {
	link: string;
	country: IOption;
	description: string;
	isNonProfit: ERegistryType;
	organizationName: string;
	attachments: string[];
}

export default function ProjectRegistry() {
	const { verificationData, setVerificationData, setStep, isDraft } =
		useVerificationData();
	const { projectRegistry } = verificationData || {};
	const {
		isNonProfitOrganization,
		organizationCountry,
		organizationDescription,
		organizationWebsite,
		attachments,
		organizationName,
	} = projectRegistry || {};
	const [countries, setCountries] = useState<IOption[]>([]);
	const [uploading, setUploading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, dirtyFields, isSubmitting },
		control,
		setValue,
		watch,
	} = useForm<IRegistryForm>();

	const watchIsNonProfit = watch('isNonProfit');
	const handleNext = ({
		country,
		attachments,
		link,
		description,
		organizationName,
	}: IRegistryForm) => {
		async function sendReq() {
			const { data } = await client.mutate({
				mutation: UPDATE_PROJECT_VERIFICATION,
				variables: {
					projectVerificationUpdateInput: {
						projectVerificationId: Number(verificationData?.id),
						step: EVerificationSteps.PROJECT_REGISTRY,
						projectRegistry: {
							isNonProfitOrganization:
								watchIsNonProfit === ERegistryType.YES,
							organizationCountry: country?.value,
							organizationWebsite: link,
							organizationDescription: description,
							organizationName: organizationName,
							attachments: attachments ?? [],
						},
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setStep(4);
		}
		if (watchIsNonProfit === ERegistryType.NOT_SELECTED) {
			showToastError('Please select one option');
			return;
		}
		if (isObjEmpty(dirtyFields) && isDraft) {
			sendReq();
		} else {
			setStep(4);
		}
	};

	useEffect(() => {
		async function fetchCountries() {
			const { data } = await client.query({
				query: FETCH_ALLOWED_COUNTRIES,
			});
			const _countries = data.getAllowedCountries.map(
				(_country: any) => ({
					label: _country.name,
					value: _country.name,
				}),
			);
			setCountries(_countries);
		}
		fetchCountries();
	}, []);

	useEffect(() => {
		projectRegistry
			? isNonProfitOrganization
				? setValue('isNonProfit', ERegistryType.YES)
				: setValue('isNonProfit', ERegistryType.NO)
			: setValue('isNonProfit', ERegistryType.NOT_SELECTED);
		organizationCountry &&
			setValue('country', {
				label: organizationCountry,
				value: organizationCountry,
			});
	}, [projectRegistry]);

	return (
		<form onSubmit={handleSubmit(handleNext)}>
			<div>
				<H6 weight={700}>Registration</H6>
				<RadioSectionContainer>
					<RadioSectionTitle>
						Is your project part of a registered non-profit
						organization?
					</RadioSectionTitle>
					<RadioSectionSubTitle>
						Having obtained non-profit status is not a requirement
						but it is helpful for the verification process
					</RadioSectionSubTitle>
					<br />
					<Controller
						name={'isNonProfit'}
						control={control}
						render={({ field: { value } }) => (
							<RadioContainer>
								<RadioButton
									title='Yes'
									toggleRadio={() => {
										setValue(
											'isNonProfit',
											ERegistryType.YES,
											{ shouldDirty: true },
										);
									}}
									isSelected={value === ERegistryType.YES}
								/>
								<RadioButton
									title='No'
									toggleRadio={() => {
										setValue(
											'isNonProfit',
											ERegistryType.NO,
											{ shouldDirty: true },
										);
									}}
									isSelected={value === ERegistryType.NO}
								/>
							</RadioContainer>
						)}
					/>
				</RadioSectionContainer>
				<br />
				{watchIsNonProfit === ERegistryType.YES && (
					<div className='fadeIn'>
						<Lead>
							What name is your organization registered under?
						</Lead>
						<br />
						<InputContainer>
							<Input
								placeholder='Project official name'
								registerName='organizationName'
								register={register}
								registerOptions={
									isDraft ? requiredOptions.field : {}
								}
								defaultValue={organizationName || ''}
								error={errors.organizationName}
							/>
						</InputContainer>
						<Lead>In which country are you registered?</Lead>
						<br />
						<Controller
							control={control}
							name='country'
							render={({ field: { value, onChange } }) => (
								<Select
									options={countries}
									styles={selectCustomStyles}
									placeholder='Choose country'
									value={countries.find(
										c => c.value === value?.value,
									)}
									onChange={onChange}
									isDisabled={!isDraft}
								/>
							)}
						/>
						<br />
						<Lead>
							Please provide a link to your country&apos;s
							government registry where the team can look up and
							confirm your status.
						</Lead>
						<br />
						<InputContainer>
							<Label>Please enter full link</Label>
							<Input
								registerName='link'
								register={register}
								registerOptions={
									isDraft ? requiredOptions.website : {}
								}
								placeholder='https://'
								error={errors.link}
								disabled={!isDraft}
								defaultValue={organizationWebsite || ''}
							/>
						</InputContainer>
						<Controller
							control={control}
							name='attachments'
							defaultValue={attachments}
							render={({ field }) => (
								<FileUploader
									urls={field.value || []}
									setUrls={field.onChange}
									setIsUploading={setUploading}
									multiple
									limit={5}
								/>
							)}
						/>
					</div>
				)}

				{watchIsNonProfit === ERegistryType.NO && (
					<div className='fadeIn'>
						<Lead>
							Okay, it sounds like your project is not a
							registered non-profit. Please tell us a bit about
							how your organization is structured.
						</Lead>
						<br />
						<DescriptionInput
							placeholder='eg. "We are a decentralized autonomous organization that works toward the development of web3
						applications"'
							register={register}
							registerName='description'
							registerOptions={
								isDraft ? requiredOptions.field : {}
							}
							defaultValue={organizationDescription || ''}
							error={errors.description}
							disabled={!isDraft}
						/>
					</div>
				)}
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button onClick={() => setStep(2)} label='<     PREVIOUS' />
					<Button
						loading={isSubmitting}
						label='NEXT     >'
						type='submit'
						disabled={uploading}
					/>
				</BtnContainer>
			</div>
		</form>
	);
}

const RadioSectionContainer = styled.div`
	margin-top: 29px;
	width: 100%;
	background-color: ${neutralColors.gray[200]};
	border-radius: 16px;
	padding: 16px 24px;
`;
const RadioSectionTitle = styled(Lead)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 8px;
`;

const RadioSectionSubTitle = styled(P)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 8px;
`;

const RadioContainer = styled.div`
	display: flex;
	gap: 100px;
	${mediaQueries.mobileL} {
		gap: 160px;
	}
`;

const InputContainer = styled.div`
	max-width: 520px;
`;
