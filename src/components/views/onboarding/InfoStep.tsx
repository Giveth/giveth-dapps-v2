import { useMutation } from '@apollo/client';
import {
	brandColors,
	Col,
	H6,
	neutralColors,
	Row,
} from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import {
	CHECK_EMAIL_AVAILABILITY,
	SEND_CODE_TO_CONFIRM_EMAIL,
	UPDATE_USER,
	VERIFY_USER_EMAIL_CODE,
} from '@/apollo/gql/gqlUser';
import Input from '@/components/Input';
import { SkipOnboardingModal } from '@/components/modals/SkipOnboardingModal';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { requiredOptions, validators } from '@/lib/constants/regex';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import VerifyInputButton from '../../VerifyInputButton';
import {
	IStep,
	OnboardActionsContainer,
	OnboardStep,
	SaveButton,
	SkipButton,
} from './common';
import { OnboardSteps } from './Onboarding.view';
import EmailSentCard from '../../EmailSentCard';
import { gToast, ToastType } from '../../toasts';

export interface IUserInfo {
	email: string;
	emailCode?: string;
	firstName: string;
	lastName: string;
	location: string;
	url: string;
}

enum EUserInfo {
	EMAIL = 'email',
	EMAIL_CODE = 'emailCode',
	FIRST_NAME = 'firstName',
	LAST_NAME = 'lastName',
	LOCATION = 'location',
	URL = 'url',
}

