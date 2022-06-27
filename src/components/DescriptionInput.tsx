import { FC, InputHTMLAttributes } from 'react';
import { FieldError, RegisterOptions, UseFormRegister } from 'react-hook-form';
import styled from 'styled-components';
import { GLink, neutralColors, semanticColors } from '@giveth/ui-design-system';
import { TextArea } from './styled-components/TextArea';
import { EInputValidation, IInputValidation } from '@/types/inputValidation';

interface IInputWithRegister extends InputHTMLAttributes<HTMLTextAreaElement> {
	register: UseFormRegister<any>;
	registerName: string;
	registerOptions?: RegisterOptions;
	error?: FieldError;
}

type InputType =
	| IInputWithRegister
	| ({
			registerName?: never;
			register?: never;
			registerOptions?: never;
			error?: never;
	  } & IInputWithRegister);

const DescriptionInput: FC<InputType> = ({
	register = () => {},
	registerName = '',
	registerOptions = { required: false },
	error,
	...rest
}) => {
	const validationStatus = error
		? EInputValidation.ERROR
		: EInputValidation.NORMAL;

	return (
		<>
			<TextArea
				validation={validationStatus}
				{...register(registerName, registerOptions)}
				{...rest}
			/>
			<ErrorMessage validation={validationStatus}>
				{error?.message || ' '}
			</ErrorMessage>
		</>
	);
};

const ErrorMessage = styled(GLink)<IInputValidation>`
	padding-top: 4px;
	color: ${props => {
		switch (props.validation) {
			case EInputValidation.NORMAL:
				return neutralColors.gray[900];
			case EInputValidation.WARNING:
				return semanticColors.golden[600];
			case EInputValidation.ERROR:
				return semanticColors.punch[500];
			case EInputValidation.SUCCESS:
				return semanticColors.jade[500];
			default:
				return neutralColors.gray[300];
		}
	}};
`;

export default DescriptionInput;
