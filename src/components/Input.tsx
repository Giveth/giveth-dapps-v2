import {
	Subline,
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

export interface IFormValidations {
	[key: string]: InputValidationType;
}

export enum InputValidationType {
	NORMAL,
	WARNING,
	ERROR,
	SUCCESS,
}

interface IInput {
	value: string;
	onChange: any;
	type?: HTMLInputTypeAttribute;
	name: string;
	placeholder: string;
	label?: string;
	required?: boolean;
	caption?: string;
	validators?: IInputValidator[];
	setFormValidation?: Dispatch<SetStateAction<IFormValidations | undefined>>;
}

interface IInputValidator {
	pattern: RegExp;
	msg: string;
}

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
	setFormValidation,
}) => {
	const [validation, setValidation] = useState<{
		status: InputValidationType;
		msg?: string;
	}>({
		status: InputValidationType.NORMAL,
		msg: undefined,
	});

	const ChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e);
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
			{label && <InputLabel required={required}>{label}</InputLabel>}
			<InputField
				placeholder={placeholder}
				name={name}
				// value={value}
				onChange={ChangeHandle}
				type={type}
				validation={validation.status}
			/>
			{validation.msg ? (
				<InputValidation validation={validation.status} size='Small'>
					{validation.msg}
				</InputValidation>
			) : (
				<InputDesc size='Small'>{caption || '\u200C'}</InputDesc> //hidden char
			)}
		</InputContainer>
	);
};

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled(Subline)<{ required?: boolean }>`
	padding-bottom: 4px;
	color: ${brandColors.deep[500]};
	::after {
		content: '*';
		display: ${props => (props.required ? 'inline-block' : 'none')};
		padding: 0 4px;
		color: ${semanticColors.punch[500]};
	}
`;

interface IInputField {
	validation: InputValidationType;
}

const InputField = styled.input<IInputField>`
	width: 100%;
	height: 56px;
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
	padding: 15px 16px;
	font-size: 16px;
	line-height: 150%;
	font-weight: 500;
	font-family: 'Red Hat Text';
	caret-color: ${brandColors.giv[300]};
	:focus {
		border: 2px solid
			${props => {
				switch (props.validation) {
					case InputValidationType.NORMAL:
						return neutralColors.gray[500];
					case InputValidationType.WARNING:
						return semanticColors.golden[700];
					case InputValidationType.ERROR:
						return semanticColors.punch[700];
					case InputValidationType.SUCCESS:
						return semanticColors.jade[700];
					default:
						return neutralColors.gray[500];
				}
			}};
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

const InputValidation = styled(GLink)<IInputField>`
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
