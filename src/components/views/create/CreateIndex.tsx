import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
	H3,
	H4,
	Button,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import {
	NameInput,
	DescriptionInput,
	CategoryInput,
	LocationInput,
	ImageInput,
	WalletAddressInput,
} from './Inputs';
import styled from 'styled-components';

type Inputs = {
	name: string;
	description: string;
	categories: any;
	impactLocation: string;
	image: any;
	walletAddress: string;
};

const CreateIndex = () => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = data => {
		console.log({ data });
	};
	console.log({ errors });
	return (
		<>
			<CreateContainer>
				<Title>Create a Project</Title>
				<form
					onSubmit={handleSubmit(onSubmit)}
					id='create-project-form'
				>
					{/* register your input into the hook by invoking the "register" function */}
					<NameInput
						{...register('name', { required: true })}
						setValue={(val: string) => setValue('name', val)}
					/>
					<DescriptionInput
						{...register('description', { required: true })}
						setValue={(val: string) => setValue('description', val)}
					/>
					<CategoryInput
						{...register('categories', { required: true })}
						setValue={(val: string) => setValue('categories', val)}
					/>
					<LocationInput {...register('impactLocation')} />
					<ImageInput
						{...register('image')}
						setValue={(val: string) => setValue('image', val)}
					/>
					<WalletAddressInput
						{...register('walletAddress', { required: true })}
						setValue={(val: string) =>
							setValue('walletAddress', val)
						}
					/>

					<PublishTitle>{`Let's Publish!`}</PublishTitle>
					<PublishList>
						<li>
							Newly published projects will be "unlisted" until
							reviewed by our team.
						</li>
						<li>
							You can still access your project from your account
							and share it with your friends via the project link!
						</li>
						<li>
							You'll receive an email from us once your project is
							listed.
						</li>
					</PublishList>
					<Buttons>
						<Button
							label='PREVIEW'
							buttonType='primary'
							// onClick={uploadImage}
						/>
						<Button
							label='PUBLISH'
							buttonType='primary'
							onClick={() => handleSubmit(onSubmit)()}
						/>
					</Buttons>
				</form>
			</CreateContainer>
		</>
	);
};

const CreateContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 104px 0 154px 264px;
	width: 677px;
	form {
		display: flex;
		flex-direction: column;
		margin: 48px 0;
		width: 677px;
	}
	h5 {
		font-weight: normal;
		line-height: 36px;
		letter-spacing: -0.005em;
	}
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: row;
	margin: 61px 0 32px 0;
	* {
		font-weight: bold;
	}
	button {
		width: 100%;
	}
	button:first-child {
		background: white;
		color: ${brandColors.pinky[500]};
		border: 2px solid ${brandColors.pinky[500]};
		margin: 0 24px 0 0;
	}
`;

const Title = styled(H3)`
	color: ${brandColors.deep[600]};
	font-weight: bold;
`;

const PublishTitle = styled(H4)`
	margin: 45px 0 24px 0;
	color: ${brandColors.deep[900]};
	font-weight: bold;
`;

const PublishList = styled.ul`
	font-size: 14px;
	color: ${neutralColors.gray[900]};
`;
export default CreateIndex;
