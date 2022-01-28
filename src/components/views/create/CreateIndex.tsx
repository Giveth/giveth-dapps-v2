import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { H3, brandColors } from '@giveth/ui-design-system';
import { Regular_Input } from '@/components/styled-components/Input';
import { NameInput, DescriptionInput, CategoryInput } from './Inputs';
import styled from 'styled-components';

type Inputs = {
	name: string;
	description: string;
	category: any;
	impactLocation: string;
	image: any;
	walletAddress: string;
};

const CreateIndex = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
	console.log({ errors });
	return (
		<>
			<CreateContainer>
				<Title>Create a Project</Title>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* register your input into the hook by invoking the "register" function */}
					<NameInput {...register('name', { required: true })} />
					<DescriptionInput
						{...register('description', { required: true })}
					/>
					<CategoryInput
						{...register('category', { required: true })}
					/>
					<input type='submit' />
				</form>
			</CreateContainer>
		</>
	);
};

const Input = styled(Regular_Input)``;

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
`;

const Title = styled(H3)`
	color: ${brandColors.deep[600]};
	font-weight: bold;
`;

export default CreateIndex;
