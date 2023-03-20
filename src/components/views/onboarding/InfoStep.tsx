import { FC, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { H6, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';

import { useForm } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { Col, Row } from '@giveth/ui-design-system';
import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { SkipOnboardingModal } from '@/components/modals/SkipOnboardingModal';
import { gToast, ToastType } from '@/components/toasts';
import {
	IStep,
	OnboardActionsContainer,
	OnboardStep,
	SaveButton,
	SkipButton,
} from './common';
import { OnboardSteps } from './Onboarding.view';
import Input from '@/components/Input';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { requiredOptions, validators } from '@/lib/constants/regex';

export interface IUserInfo {
	email: string;
	firstName: string;
	lastName: string;
	location: string;
	url: string;
}

enum EUserInfo {
	EMAIL = 'email',
	FIRST_NAME = 'firstName',
	LAST_NAME = 'lastName',
	LOCATION = 'location',
	URL = 'url',
}

const InfoStep: FC<IStep> = ({ setStep }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [updateUser] = useMutation(UPDATE_USER);
	const [showModal, setShowModal] = useState(false);

	const dispatch = useAppDispatch();
	const { isSignedIn, userData } = useAppSelector(state => state.user);
	const { account } = useWeb3React();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IUserInfo>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		defaultValues: {
			[EUserInfo.EMAIL]: userData?.email || '',
			[EUserInfo.FIRST_NAME]: userData?.firstName || '',
			[EUserInfo.LAST_NAME]: userData?.lastName || '',
			[EUserInfo.LOCATION]: userData?.location || '',
			[EUserInfo.URL]: userData?.url || '',
		},
	});

	useEffect(() => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		}
	}, [isSignedIn]);

	const handleLater = () => {
		setShowModal(true);
	};

	const onSave = async (formData: IUserInfo) => {
		setIsLoading(true);
		try {
			const { data: response } = await updateUser({
				variables: {
					...formData,
				},
			});
			if (response.updateUser) {
				setStep(OnboardSteps.PHOTO);
				account && dispatch(fetchUserByAddress(account));
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
		<OnboardStep xs={12} xl={8} sm={12}>
			<form onSubmit={handleSubmit(onSave)} noValidate>
				<SectionHeader>What should we call you?</SectionHeader>
				<Section>
					<Col xs={12} md={6}>
						<Input
							registerName={EUserInfo.FIRST_NAME}
							label='first name'
							placeholder='John'
							register={register}
							registerOptions={requiredOptions.firstName}
							error={errors.firstName}
						/>
					</Col>
					<Col xs={12} md={6}>
						<Input
							label='last name'
							placeholder='Doe'
							registerName={EUserInfo.LAST_NAME}
							register={register}
							registerOptions={requiredOptions.lastName}
							error={errors.lastName}
						/>
					</Col>
					<Col xs={12} md={6}>
						<Input
							registerName={EUserInfo.EMAIL}
							label='email'
							placeholder='Example@Domain.com'
							register={register}
							type='email'
							registerOptions={requiredOptions.email}
							error={errors.email}
						/>
					</Col>
				</Section>
				<SectionHeader>Where are you?</SectionHeader>
				<Section>
					<Col xs={12} md={6}>
						<Input
							label='location (optional)'
							placeholder='Portugal, Turkey,...'
							registerName={EUserInfo.LOCATION}
							register={register}
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
							registerName={EUserInfo.URL}
							register={register}
							type='url'
							caption='Your home page, blog, or company site.'
							registerOptions={validators.website}
							error={errors.url}
						/>
					</Col>
				</Section>
				<OnboardActionsContainer>
					<Col xs={12} md={7}>
						<SaveButton
							label='SAVE & CONTINUE'
							disabled={isLoading}
							size='medium'
							type='submit'
						/>
					</Col>
					<Col xs={12} md={2}>
						<SkipButton
							label='Do it later'
							size='medium'
							buttonType='texty'
							onClick={handleLater}
						/>
					</Col>
				</OnboardActionsContainer>
			</form>
			{showModal && <SkipOnboardingModal setShowModal={setShowModal} />}
		</OnboardStep>
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
