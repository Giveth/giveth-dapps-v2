import { ChangeEvent, FC, useReducer, useState } from 'react';
import { useMutation } from '@apollo/client';
import { H6, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';

import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import Input, { IFormValidations } from '@/components/Input';
import { SkipOnboardingModal } from '@/components/modals/SkipOnboardingModal';
import { gToast, ToastType } from '@/components/toasts';
import { IStep, OnboardActions, OnboardStep } from './common';
import { OnboardSteps } from './Onboarding.view';
import { Col, Row } from '@/components/Grid';
import useFormValidation from '@/hooks/useFormValidation';
import { validators } from '@/lib/constants/regex';

export interface IUserInfo {
	email: string;
	firstName: string;
	lastName: string;
	location: string;
	url: string;
}

const initialUserInfo: IUserInfo = {
	email: '',
	firstName: '',
	lastName: '',
	location: '',
	url: '',
};

const InfoStep: FC<IStep> = ({ setStep }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [updateUser] = useMutation(UPDATE_USER);
	const [showModal, setShowModal] = useState(false);
	const [formValidation, setFormValidation] = useState<IFormValidations>();
	const [info, setInfo] = useReducer(
		(curValues: IUserInfo, newValues: object) => ({
			...curValues,
			...newValues,
		}),
		initialUserInfo,
	);

	const isFormValid = useFormValidation(formValidation);

	const handleLater = () => {
		setShowModal(true);
	};

	const { email, firstName, lastName, location, url } = info;

	const reducerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInfo({ [name]: value });
	};

	const onSave = async () => {
		setIsLoading(true);
		try {
			const { data: response } = await updateUser({
				variables: {
					email,
					firstName,
					lastName,
					location,
					url,
				},
			});
			if (response.updateUser) {
				setStep(OnboardSteps.PHOTO);
				gToast('Profile information updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				return true;
			} else {
				throw 'Update User Failed';
			}
		} catch (error: any) {
			gToast('Failed to update your information. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
			captureException(error, {
				tags: {
					section: 'InfoStepOnSave',
				},
			});
		}
		setIsLoading(false);
		return false;
	};

	return (
		<>
			<OnboardStep xs={12} xl={8} sm={12}>
				<SectionHeader>What should we call you?</SectionHeader>
				<Section>
					<Col xs={12} md={6}>
						<Input
							label='first name'
							placeholder='John'
							name='firstName'
							value={firstName}
							onChange={reducerInputChange}
							setFormValidation={setFormValidation}
							required
						/>
					</Col>
					<Col xs={12} md={6}>
						<Input
							label='last name'
							placeholder='Doe'
							name='lastName'
							value={lastName}
							onChange={reducerInputChange}
							setFormValidation={setFormValidation}
							required
						/>
					</Col>
					<Col xs={12} md={6}>
						<Input
							label='email'
							placeholder='Example@Domain.com'
							name='email'
							value={email}
							onChange={reducerInputChange}
							type='email'
							required
							setFormValidation={setFormValidation}
							validators={[validators.email, validators.tooShort]}
						/>
					</Col>
				</Section>
				<SectionHeader>Where are you?</SectionHeader>
				<Section>
					<Col xs={12} md={6}>
						<Input
							label='location (optional)'
							placeholder='Portugal, Turkey,...'
							name='location'
							value={location}
							onChange={reducerInputChange}
						/>
					</Col>
				</Section>
				<SectionHeader>
					Personal website or URL to somewhere special?
				</SectionHeader>
				<Section>
					<Col xs={12} md={6}>
						<Input
							label='website or url'
							placeholder='Website'
							name='url'
							onChange={reducerInputChange}
							type='url'
							caption='Your home page, blog, or company site.'
							value={url}
							validators={[validators.url]}
						/>
					</Col>
				</Section>
				<OnboardActions
					onSave={onSave}
					saveLabel='SAVE & CONTINUE'
					onLater={handleLater}
					disabled={isLoading || !isFormValid}
				/>
			</OnboardStep>
			{showModal && <SkipOnboardingModal setShowModal={setShowModal} />}
		</>
	);
};

const Section = styled(Row)`
	margin-top: 32px;
	margin-bottom: 67px;
`;

const SectionHeader = styled(H6)`
	padding-bottom: 16px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
`;

export default InfoStep;
