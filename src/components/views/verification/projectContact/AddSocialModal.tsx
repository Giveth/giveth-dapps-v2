import React, { FC } from 'react';
import { Button, IconLink } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import Input from '@/components/Input';
import { mediaQueries } from '@/lib/constants/constants';
import { IProjectContact } from '@/apollo/types/types';
import { requiredOptions, validators } from '@/lib/constants/regex';
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IProps extends IModal {
	addSocial: (i: IProjectContact) => void;
}

const AddSocialModal: FC<IProps> = ({ setShowModal, addSocial }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IProjectContact>();

	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	const handleFormSubmit = (formData: IProjectContact) => {
		addSocial(formData);
		closeModal();
	};

	return (
		<Modal
			headerTitlePosition='left'
			headerTitle='Add a new social media account'
			headerIcon={<IconLink size={23} />}
			isAnimating={isAnimating}
			closeModal={closeModal}
		>
			<FormContainer onSubmit={handleSubmit(handleFormSubmit)} noValidate>
				<Input
					label='Social media title'
					registerName='name'
					placeholder='Discord'
					register={register}
					registerOptions={{
						...requiredOptions.name,
						...validators.tooShort,
					}}
					error={errors.name}
				/>
				<Input
					label='Link address'
					registerName='url'
					placeholder='https://www.example.com/...'
					register={register}
					registerOptions={requiredOptions.website}
					error={errors.url}
				/>
				<Buttons>
					<Button
						size='small'
						label='ADD NEW SOCIAL MEDIA'
						buttonType='secondary'
						type='submit'
					/>
					<Button
						onClick={closeModal}
						size='small'
						label='CANCEL'
						buttonType='texty'
					/>
				</Buttons>
			</FormContainer>
		</Modal>
	);
};

const Buttons = styled.div`
	margin-top: 15px;
	> :last-child {
		margin-top: 10px;
		:hover {
			background-color: transparent;
		}
	}
	> * {
		width: 100%;
	}
`;

const FormContainer = styled.form`
	width: 100vw;
	padding: 26px;
	text-align: left;
	${mediaQueries.mobileL} {
		width: 425px;
	}
	${mediaQueries.tablet} {
		width: 480px;
	}
`;

export default AddSocialModal;
