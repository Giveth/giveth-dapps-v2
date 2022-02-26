import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { Row } from '@/components/styled-components/Grid';
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
	firstName: string;
	lastName: string;
	location: string;
	website: string;
}

const initialUserInfo: IUserIfo = {
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

	const { firstName, lastName, location, website } = info;

	const reducerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInfo({ [name]: value });
	};

	useEffect(() => {
		console.log('called');
		setDisabled(!(firstName.length > 0 && lastName.length > 0));
	}, [firstName, lastName]);

	const onSave = async () => {
		setDisabled(true);
		const { data: response } = await updateUser({
			variables: {
				firstName,
				lastName,
				location,
				website,
			},
		});
		setDisabled(false);
		setStep(OnboardSteps.PHOTO);
	};

	return (
		<OnboardStep>
			<SectionHeader>How we should call you?</SectionHeader>
			<Section>
				<InputContainer>
					<InputLabel>FIRST NAME</InputLabel>
					<Input
						placeholder='John'
						name='firstName'
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
						onChange={reducerInputChange}
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
					/>
					<InputDesc size='Small'>
						Your home page, blog, or company site.
					</InputDesc>
				</InputContainer>
			</Section>
			<OnboardActions
				onSave={onSave}
				saveLabel='SAVE & CONTINUE'
				disabled={disabled}
			/>
		</OnboardStep>
	);
};

const Section = styled(Row)`
	padding-top: 32px;
	padding-bottom: 67px;
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

const Input = styled.input`
	width: 100%;
	height: 56px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 15px 16px;
	font-size: 16px;
	line-height: 150%;
	font-weight: 500;
	font-family: 'Red Hat Text';
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;

const InputDesc = styled(GLink)`
	padding-top: 4px;
	color: ${brandColors.deep[500]};
`;

export default InfoStep;
