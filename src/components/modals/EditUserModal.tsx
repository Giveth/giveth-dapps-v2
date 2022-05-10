import React, { ChangeEvent, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useMutation } from '@apollo/client';
import { Button, brandColors } from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { Modal } from './Modal';
import { client } from '@/apollo/apolloClient';
import { UPDATE_USER } from '@/apollo/gql/gqlUser';
import { IUser } from '@/apollo/types/types';
import { FlexCenter, Flex } from '@/components/styled-components/Flex';
import ImageUploader from '../ImageUploader';
import { gToast, ToastType } from '../toasts';
import useUser from '@/context/UserProvider';
import Input, {
	IFormValidations,
	InputSize,
	InputValidationType,
} from '../Input';
import { IUserInfo } from '../views/onboarding/InfoStep';
import { mediaQueries } from '@/lib/constants/constants';
import { IModal } from '@/types/common';

enum EditStatusType {
	INFO,
	PHOTO,
}

interface IEditUserModal extends IModal {
	user: IUser;
}

const EditUserModal = ({ setShowModal, user }: IEditUserModal) => {
	const [disabled, setDisabled] = useState(false);
	const [editStatus, setEditStatus] = useState<EditStatusType>(
		EditStatusType.INFO,
	);
	const [avatar, setAvatar] = useState<string>('');
	const [formValidation, setFormValidation] = useState<IFormValidations>();
	const [info, setInfo] = useReducer(
		(curValues: IUserInfo, newValues: object) => ({
			...curValues,
			...newValues,
		}),
		{
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			location: user.location || '',
			email: user.email || '',
			url: user.url || '',
		},
	);

	const {
		actions: { reFetchUser },
	} = useUser();
	const [updateUser] = useMutation(UPDATE_USER);

	useEffect(() => {
		if (formValidation) {
			const fvs = Object.values(formValidation);
			setDisabled(!fvs.every(fv => fv === InputValidationType.NORMAL));
		}
	}, [formValidation]);

	const reducerInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInfo({ [name]: value });
	};

	const onSaveAvatar = async () => {
		try {
			const { data: response } = await updateUser({
				variables: {
					avatar,
				},
			});
			if (response.updateUser) {
				reFetchUser();
				setEditStatus(EditStatusType.INFO);
				gToast('Profile Photo updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
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

	const handleSubmit = async () => {
		setDisabled(true);
		try {
			const { data } = await client.mutate({
				mutation: UPDATE_USER,
				variables: {
					...info,
				},
			});
			if (data.updateUser) {
				reFetchUser();
				gToast('Profile information updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				setShowModal(false);
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
		setDisabled(false);
	};

	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<></>}
			headerTitle='Edit profile'
			headerTitlePosition='left'
		>
			<Wrapper>
				{editStatus === EditStatusType.PHOTO ? (
					<>
						<Flex flexDirection='column' gap='36px'>
							<ImageUploader setUrl={setAvatar} url={avatar} />
							<Button
								buttonType='secondary'
								label='SAVE'
								onClick={onSaveAvatar}
								disabled={!avatar}
							/>
							<TextButton
								buttonType='texty'
								label='cancel'
								onClick={() => {
									setAvatar('');
									setEditStatus(EditStatusType.INFO);
								}}
							/>
						</Flex>
					</>
				) : (
					<>
						<FlexCenter direction='column' gap='8px'>
							<ProfilePicture
								src={
									user.avatar
										? user.avatar
										: '/images/avatar.svg'
								}
								alt={user.name}
								height={80}
								width={80}
							/>
							<FlexCenter direction='column'>
								<TextButton
									buttonType='texty'
									color={brandColors.pinky[500]}
									label='upload new picture'
									onClick={() =>
										setEditStatus(EditStatusType.PHOTO)
									}
								/>
								<TextButton
									buttonType='texty'
									label='delete picture'
									onClick={onSaveAvatar}
								/>
							</FlexCenter>
						</FlexCenter>
						<InputWrapper>
							{inputFields.map(field => (
								<Input
									key={field.name}
									onChange={reducerInputChange}
									name={field.name}
									placeholder={field.placeholder}
									value={(info as any)[field.name]}
									label={field.label}
									caption={field.caption}
									type={field.type}
									validators={field.validators}
									setFormValidation={setFormValidation}
									size={InputSize.SMALL}
									required={field.required}
								/>
							))}
							<Button
								buttonType='secondary'
								label='SAVE'
								disabled={disabled}
								onClick={handleSubmit}
							/>
							<TextButton
								buttonType='texty'
								label='cancel'
								onClick={() => setShowModal(false)}
							/>
						</InputWrapper>
					</>
				)}
			</Wrapper>
		</Modal>
	);
};

const inputFields = [
	{
		label: 'first name',
		placeholder: 'John',
		name: 'firstName',
		required: true,
	},
	{
		label: 'last name',
		placeholder: 'Doe',
		name: 'lastName',
		required: true,
	},
	{
		label: 'email',
		placeholder: 'Example@Domain.com',
		name: 'email',
		type: 'email',
		required: true,
		validators: [
			{ pattern: /^.{3,}$/, msg: 'Too Short' },
			{
				pattern:
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				msg: 'Invalid Email Address',
			},
		],
	},
	{
		label: 'location (optional)',
		placeholder: 'Portugal, Turkey,...',
		name: 'location',
	},
	{
		label: 'website or url',
		placeholder: 'Website',
		name: 'url',
		type: 'url',
		caption: 'Your home page, blog, or company site.',
		validators: [
			{
				pattern:
					/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
				msg: 'Invalid URL',
			},
		],
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
