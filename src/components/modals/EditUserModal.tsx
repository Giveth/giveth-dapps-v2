import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { Button, brandColors, FlexCenter } from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { RegisterOptions, useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { client } from '@/apollo/apolloClient';
import {
	CHECK_EMAIL_AVAILABILITY,
	SEND_CODE_TO_CONFIRM_EMAIL,
	UPDATE_USER,
	VERIFY_USER_EMAIL_CODE,
} from '@/apollo/gql/gqlUser';
import { IUser } from '@/apollo/types/types';
import { gToast, ToastType } from '../toasts';
import {
	PROFILE_PHOTO_PLACEHOLDER,
	mediaQueries,
} from '@/lib/constants/constants';
import { IModal } from '@/types/common';
import { useAppDispatch } from '@/features/hooks';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import Input, { InputSize } from '../Input';
import { requiredOptions, validators } from '@/lib/constants/regex';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import useUpload from '@/hooks/useUpload';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import VerifyInputButton from '../VerifyInputButton';
import EmailSentCard from '../EmailSentCard';

interface IEditUserModal extends IModal {
	user: IUser;
	setShowProfilePicModal: (showModal: boolean) => void;
}

type Inputs = {
	emailCode?: string;
	firstName: string;
	lastName: string;
	location: string;
	email: string;
	url: string;
};

const EditUserModal = ({
	setShowModal,
	user,
	setShowProfilePicModal,
}: IEditUserModal) => {
	const { formatMessage } = useIntl();
	const [isLoading, setIsLoading] = useState(false);
	const { onDelete } = useUpload();

	const { avatar, name } = user;

	const {
		register,
		handleSubmit,
		setError,
		watch,
		formState: { errors },
	} = useForm<Inputs>({
		mode: 'onChange',
		reValidateMode: 'onChange',

		defaultValues: {
			email: user.email,
		},
	});
	const dispatch = useAppDispatch();
	const { walletAddress: address } = useGeneralWallet();
	const [isEmailVerified, setIsEmailVerified] = useState(
		user.isEmailVerified,
	);
	const [isEmailSent, setIsEmailSent] = useState(user.isEmailSent);
	const [newUserEmail, setNewUserEmail] = useState(user.email);

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
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const watchEmail = watch('email');
	const watchEmailCode = watch('emailCode');

	//verify email code
	const handleVerifyEmailCode = useCallback(async () => {
		if (!!watchEmailCode) {
			try {
				await verifyUserEmailCode({
					variables: {
						code: watchEmailCode,
					},
				});
				setIsEmailVerified(true);
				setIsEmailSent(false);
			} catch (error: any) {
				setError('emailCode', {
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
	}, [watchEmailCode, verifyUserEmailCode, setError]);

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
					setNewUserEmail(watchEmail);
					setIsEmailSent(true);
					setEditEmailAlredySent(false);
					setIsEmailVerified(false);

					if (type === 'resend') {
						gToast('Email confirmation code resent.', {
							type: ToastType.SUCCESS,
							title: 'Success',
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
		[watchEmail, errors.email, sendEmailConfirmation],
	);

	//check if the email is available
	const handleCheckEmailAvailability = useCallback(async () => {
		if (
			(!!watchEmail &&
				!errors.email &&
				!isEmailSent &&
				!isEmailVerified) ||
			(isEmailVerified && watchEmail !== newUserEmail)
		) {
			try {
				await checkEmailAvailability({
					variables: {
						email: watchEmail,
					},
				});
			} catch (error: any) {
				if (error.message === 'Email already used') {
					setError('email', {
						type: 'manual',
						message: formatMessage({
							id: 'error.invalid.email',
						}),
					});
				}
			}
		}
	}, [
		newUserEmail,
		watchEmail,
		errors.email,
		isEmailSent,
		isEmailVerified,
		user?.email,
		checkEmailAvailability,
		setError,
	]);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watchEmail]);

	const onSaveAvatar = async () => {
		try {
			const { data: response } = await updateUser({
				variables: { avatar: '' },
			});
			if (response.updateUser) {
				address && dispatch(fetchUserByAddress(address));
				gToast('Profile Photo updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				onDelete();
			} else {
				throw 'updateUser false';
			}
		} catch (error: any) {
			gToast('Failed to update your information. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
			console.error(error);
			captureException(error, {
				tags: {
					section: 'onSaveAvatar',
				},
			});
		}
	};

	const onSubmit = async (formData: Inputs) => {
		setIsLoading(true);
		try {
			delete formData.emailCode;
			const { data } = await client.mutate({
				mutation: UPDATE_USER,
				variables: {
					...formData,
				},
			});
			if (data.updateUser) {
				address && dispatch(fetchUserByAddress(address));
				gToast('Profile information updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				closeModal();
			} else {
				throw 'Update User Failed.';
			}
		} catch (error: any) {
			gToast('Failed to update your information. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
			captureException(error, {
				tags: {
					section: 'Submit Edit User Modal',
				},
			});
		}
		setIsLoading(false);
	};

	const shouldRenderEmailCode = useMemo(
		() => (user?.isEmailSent || isEmailSent) && !editEmailAlredySent,
		[user?.isEmailSent, isEmailSent, editEmailAlredySent],
	);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle={formatMessage({
				id: 'label.edit_profile',
			})}
			headerTitlePosition='left'
		>
			<Wrapper>
				<>
					<FlexCenter direction='column' gap='8px'>
						<ProfilePicture
							src={avatar ? avatar : PROFILE_PHOTO_PLACEHOLDER}
							alt={name || ''}
							height={80}
							width={80}
						/>
						<FlexCenter direction='column'>
							<TextButton
								buttonType='texty'
								color={brandColors.pinky[500]}
								label={formatMessage({
									id: 'label.upload_new_pic',
								})}
								onClick={() => {
									setShowProfilePicModal(true);
									closeModal();
								}}
							/>
							{avatar && (
								<TextButton
									buttonType='texty'
									label={formatMessage({
										id: 'label.delete_pic',
									})}
									onClick={onSaveAvatar}
								/>
							)}
						</FlexCenter>
					</FlexCenter>
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputWrapper>
							{inputFields.map(field => {
								if (field.name === 'email') {
									return (
										<>
											<div>
												{shouldRenderEmailCode && (
													<EditAlredyFiledEmail
														onClick={() => {
															setEditEmailAlredySent(
																true,
															);
														}}
													>
														{formatMessage({
															id: 'label.edit.email',
														})}
													</EditAlredyFiledEmail>
												)}
												<Input
													defaultValue={user.email}
													name='email'
													registerName={'email'}
													label={
														!shouldRenderEmailCode
															? 'Email'
															: undefined
													}
													placeholder='Example@Domain.com'
													register={register}
													type='email'
													registerOptions={
														validators.email
													}
													error={errors.email}
													size={InputSize.SMALL}
													disabled={
														shouldRenderEmailCode
													}
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
																	isEmailVerified &&
																	watchEmail ===
																		newUserEmail
																}
																label={
																	isEmailVerified &&
																	watchEmail ===
																		newUserEmail
																		? formatMessage(
																				{
																					id: 'label.email.verified',
																				},
																			)
																		: formatMessage(
																				{
																					id: 'label.verify.email',
																				},
																			)
																}
																isLoading={
																	isLoadingSomeCodeRequest
																}
																disabled={
																	!!errors.email ||
																	!watchEmail ||
																	isLoadingSomeCodeRequest ||
																	(isEmailVerified &&
																		watchEmail ===
																			newUserEmail)
																}
															/>
														)
													}
												/>
											</div>
											{shouldRenderEmailCode && (
												<>
													<EmailSentCard
														email={watchEmail}
													/>
													<Input
														registerName={
															'emailCode'
														}
														label={formatMessage({
															id: 'label.email.code',
														})}
														placeholder='000000'
														register={register}
														error={errors.emailCode}
														size={InputSize.SMALL}
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
																	{formatMessage(
																		{
																			id: 'label.resend.email.code',
																		},
																	)}
																</CustomCaption>
															</>
														}
														customFixedComponent={
															<VerifyInputButton
																onClick={() => {
																	handleVerifyEmailCode();
																}}
																label={formatMessage(
																	{
																		id: 'label.email.confirm.code',
																	},
																)}
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
										</>
									);
								}

								return (
									<Input
										defaultValue={
											user[field.name] as string
										}
										key={field.name}
										registerName={field.name}
										label={formatMessage({
											id: field.label,
										})}
										placeholder={field.placeholder}
										caption={
											field.caption &&
											formatMessage({
												id: field.caption,
											})
										}
										size={InputSize.SMALL}
										register={register}
										error={(errors as any)[field.name]}
										registerOptions={field.registerOptions}
									/>
								);
							})}
							<Button
								buttonType='secondary'
								label={formatMessage({
									id: 'label.save',
								})}
								disabled={
									isLoading ||
									(!!user.projectsCount && !isEmailVerified)
								}
								type='submit'
							/>
							<TextButton
								buttonType='texty'
								label={formatMessage({
									id: 'label.cancel',
								})}
								onClick={closeModal}
							/>
						</InputWrapper>
					</form>
				</>
			</Wrapper>
		</Modal>
	);
};

type InputFildesArray = {
	label: any;
	placeholder: string;
	name: keyof IUser;
	type?: string;
	caption?: string;
	registerOptions?: RegisterOptions;
};

const inputFields: InputFildesArray[] = [
	{
		label: 'label.first_name',
		placeholder: 'John',
		name: 'firstName',
		registerOptions: requiredOptions.firstName,
	},
	{
		label: 'label.last_name',
		placeholder: 'Doe',
		name: 'lastName',
		registerOptions: requiredOptions.lastName,
	},
	{
		label: 'label.email',
		placeholder: 'Example@Domain.com',
		name: 'email',
		type: 'email',
		registerOptions: requiredOptions.email,
	},
	{
		label: 'label.location_optional',
		placeholder: 'Portugal, Turkey,...',
		name: 'location',
	},
	{
		label: 'label.website_or_url',
		placeholder: 'Website',
		name: 'url',
		type: 'url',
		caption: 'label.your_homepage_or_blog',
		registerOptions: validators.website,
	},
];

const Wrapper = styled.div`
	padding: 24px;
	${mediaQueries.tablet} {
		width: 448px;
	}
`;

const ProfilePicture = styled(Image)`
	border-radius: 8px;
`;

const TextButton = styled(Button)<{ color?: string }>`
	color: ${props => props.color};
	text-transform: uppercase;

	&:hover {
		background-color: transparent;
		color: ${props => props.color};
	}
`;

const InputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	text-align: left;
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

export default EditUserModal;