const InfoStep: FC<IStep> = ({ setStep }) => {
	const { formatMessage } = useIntl();
	const [isLoading, setIsLoading] = useState(false);
	const [updateUser] = useMutation(UPDATE_USER);
	const [sendEmailConfirmation, sendEmailConfirmationProps] = useMutation(
		SEND_CODE_TO_CONFIRM_EMAIL,
	);
	const [checkEmailAvailability, checkEmailAvailabilityProps] = useMutation(
		CHECK_EMAIL_AVAILABILITY,
	);
	const [verifyUserEmailCode, verifyUserEmailCodeProps] = useMutation(
		VERIFY_USER_EMAIL_CODE,
	);
	const [editEmailAlredySent, setEditEmailAlredySent] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const { walletAddress: address } = useGeneralWallet();
	const dispatch = useAppDispatch();
	const { isSignedIn, userData } = useAppSelector(state => state.user);

	const {
		watch,
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<IUserInfo>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		defaultValues: {
			[EUserInfo.EMAIL]: userData?.email || '',
			[EUserInfo.FIRST_NAME]: userData?.firstName || '',
			[EUserInfo.LAST_NAME]: userData?.lastName || '',
			[EUserInfo.LOCATION]: userData?.location || '',
			[EUserInfo.URL]: userData?.url || '',
		},
	});

	const watchEmail = watch(EUserInfo.EMAIL);
	const watchEmailCode = watch(EUserInfo.EMAIL_CODE);

	//verify email code
	const handleVerifyEmailCode = useCallback(async () => {
		if (!!watchEmailCode) {
			try {
				await verifyUserEmailCode({
					variables: {
						code: watchEmailCode,
					},
				});
				address && dispatch(fetchUserByAddress(address));
			} catch (error: any) {
				setError(EUserInfo.EMAIL_CODE, {
					type: 'manual',
					message: error.message,
				});
				captureException(error, {
					tags: {
						section: 'InfoStepOnSave',
					},
				});
			}
		}
	}, [watchEmailCode, verifyUserEmailCode, address, dispatch, setError]);

	//send email confirmation code
	const handleSendEmailConfirmation = useCallback(
		async (type?: string | void) => {
			if (!!watchEmail && !errors.email) {
				try {
					await sendEmailConfirmation({
						variables: {
							email: watchEmail,
						},
					});
					address && dispatch(fetchUserByAddress(address));
					setEditEmailAlredySent(false);
					if (type === 'resend') {
						gToast('Email confirmation code resent.', {
							type: ToastType.SUCCESS,
						});
					}
				} catch (error: any) {
					gToast('Failed to send email confirmation code.', {
						type: ToastType.DANGER,
						title: error.message,
					});
					captureException(error, {
						tags: {
							section: 'InfoStepOnSave',
						},
					});
				}
			}
		},
		[watchEmail, errors.email, sendEmailConfirmation, address, dispatch],
	);

	//check if the email is available
	const handleCheckEmailAvailability = useCallback(async () => {
		if (
			(!!watchEmail &&
				!errors.email &&
				!userData?.isEmailSent &&
				!userData?.isEmailVerified) ||
			(userData?.isEmailVerified && watchEmail !== userData?.email)
		) {
			try {
				await checkEmailAvailability({
					variables: {
						email: watchEmail,
					},
				});
			} catch (error: any) {
				if (error.message === 'Email already used') {
					setError(EUserInfo.EMAIL, {
						type: 'manual',
						message: formatMessage({
							id: 'error.invalid.email',
						}),
					});
				}
			}
		}
	}, [watchEmail, errors.email, userData, checkEmailAvailability, setError]);

	//check if some code request is loading
	const isLoadingSomeCodeRequest = useMemo(
		() =>
			sendEmailConfirmationProps.loading ||
			checkEmailAvailabilityProps.loading,
		[
			sendEmailConfirmationProps.loading,
			checkEmailAvailabilityProps.loading,
		],
	);

	//debounce email check
	useEffect(() => {
		const debounceTimeInMs = 500;
		const debouncedEmail = setTimeout(() => {
			handleCheckEmailAvailability();
		}, debounceTimeInMs);
		return () => {
			clearTimeout(debouncedEmail);
		};
	}, [handleCheckEmailAvailability, watchEmail]);

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
			delete formData.emailCode;
			const { data: response } = await updateUser({
				variables: {
					...formData,
					newUser: true,
				},
			});
			if (response.updateUser) {
				setStep(OnboardSteps.PHOTO);
				address && dispatch(fetchUserByAddress(address));
				return true;
			} else {
				throw 'Update User Failed';
			}
		} catch (error: any) {
			captureException(error, {
				tags: {
					section: 'InfoStepOnSave',
				},
			});
		}
		setIsLoading(false);
		return false;
	};

	const shouldRenderEmailCode = useMemo(
		() => userData?.isEmailSent && !editEmailAlredySent,
		[userData, editEmailAlredySent],
	);

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
							autoFocus
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
					<Col
						xs={12}
						md={6}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '16px',
						}}
					>
						<div>
							{shouldRenderEmailCode && (
								<EditAlredyFiledEmail
									onClick={() => {
										setEditEmailAlredySent(true);
									}}
								>
									{formatMessage({
										id: 'label.edit.email',
									})}
								</EditAlredyFiledEmail>
							)}
							<Input
								registerName={EUserInfo.EMAIL}
								// label='email'
								placeholder='Example@Domain.com'
								register={register}
								type='email'
								registerOptions={validators.email}
								error={errors.email}
								disabled={shouldRenderEmailCode}
								caption={formatMessage({
									id: 'label.email.caption',
								})}
								customFixedComponent={
									!shouldRenderEmailCode && (
										<VerifyInputButton
											onClick={() => {
												handleSendEmailConfirmation();
											}}
											verified={
												userData?.isEmailVerified &&
												watchEmail === userData?.email
											}
											label={
												userData?.isEmailVerified &&
												watchEmail === userData?.email
													? formatMessage({
															id: 'label.email.verified',
														})
													: formatMessage({
															id: 'label.verify.email',
														})
											}
											isLoading={isLoadingSomeCodeRequest}
											disabled={
												!!errors.email ||
												!watchEmail ||
												isLoadingSomeCodeRequest ||
												(userData?.isEmailVerified &&
													watchEmail ===
														userData?.email)
											}
										/>
									)
								}
							/>
						</div>
						{shouldRenderEmailCode && (
							<>
								<EmailSentCard email={watchEmail} />
								<Input
									registerName={EUserInfo.EMAIL_CODE}
									label={formatMessage({
										id: 'label.email.code',
									})}
									placeholder='000000'
									register={register}
									error={errors.emailCode}
									caption={
										<>
											{formatMessage({
												id: 'label.email.code.caption',
											})}
											<CustomCaption
												onClick={() =>
													handleSendEmailConfirmation(
														'resend',
													)
												}
											>
												{formatMessage({
													id: 'label.resend.email.code',
												})}
											</CustomCaption>
										</>
									}
									customFixedComponent={
										<VerifyInputButton
											onClick={() => {
												handleVerifyEmailCode();
											}}
											label={formatMessage({
												id: 'label.email.confirm.code',
											})}
											isLoading={
												verifyUserEmailCodeProps.loading
											}
											disabled={
												!!errors.email ||
												!watchEmail ||
												verifyUserEmailCodeProps.loading
											}
										/>
									}
								/>
							</>
						)}
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
							disabled={
								isLoading ||
								(!!watchEmail && !userData?.isEmailVerified)
							}
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

const EditAlredyFiledEmail = styled.button`
	padding: 0;
	margin: 0;
	outline: none;
	border: none;
	background: none;
	cursor: pointer;
	margin-bottom: 4px;

	color: ${brandColors.pinky[500]};
	font-size: 12px;
	font-weight: 400;
	line-height: 15.88px;
	text-align: left;
`;

const CustomCaption = styled.label`
	color: #e1458d;
	cursor: pointer;
`;

export default InfoStep;
