import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
	Button,
	brandColors,
	GLink,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { IModal, Modal } from './Modal';
import { client } from '@/apollo/apolloClient';
import { UPDATE_USER, UPLOAD_PROFILE_PHOTO } from '@/apollo/gql/gqlUser';
import { IUser } from '@/apollo/types/types';
import { FlexCenter, Row } from '@/components/styled-components/Grid';
import { checkIfURLisValid } from '@/utils';
import ImageUploader from '../ImageUploader';
import { useMutation } from '@apollo/client';
import { gToast, ToastType } from '../toasts';
import { Toaster } from 'react-hot-toast';

interface IInputProps {
	examples: string;
	explanation?: string;
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	name: string;
	placeholder: string;
	value?: string;
}

const Input = ({
	examples,
	explanation,
	handleChange,
	name,
	placeholder,
	value,
}: IInputProps) => {
	return (
		<InputContainer>
			<InputPlaceholder size='Tiny'>{placeholder}</InputPlaceholder>
			<InputBox
				onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
					handleChange(event)
				}
				name={name}
				placeholder={examples}
				value={value}
			/>
			{explanation ? (
				<InputPlaceholder size='Tiny'>{explanation}</InputPlaceholder>
			) : (
				<DummyLine />
			)}
		</InputContainer>
	);
};

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 3px;
	font-family: Red Hat Text;
`;

const InputPlaceholder = styled(GLink)`
	text-align: left;
`;

const InputBox = styled.input`
	width: 100%;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	padding: 4px;
	font-family: Red Hat Text;

	::placeholder {
		color: ${neutralColors.gray[500]};
		font-size: 12px;
	}
`;

const DummyLine = styled.br`
	content: '';
	font-size: 10px;
	height: 13px;
`;

enum EditStatusType {
	INFO,
	PHOTO,
}

interface IEditUserModal extends IModal {
	user: IUser;
}

const EditUserModal = ({ showModal, setShowModal, user }: IEditUserModal) => {
	const [editStatus, setEditStatus] = useState<EditStatusType>(
		EditStatusType.INFO,
	);
	const [avatar, setAvatar] = useState<string>();
	const [newUser, setNewUser] = useState({
		name: '',
		firstName: user.firstName,
		lastName: user.lastName || '',
		location: user.location || '',
		email: user.email || '',
		url: user.url || '',
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const [updateUser] = useMutation(UPDATE_USER);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setNewUser(previousContent => ({
			...previousContent,
			[name]: value,
		}));
	};

	const onDrop = async (acceptedFiles: File[]) => {
		const { data: imageUploaded } = await client.mutate({
			mutation: UPLOAD_PROFILE_PHOTO,
			variables: {
				fileUpload: {
					image: acceptedFiles[0],
				},
			},
		});
		setAvatar(imageUploaded.upload);
	};

	const onSaveAvatar = async () => {
		try {
			const { data: response } = await updateUser({
				variables: {
					avatar,
				},
			});
			if (response.updateUser) {
				setEditStatus(EditStatusType.INFO);
				setAvatar('');
			} else {
				throw 'updateUser false';
			}
		} catch (error) {
			gToast('Failed to update your profile photo. Please try again.', {
				type: ToastType.DANGER,
			});
			console.log(error);
		}
	};

	const handleSubmit = async () => {
		/* TO DO: ADD TOAST */
		const { url } = newUser;
		try {
			if (url) {
				const valid = await checkIfURLisValid(url);
				if (!valid) {
					return 'toast warning about url';
				}
			}
			const { data } = await client.mutate({
				mutation: UPDATE_USER,
				variables: {
					...newUser,
				},
			});
			if (data.updateUser) {
				setIsLoading(true);
				router.replace(router.asPath);
			} else {
				return 'fail to change ';
			}
		} catch (error) {
			return 'some strange error';
		}
	};

	useEffect(() => {
		setIsLoading(false);
		if (isLoading) {
			setShowModal(false);
		}
	}, [newUser, user]);

	return (
		<>
			<Modal
				showModal={showModal}
				setShowModal={setShowModal}
				headerIcon={<></>}
				headerTitle='Edit profile'
				headerTitlePosition='left'
			>
				<Wrapper>
					{editStatus === EditStatusType.PHOTO ? (
						<>
							<Row flexDirection='column' gap='36px'>
								<ImageUploader
									onDrop={onDrop}
									setUrl={setAvatar}
									url={avatar}
								/>
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
							</Row>
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
										onClick={() => {
											onSaveAvatar();
										}}
									/>
								</FlexCenter>
							</FlexCenter>
							<InputWrapper>
								{inputFields.map(field => (
									<Input
										key={field.name}
										handleChange={handleChange}
										examples={field.examples}
										explanation={field.explanation}
										name={field.name}
										placeholder={field.placeholder}
										value={(newUser as any)[field.name]}
									/>
								))}
								<Button
									buttonType='secondary'
									label='SAVE'
									disabled={
										!newUser.firstName ||
										!newUser.lastName ||
										isLoading
									}
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
			<Toaster />
		</>
	);
};

const inputFields = [
	{
		examples: 'John',
		explanation: '',
		name: 'firstName',
		placeholder: 'First Name *',
	},
	{
		examples: 'Doe',
		explanation: '',
		name: 'lastName',
		placeholder: 'Last Name *',
	},
	{
		examples: 'Your email address',
		explanation:
			'Email address we can use to communicate with you and send you project notifications.',
		name: 'email',
		placeholder: 'Email *',
	},
	{
		examples: 'Portugal, Turkey, ...',
		explanation: '',
		name: 'location',
		placeholder: 'Location',
	},
	{
		examples: 'Website',
		explanation: 'Your home page, blog, or company site.',
		name: 'url',
		placeholder: 'Website or URL',
	},
];

const Wrapper = styled.div`
	padding: 24px;
	max-width: 448px;
	width: 100%;
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
`;

export default EditUserModal;
