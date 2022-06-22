import { FC, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { H6, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';

import { useForm } from 'react-hook-form';
import { useWeb3React } from '@web3-react/core';
import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { SkipOnboardingModal } from '@/components/modals/SkipOnboardingModal';
import { gToast, ToastType } from '@/components/toasts';
import {
	IStep,
	OnboardActionsContianer,
	OnboardStep,
	SaveButton,
	SkipButton,
} from './common';
import { OnboardSteps } from './Onboarding.view';
import { Col, Row } from '@/components/Grid';
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

const InfoStep: FC<IStep> = ({ setStep }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [updateUser] = useMutation(UPDATE_USER);
	const [showModal, setShowModal] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IUserInfo>();
	const dispatch = useAppDispatch();
	const isSignedIn = useAppSelector(state => state.user.isSignedIn);
	const { account } = useWeb3React();

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
		<>
			<OnboardStep xs={12} xl={8} sm={12}>
				<form onSubmit={handleSubmit(onSave)} noValidate>
					<SectionHeader>What should we call you?</SectionHeader>
					<Section>
						<Col xs={12} md={6}>
							<Input
								registerName='firstName'
								label='first name'
								placeholder='John'
								register={register}
								registerOptions={{
									required: {
										value: true,
										message: 'First name is required',
									},
								}}
								error={errors.firstName}
							/>
						</Col>
						<Col xs={12} md={6}>
							<Input
								label='last name'
								placeholder='Doe'
								registerName='lastName'
								register={register}
								registerOptions={{
									required: {
										value: true,
										message: 'Last name is required',
									},
								}}
								error={errors.lastName}
							/>
						</Col>
						<Col xs={12} md={6}>
							<Input
								registerName='email'
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
								registerName='location'
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
								registerName='url'
								register={register}
								type='url'
								caption='Your home page, blog, or company site.'
								registerOptions={validators.url}
								error={errors.url}
							/>
						</Col>
					</Section>
					<OnboardActionsContianer>
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
					</OnboardActionsContianer>
				</form>
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
