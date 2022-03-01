import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import Input, {
	IFormValidations,
	InputValidationType,
} from '@/components/Input';
import { SkipOnboardingModal } from '@/components/modals/SkipOnboardingModal';
import { Row } from '@/components/styled-components/Grid';
import { gToast, ToastType } from '@/components/toasts';
import useUser from '@/context/UserProvider';
import { useMutation } from '@apollo/client';
import { H6, neutralColors } from '@giveth/ui-design-system';
import { ChangeEvent, FC, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { IStep, OnboardActions, OnboardStep } from './common';
import { OnboardSteps } from './Onboarding.view';

interface IUserIfo {
	email: string;
	firstName: string;
	lastName: string;
	location: string;
	website: string;
}

const initialUserInfo: IUserIfo = {
	email: '',
	firstName: '',
	lastName: '',
	location: '',
	website: '',
};

const InfoStep: FC<IStep> = ({ setStep }) => {
	const [disabled, setDisabled] = useState(true);
	const [updateUser] = useMutation(UPDATE_USER);
	const [showModal, setShowModal] = useState(false);
	const [formValidation, setFormValidation] = useState<IFormValidations>();
	const [info, setInfo] = useReducer(
		(curValues: IUserIfo, newValues: object) => ({
			...curValues,
			...newValues,
		}),
		initialUserInfo,
	);

	useEffect(() => {
		if (formValidation) {
			const fvs = Object.values(formValidation);
			setDisabled(!fvs.every(fv => fv === InputValidationType.NORMAL));
		}
	}, [formValidation]);

	const handleLater = () => {
		setShowModal(true);
	};

	const { email, firstName, lastName, location, website } = info;

	const reducerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInfo({ [name]: value });
	};

	const onSave = async () => {
		setDisabled(true);
		try {
			const { data: response } = await updateUser({
				variables: {
					email,
					firstName,
					lastName,
					location,
					website,
				},
			});
			if (response.updateUser) {
				setStep(OnboardSteps.PHOTO);
				gToast('Profile informations updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				return true;
			} else {
				throw 'Update User Failed';
			}
		} catch (error: any) {
			gToast('Failed to update your inforamtion. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
		}
		setDisabled(false);
		return false;
	};

	return (
		<>
			<OnboardStep>
				<SectionHeader>How we should call you?</SectionHeader>
				<Section>
					<Input
						label='first name'
						placeholder='John'
						name='firstName'
						value={firstName}
						onChange={reducerInputChange}
						setFormValidation={setFormValidation}
						required
					/>
					<Input
						label='last name'
						placeholder='Doe'
						name='lastName'
						value={lastName}
						onChange={reducerInputChange}
						setFormValidation={setFormValidation}
						required
					/>
				</Section>
				<Section>
					<Input
						label='email'
						placeholder='Example@Domain.com'
						name='email'
						value={email}
						onChange={reducerInputChange}
						type='email'
						required
						setFormValidation={setFormValidation}
						validators={[
							{ pattern: /^.{3,}$/, msg: 'Too Short' },
							{
								pattern:
									/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								msg: 'Invalid Email Address',
							},
						]}
					/>
				</Section>
				<SectionHeader>Where are you?</SectionHeader>
				<Section>
					<Input
						label='location (optional)'
						placeholder='Portugal, Turkey,...'
						name='location'
						value={location}
						onChange={reducerInputChange}
					/>
				</Section>
				<SectionHeader>
					Personal website or URL to somewhere special?
				</SectionHeader>
				<Section>
					<Input
						label='website or url'
						placeholder='Website'
						name='website'
						value={website}
						onChange={reducerInputChange}
						type='url'
						caption='Your home page, blog, or company site.'
					/>
				</Section>
				<OnboardActions
					onSave={onSave}
					saveLabel='SAVE & CONTINUE'
					onLater={handleLater}
					disabled={disabled}
				/>
			</OnboardStep>
			{showModal && (
				<SkipOnboardingModal
					showModal={showModal}
					setShowModal={setShowModal}
				/>
			)}
		</>
	);
};

const Section = styled(Row)`
	margin-top: 32px;
	margin-bottom: 67px;
	gap: 24px;
`;

const SectionHeader = styled(H6)`
	padding-bottom: 16px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
`;

export default InfoStep;
