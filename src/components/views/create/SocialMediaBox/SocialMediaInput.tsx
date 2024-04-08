import React, { FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '@/components/Input';
import { EInputs } from '../types';
interface IProps {
	registerName: EInputs;
	validator?: {
		pattern?: {
			value: RegExp;
			message: string;
		};
	};
}

const SocialMediaInput: FC<IProps> = ({ registerName, validator }) => {
	const {
		register,
		formState: { errors: formErrors },
		watch,
		trigger,
	} = useFormContext();

	const inputValue = watch(registerName);
	useEffect(() => {
		trigger(registerName);
	}, [registerName, trigger]);

	return (
		<>
			<Input
				value={inputValue}
				register={register}
				registerName={registerName}
				registerOptions={validator}
				error={formErrors[EInputs[registerName]]}
				placeholder='https://'
			/>
			<br />
		</>
	);
};

export default SocialMediaInput;
