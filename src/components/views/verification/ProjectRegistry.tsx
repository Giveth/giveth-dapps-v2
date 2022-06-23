import { Button, H6, Lead, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import RadioButton from '../../RadioButton';
import Input from '@/components/Input';
import { Label } from '../create/Create.sc';
import { TextArea } from '@/components/styled-components/TextArea';
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
import { validators } from '@/lib/constants/regex';

enum ProjectRegistryStates {
	NOTSELECTED = 'notselected',
	YES = 'yes',
	NO = 'no',
}

interface IOption {
	value: string;
	label: string;
}

function isObjEmpty(obj: Object) {
	return Object.keys(obj).length > 0;
}

interface IRegisteryForm {
	link: string;
	country: IOption;
	description: string;
	isNonProfit: ProjectRegistryStates;
}

export default function ProjectRegistry() {
	const { verificationData, setVerificationData, setStep } =
		useVerificationData();
	const { projectRegistry } = verificationData || {};
	const [countries, setCountries] = useState<IOption[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors, dirtyFields, isSubmitting },
		getValues,
		control,
		setValue,
		watch,
	} = useForm<IRegisteryForm>();

	const watchIsNonProfit = watch('isNonProfit');
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
								watchIsNonProfit === ProjectRegistryStates.YES,
							organizationCountry: getValues('country')?.value,
							organizationWebsite: getValues('link'),
							organizationDescription: getValues('description'),
						},
					},
				},
			});
			setVerificationData(data.updateProjectVerificationForm);
			setStep(4);
		}

		if (isObjEmpty(dirtyFields)) {
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
			? projectRegistry.isNonProfitOrganization
				? setValue('isNonProfit', ProjectRegistryStates.YES)
				: setValue('isNonProfit', ProjectRegistryStates.NO)
			: setValue('isNonProfit', ProjectRegistryStates.NOTSELECTED);
	}, [projectRegistry]);

	return (
		<>
			<form onSubmit={handleSubmit(handleNext)}>
				<div>
					<H6 weight={700}>Project registry</H6>
					<RadioSectionContainer>
						<RadioSectionTitle>
							Is your project part of a registered non-profit
							organization?
						</RadioSectionTitle>
						<RadioSectionSubTitle>
							Having obtained non-profit status is not a
							requirement but it is helpful for the verification
							process
						</RadioSectionSubTitle>
						<br />
						<Controller
							name='isNonProfit'
							control={control}
							render={({ field: { value } }) => (
								<RadioContainer>
									<RadioButton
										title='Yes'
										toggleRadio={() => {
											setValue(
												'isNonProfit',
												ProjectRegistryStates.YES,
												{ shouldDirty: true },
											);
										}}
										isSelected={
											value === ProjectRegistryStates.YES
										}
									/>
									<RadioButton
										title='No'
										toggleRadio={() => {
											setValue(
												'isNonProfit',
												ProjectRegistryStates.NO,
												{ shouldDirty: true },
											);
										}}
										isSelected={
											value === ProjectRegistryStates.NO
										}
									/>
								</RadioContainer>
							)}
						/>
					</RadioSectionContainer>
					<br />
					{watchIsNonProfit === ProjectRegistryStates.YES && (
						<>
							<Lead>In which country are you registered?</Lead>
							<br />

							<Controller
								control={control}
								name='country'
								render={({ field: { value, onChange } }) => (
									<Select
										options={countries}
										styles={selectCustomStyles}
										value={countries.find(
											c => c.value === value?.value,
										)}
										defaultValue={{
											label: projectRegistry?.organizationCountry,
											value: projectRegistry?.organizationCountry,
										}}
										onChange={onChange}
									/>
								)}
							/>

							<br />
							<Lead>
								Please provide a link to your country's
								government registry where the team can look up
								and confirm your status.
							</Lead>
							<br />
							<LinkInputContainer>
								<Label>Please enter full link</Label>
								<Input
									registerName='link'
									register={register}
									registerOptions={validators.url}
									placeholder='https://'
									error={errors.link}
									defaultValue={
										projectRegistry?.organizationWebsite ||
										''
									}
								/>
							</LinkInputContainer>
						</>
					)}

					{watchIsNonProfit === ProjectRegistryStates.NO && (
						<>
							<Lead>
								Okay, it sounds like your project is not a
								registered non-profit. Please tell us a bit
								about how your organization is structured.
							</Lead>
							<br />
							<TextArea
								placeholder='eg. "We are a decentralized autonomous organization that works toward the development of web3
						applications"'
								{...register('description')}
								defaultValue={
									projectRegistry?.organizationDescription ||
									''
								}
							/>
						</>
					)}
				</div>
				<div>
					<ContentSeparator />
					<BtnContainer>
						<Button
							onClick={() => setStep(2)}
							label='<     PREVIOUS'
						/>
						<Button
							loading={isSubmitting}
							label='NEXT     >'
							type='submit'
						/>
					</BtnContainer>
				</div>
			</form>
		</>
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

const LinkInputContainer = styled.div`
	max-width: 520px;
`;
