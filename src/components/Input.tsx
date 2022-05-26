import {
	brandColors,
	neutralColors,
	GLink,
	semanticColors,
} from '@giveth/ui-design-system';
import {
	ChangeEvent,
	Dispatch,
	FC,
	HTMLInputTypeAttribute,
	memo,
	SetStateAction,
	useEffect,
	useState,
} from 'react';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';

export interface IFormValidations {
	[key: string]: InputValidationType;
}

export enum InputValidationType {
	NORMAL,
	WARNING,
	ERROR,
	SUCCESS,
}

export enum InputSize {
	SMALL,
	MEDIUM,
	LARGE,
}

interface IInput {
	value: string;
	onChange?: any;
	type?: HTMLInputTypeAttribute;
	name: string;
	placeholder?: string;
	label?: string;
	required?: boolean;
	caption?: string;
	validators?: IInputValidator[];
	size?: InputSize;
	setFormValidation?: Dispatch<SetStateAction<IFormValidations | undefined>>;
	disabled?: boolean;
}

interface IInputValidator {
	pattern: RegExp;
	msg: string;
}

const InputSizeToLinkSize = (size: InputSize) => {
	switch (size) {
		case InputSize.SMALL:
			return 'Tiny';
		case InputSize.MEDIUM:
			return 'Small';
		case InputSize.LARGE:
			return 'Medium';
		default:
			return 'Small';
	}
};

const Input: FC<IInput> = ({
	name,
	value,
	onChange,
	type = 'text',
	validators,
	placeholder,
	label,
	caption,
	required,
	size = InputSize.MEDIUM,
	setFormValidation,
	disabled,
}) => {
	const [validation, setValidation] = useState<{
		status: InputValidationType;
		msg?: string;
	}>({
		status: InputValidationType.NORMAL,
		msg: undefined,
	});

	const changeHandle = (e: ChangeEvent<HTMLInputElement>) => {
		onChange && onChange(e);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			if (value.length === 0) {
				if (required) {
					setValidation({
						status: InputValidationType.ERROR,
						msg: `${label} is required`,
					});
					if (setFormValidation) {
						setFormValidation(formValidation => ({
							...formValidation,
							[name]: InputValidationType.ERROR,
						}));
					}
				} else {
					setValidation({
						status: InputValidationType.NORMAL,
						msg: undefined,
					});
				}
				return;
			}
			if (validators) {
				const error = validators.find(
					validator => !validator.pattern.test(value),
				);
				if (error) {
					setValidation({
						status: InputValidationType.ERROR,
						msg: error.msg,
					});
					if (setFormValidation) {
						setFormValidation(formValidation => ({
							...formValidation,
							[name]: InputValidationType.ERROR,
						}));
					}
					return;
				}
			}
			if (validation.status !== InputValidationType.NORMAL) {
				setValidation({
					status: InputValidationType.NORMAL,
					msg: undefined,
				});
				if (setFormValidation) {
					setFormValidation(formValidation => ({
						...formValidation,
						[name]: InputValidationType.NORMAL,
					}));
				}
			}
		}, 300);
		return () => {
			clearTimeout(timer);
		};
	}, [required, validators, value]);

	return (
		<InputContainer>
			{label && (
				<InputLabel
					disabled={disabled}
					size={InputSizeToLinkSize(size)}
					required={required}
				>
					{label}
				</InputLabel>
			)}
			<InputField
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={changeHandle}
				type={type}
				validation={validation.status}
				inputSize={size}
				disabled={disabled}
			/>
			{validation.msg ? (
				<InputValidation
					validation={validation.status}
					size={InputSizeToLinkSize(size)}
				>
					{validation.msg}
				</InputValidation>
			) : (
				<InputDesc size={InputSizeToLinkSize(size)}>
					{caption || '\u200C'}
				</InputDesc> //hidden char
			)}
		</InputContainer>
	);
};

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled(GLink)<{ required?: boolean; disabled?: boolean }>`
	padding-bottom: 4px;
	color: ${props =>
		props.disabled ? neutralColors.gray[600] : brandColors.deep[500]};
	::after {
		content: '*';
		display: ${props => (props.required ? 'inline-block' : 'none')};
		padding: 0 4px;
		color: ${semanticColors.punch[500]};
	}
`;

interface IValidation {
	validation: InputValidationType;
}

interface IInputField extends IValidation {
	inputSize: InputSize;
}

const InputField = styled.input<IInputField>`
	width: 100%;
	height: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '32px';
			case InputSize.MEDIUM:
				return '54px';
			case InputSize.LARGE:
				return '56px';
			default:
				break;
		}
	}};
	border: 2px solid
		${props => {
			switch (props.validation) {
				case InputValidationType.NORMAL:
					return neutralColors.gray[300];
				case InputValidationType.WARNING:
					return semanticColors.golden[600];
				case InputValidationType.ERROR:
					return semanticColors.punch[500];
				case InputValidationType.SUCCESS:
					return semanticColors.jade[500];
				default:
					return neutralColors.gray[300];
			}
		}};
	border-radius: 8px;
	padding: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '8px';
			case InputSize.MEDIUM:
				return '15px 16px';
			case InputSize.LARGE:
				return '18px 16px';
			default:
				break;
		}
	}};
	font-size: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '12px';
			case InputSize.MEDIUM:
				return '16px';
			case InputSize.LARGE:
				return '16px';
			default:
				break;
		}
	}};
	line-height: 150%;
	/* font-weight: 500; */
	font-family: 'Red Hat Text', sans-serif;
	caret-color: ${brandColors.giv[300]};
	box-shadow: ${Shadow.Neutral[400]};
	:focus {
		border: 2px solid
			${props => {
				switch (props.validation) {
					case InputValidationType.NORMAL:
						return brandColors.giv[600];
					case InputValidationType.WARNING:
						return semanticColors.golden[700];
					case InputValidationType.ERROR:
						return semanticColors.punch[700];
					case InputValidationType.SUCCESS:
						return semanticColors.jade[700];
					default:
						return brandColors.giv[600];
				}
			}};
	}
	:disabled {
		background: ${neutralColors.gray[300]};
	}
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;

const InputDesc = styled(GLink)`
	padding-top: 4px;
	color: ${brandColors.deep[500]};
	display: block;
`;

const InputValidation = styled(GLink)<IValidation>`
	padding-top: 4px;
	display: block;
	color: ${props => {
		switch (props.validation) {
			case InputValidationType.NORMAL:
				return neutralColors.gray[900];
			case InputValidationType.WARNING:
				return semanticColors.golden[600];
			case InputValidationType.ERROR:
				return semanticColors.punch[500];
			case InputValidationType.SUCCESS:
				return semanticColors.jade[500];
			default:
				return neutralColors.gray[300];
		}
	}}; ;
`;

function areEqual(prevProps: IInput, nextProps: IInput) {
	return prevProps.value === nextProps.value;
}

export default memo(Input, areEqual);
