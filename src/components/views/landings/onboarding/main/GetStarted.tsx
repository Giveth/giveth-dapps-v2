import styled from 'styled-components';
import {
	brandColors,
	deviceSize,
	H5,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import { useForm } from 'react-hook-form';
import { OnboardingHeaderWrapper } from '@/components/views/landings/onboarding/common/common.styled';
import Input, { InputSize } from '@/components/Input';
import { requiredOptions } from '@/lib/constants/regex';
import { client } from '@/apollo/apolloClient';
import { SUBSCRIBE_ONBOARDING } from '@/apollo/gql/gqlSubscribeOnboarding';
import { showToastError } from '@/lib/helpers';
import { gToast, ToastType } from '@/components/toasts';

type Inputs = {
	email: string;
};

const GetStarted = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<Inputs>();

	const onSubmit = async (formData: Inputs) => {
		try {
			const { email } = formData;
			const { data } = await client.query({
				query: SUBSCRIBE_ONBOARDING,
				variables: { email },
			});
			if (data?.subscribeOnboarding) {
				gToast('You have successfully subscribed.', {
					type: ToastType.SUCCESS,
					title: 'Success',
					position: 'top-center',
				});
				reset();
			} else {
				await Promise.reject();
			}
		} catch (e) {
			showToastError('Something went wrong, please try again later');
			reset();
		}
	};

	return (
		<OnboardingHeaderWrapperStyled>
			<H5 weight={700}>Get started with our Giveth onboarding guide</H5>
			<form onSubmit={handleSubmit(onSubmit)}>
				<InputWrapper>
					<Input
						registerName={'email'}
						placeholder={'Your email address'}
						size={InputSize.MEDIUM}
						register={register}
						error={errors.email}
						registerOptions={requiredOptions.email}
					/>
				</InputWrapper>
				<StyledButton type='submit'>
					Discover the Future of Giving
				</StyledButton>
			</form>
		</OnboardingHeaderWrapperStyled>
	);
};

const InputWrapper = styled.div`
	max-width: 700px;
	margin-top: 25px;
`;

const StyledButton = styled.button`
	display: flex;
	height: 48px;
	padding: 17px 24px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	border-radius: 48px;
	background: ${brandColors.giv[500]};
	color: ${neutralColors.gray[100]};
	text-align: center;
	font-family: 'Red Hat Text', 'sans-serif';
	font-size: 12px;
	font-style: normal;
	font-weight: 700;
	line-height: 18px;
	letter-spacing: 0.48px;
	text-transform: uppercase;
	margin-top: 8px;
	border: none;
	cursor: pointer;
`;

const OnboardingHeaderWrapperStyled = styled(OnboardingHeaderWrapper)`
	margin: 64px auto 74px;
	@media (max-width: ${deviceSize.tablet}px) {
		padding: 0 24px;
	}
	> * {
		margin-bottom: 16px;
	}
`;

export default GetStarted;
