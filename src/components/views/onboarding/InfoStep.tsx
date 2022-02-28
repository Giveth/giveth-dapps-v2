import { UPDATE_USER } from '@/apollo/gql/gqlUser';
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
					<InputContainer>
						<InputLabel>FIRST NAME</InputLabel>
						<Input
							placeholder='John'
							name='firstName'
							title='first name'
							value={firstName}
							onChange={reducerInputChange}
						/>
					</InputContainer>
					<InputContainer>
						<InputLabel>LAST NAME</InputLabel>
						<Input
							placeholder='Doe'
							name='lastName'
							value={lastName}
							title='last name'
							onChange={reducerInputChange}
						/>
					</InputContainer>
				</Section>
				<Section>
					<InputContainer>
						<InputLabel>EMAIL</InputLabel>
						<Input
							placeholder='Example@Domain.com'
							name='email'
							value={email}
							onChange={reducerInputChange}
							type='email'
							title='Email'
							pattern='/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'
						/>
					</InputContainer>
				</Section>
				<SectionHeader>Where are you?</SectionHeader>
				<Section>
					<InputContainer>
						<InputLabel>LOCATION (OPTIONAL)</InputLabel>
						<Input
							placeholder='Portugal, Turkey,...'
							name='location'
							value={location}
							onChange={reducerInputChange}
						/>
					</InputContainer>
				</Section>
				<SectionHeader>
					Personal website or URL to somewhere special?
				</SectionHeader>
				<Section>
					<InputContainer>
						<InputLabel>WEBSITE OR URL (OPTIONAL)</InputLabel>
						<Input
							placeholder='Website'
							name='website'
							value={website}
							onChange={reducerInputChange}
							type='url'
						/>
						<InputDesc size='Small'>
							Your home page, blog, or company site.
						</InputDesc>
					</InputContainer>
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

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled(Subline)`
	padding-bottom: 4px;
	color: ${brandColors.deep[500]};
`;

enum InputValidationType {
	NORMAL,
	WARNING,
	ERROR,
	SUCCESS,
}
interface IInput {
	validation: InputValidationType;
}

const Input = styled.input`
	width: 100%;
	height: 56px;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 15px 16px;
	font-size: 16px;
	line-height: 150%;
	font-weight: 500;
	font-family: 'Red Hat Text';
	caret-color: ${brandColors.giv[300]};
	:focus {
		border: 2px solid ${neutralColors.gray[400]};
	}
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;

const InputDesc = styled(GLink)`
	padding-top: 4px;
	color: ${brandColors.deep[500]};
`;

export default InfoStep;
