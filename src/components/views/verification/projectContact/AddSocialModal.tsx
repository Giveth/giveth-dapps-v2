import React, { FC, useState } from 'react';
import { Button, IconLink } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import Input, { IFormValidations } from '@/components/Input';
import { regexList } from '@/lib/helpers';
import { mediaQueries } from '@/lib/constants/constants';
import { IProjectContact } from '@/apollo/types/types';
import useFormValidation from '@/hooks/useFormValidation';

interface IProps extends IModal {
	addSocial: (i: IProjectContact) => void;
}

const AddSocialModal: FC<IProps> = ({ setShowModal, addSocial }) => {
	const [name, setName] = useState('');
	const [url, setUrl] = useState('');
	const [formValidation, setFormValidation] = useState<IFormValidations>();

	const isFormValid = useFormValidation(formValidation);

	const handleSubmit = () => {
		addSocial({ name, url });
		setShowModal(false);
	};

	return (
		<Modal
			headerTitlePosition='left'
			headerTitle='Add a new social media'
			headerIcon={<IconLink size={23} />}
			setShowModal={setShowModal}
		>
			<Container>
				<Input
					label='Social media title'
					name='socialMediaTitle'
					placeholder='Discord'
					value={name}
					validators={validators.name}
					onChange={e => setName(e.target.value)}
					setFormValidation={setFormValidation}
					required
				/>
				<Input
					label='Link address'
					name='socialMediaAddress'
					placeholder='https://www.example.com/...'
					value={url}
					validators={validators.url}
					onChange={e => setUrl(e.target.value)}
					setFormValidation={setFormValidation}
					required
				/>
				<Buttons>
					<Button
						size='small'
						label='ADD NEW SOCIAL MEDIA'
						buttonType='secondary'
						onClick={handleSubmit}
						disabled={!isFormValid}
					/>
					<Button
						onClick={() => setShowModal(false)}
						size='small'
						label='CANCEL'
						buttonType='texty'
					/>
				</Buttons>
			</Container>
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

const validators = {
	name: [
		{
			pattern: regexList.tooShort,
			msg: 'Too short',
		},
	],
	url: [
		{
			pattern: regexList.url,
			msg: 'Invalid URL',
		},
	],
};

const Container = styled.div`
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
