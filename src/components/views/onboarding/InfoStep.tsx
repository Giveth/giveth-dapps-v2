import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import Input from '@/components/Input';
import { SkipOnboardingModal } from '@/components/modals/SkipOnboardingModal';
import { Row } from '@/components/styled-components/Grid';
import { gToast, ToastType } from '@/components/toasts';
import { useMutation } from '@apollo/client';
import {
	brandColors,
	GLink,
	H6,
	neutralColors,
	Subline,
} from '@giveth/ui-design-system';
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
	const [info, setInfo] = useReducer(
		(curValues: IUserIfo, newValues: object) => ({
			...curValues,
			...newValues,
		}),
		initialUserInfo,
	);
	const [disabled, setDisabled] = useState(true);
	const [updateUser] = useMutation(UPDATE_USER);
	const [showModal, setShowModal] = useState(false);

	const handleLater = () => {
		setShowModal(true);
	};

	const { email, firstName, lastName, location, website } = info;

	const reducerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value, pattern } = e.target;
		if (pattern) {
			console.log(pattern);
		}
		setInfo({ [name]: value });
	};

	useEffect(() => {
		setDisabled(!(firstName.length > 0 && lastName.length > 0));
	}, [firstName, lastName]);

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
			} else {
				throw 'updateUser false';
			}
		} catch (error) {
			gToast('Failed to update your inforamtion. Please try again.', {
				type: ToastType.DANGER,
			});
		}
		setDisabled(false);
	};

	return (
		<>
			<OnboardStep>
				<SectionHeader>How we should call you?</SectionHeader>
				<Section>
					<Input
						label='FIRST NAME'
						placeholder='John'
						name='firstName'
						value={firstName}
						onChange={reducerInputChange}
					/>
					<Input
						label='LAST NAME'
						placeholder='Doe'
						name='lastName'
						value={lastName}
						onChange={reducerInputChange}
					/>
				</Section>
				<Section>
					<Input
						label='EMAIL'
						placeholder='Example@Domain.com'
						name='email'
						value={email}
						onChange={reducerInputChange}
						type='email'
						validators={[
							{ pattern: /^.{5,}$/, msg: 'min 20 char' },
							{
								pattern:
									/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								msg: 'Email is not valid',
							},
						]}
					/>
				</Section>
				<SectionHeader>Where are you?</SectionHeader>
				<Section>
					<Input
						label='LOCATION (OPTIONAL)'
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
						label='WEBSITE OR URL'
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
