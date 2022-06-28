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
import { isObjEmpty } from '@/lib/helpers';
import DescriptionInput from '@/components/DescriptionInput';

enum ERegistryType {
	NOT_SELECTED = 'notSelected',
	YES = 'yes',
	NO = 'no',
}

enum ERegistry {
	link = 'link',
	country = 'country',
	description = 'description',
	isNonProfit = 'isNonProfit',
}

interface IOption {
	value: string;
	label: string;
}

interface IRegistryForm {
	[ERegistry.link]: string;
	[ERegistry.country]: IOption;
	[ERegistry.description]: string;
	[ERegistry.isNonProfit]: ERegistryType;
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
	} = projectRegistry || {};
	const [countries, setCountries] = useState<IOption[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors, dirtyFields, isSubmitting },
		getValues,
		control,
		setValue,
		watch,
	} = useForm<IRegistryForm>();

	const watchIsNonProfit = watch(ERegistry.isNonProfit);
	const handleNext = () => {
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
							organizationCountry: getValues(ERegistry.country)
								?.value,
							organizationWebsite: getValues(ERegistry.link),
							organizationDescription: getValues(
								ERegistry.description,
							),
						},
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setStep(4);
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
				? setValue(ERegistry.isNonProfit, ERegistryType.YES)
				: setValue(ERegistry.isNonProfit, ERegistryType.NO)
			: setValue(ERegistry.isNonProfit, ERegistryType.NOT_SELECTED);
	}, [projectRegistry]);

	return (
		<form onSubmit={handleSubmit(handleNext)}>
			<div>
				<H6 weight={700}>Project registry</H6>
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
						name={ERegistry.isNonProfit}
						control={control}
						render={({ field: { value } }) => (
							<RadioContainer>
								<RadioButton
									title='Yes'
									toggleRadio={() => {
										setValue(
											ERegistry.isNonProfit,
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
											ERegistry.isNonProfit,
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
					<>
						<Lead>
							What name is your organization registered under?
						</Lead>
						<br />
						<InputContainer>
							<Input
								placeholder='Project official name'
								registerName='organizationName'
								register={register}
							/>
						</InputContainer>
						<Lead>In which country are you registered?</Lead>
						<br />

						<Controller
							control={control}
							name={ERegistry.country}
							render={({ field: { value, onChange } }) => (
								<Select
									options={countries}
									styles={selectCustomStyles}
									placeholder='Choose country'
									value={countries.find(
										c => c.value === value?.value,
									)}
									defaultValue={
										organizationCountry
											? {
													label: organizationCountry,
													value: organizationCountry,
											  }
											: null
									}
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
								registerName={ERegistry.link}
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
					</>
				)}

				{watchIsNonProfit === ERegistryType.NO && (
					<>
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
							registerName={ERegistry.description}
							registerOptions={
								isDraft ? requiredOptions.field : {}
							}
							defaultValue={organizationDescription || ''}
							error={errors.description}
							disabled={!isDraft}
						/>
					</>
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
