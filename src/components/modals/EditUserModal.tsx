import React, { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { Button, brandColors } from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { useWeb3React } from '@web3-react/core';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { client } from '@/apollo/apolloClient';
import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { IUser } from '@/apollo/types/types';
import { FlexCenter } from '@/components/styled-components/Flex';
import { gToast, ToastType } from '../toasts';
import { mediaQueries } from '@/lib/constants/constants';
import { IModal } from '@/types/common';
import { useAppDispatch } from '@/features/hooks';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import Input, { InputSize } from '../Input';
import { requiredOptions, validators } from '@/lib/constants/regex';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import useUpload from '@/hooks/useUpload';

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
	const useUploadProps = useUpload();
	const { url, onDelete } = useUploadProps;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();
	const dispatch = useAppDispatch();
	const { account } = useWeb3React();
	const [updateUser] = useMutation(UPDATE_USER);
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const onSaveAvatar = async () => {
		try {
			const { data: response } = await updateUser({
				variables: {
					avatar: url,
				},
			});
			if (response.updateUser) {
				account && dispatch(fetchUserByAddress(account));
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
			console.log(error);
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
			const { data } = await client.mutate({
				mutation: UPDATE_USER,
				variables: {
					...formData,
				},
			});
			if (data.updateUser) {
				account && dispatch(fetchUserByAddress(account));
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
							src={
								user.avatar ? user.avatar : '/images/avatar.svg'
							}
							alt={user.name || ''}
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
							<TextButton
								buttonType='texty'
								label={formatMessage({
									id: 'label.delete_pic',
								})}
								onClick={onSaveAvatar}
							/>
						</FlexCenter>
					</FlexCenter>
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputWrapper>
							{inputFields.map(field => (
								<Input
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
							))}
							<Button
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

export default EditUserModal;
