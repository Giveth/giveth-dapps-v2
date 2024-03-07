import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '@/components/Input';
import { EInputs } from '../types';
interface IProps {
	registerName: EInputs;
}

const SocialMediaInput: FC<IProps> = ({ registerName }) => {
	const {
		register,
		formState: { errors: formErrors },
		watch,
	} = useFormContext();

	const inputValue = watch(registerName);

	return (
		<>
			<Input
				value={inputValue}
				register={register}
				registerName={registerName}
				// registerOptions={validators[registerName] }
				// error={formErrors[EInputs[registerName]]}
			/>
			<br />
		</>
	);
};

export default SocialMediaInput;
