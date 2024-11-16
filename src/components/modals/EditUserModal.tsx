import React, { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { Button, brandColors, FlexCenter } from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { client } from '@/apollo/apolloClient';
import {
	SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
	UPDATE_USER,
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
import InputUserEmailVerify from '../InputUserEmailVerify';

interface IEditUserModal extends IModal {
	user: IUser;
	setShowProfilePicModal: (showModal: boolean) => void;
}

type Inputs = {
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
		formState: { errors },
	} = useForm<Inputs>();
	const dispatch = useAppDispatch();
	const { walletAddress: address } = useGeneralWallet();

	const [updateUser] = useMutation(UPDATE_USER);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

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

	const testMe = async () => {
		try {
			const { data } = await client.mutate({
				mutation: SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
				variables: {
					email: 'kkatusic@gmail.com',
				},
			});
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	const onSubmit = async (formData: Inputs) => {
		setIsLoading(true);
		try {
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
						<div>
							<button type='button' onClick={testMe}>
								TEST ME
							</button>
						</div>
						<InputWrapper>
							{inputFields.map(field => {
								// We load different input components for email becasue validation is different
								const InputComponent =
									field.type === 'email'
										? InputUserEmailVerify
										: Input;

								return (
									<InputComponent
										defaultValue={(user as any)[field.name]}
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
							<ButtonEditSave
								buttonType='secondary'
								label={formatMessage({
									id: 'label.save',
								})}
								disabled={isLoading}
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

const inputFields = [
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
		label: 'label.email_address',
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

const ButtonEditSave = styled(Button)`
	margin-top: 24px;
`;

export default EditUserModal;
