import {
	Subline,
	brandColors,
	neutralColors,
	GLink,
	semanticColors,
} from '@giveth/ui-design-system';
import { ChangeEvent, FC, HTMLInputTypeAttribute, useState } from 'react';
import styled from 'styled-components';

enum InputValidationType {
	NORMAL,
	WARNING,
	ERROR,
	SUCCESS,
}

interface IInput {
	value: string;
	onChange: any;
	pattern?: RegExp;
	type: HTMLInputTypeAttribute;
	name: string;
	placeholder: string;
}

const Input: FC<IInput> = ({
	name,
	value,
	onChange,
	type,
	pattern,
	placeholder,
}) => {
	const [validation, setValidation] = useState<InputValidationType>(
		InputValidationType.NORMAL,
	);
	const ChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		onChange(e);
		if (pattern) {
			const test = pattern.test(value);
			if (!test) {
				setValidation(InputValidationType.ERROR);
			} else {
				setValidation(InputValidationType.NORMAL);
			}
		}
	};

	console.log(validation);

	return (
		<InputContainer>
			<InputLabel>WEBSITE OR URL (OPTIONAL)</InputLabel>
			<InputField
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={ChangeHandle}
				type={type}
				validation={validation}
			/>
			<InputDesc size='Small'>
				Your home page, blog, or company site.
			</InputDesc>
		</InputContainer>
	);
};

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled(Subline)`
	padding-bottom: 4px;
	color: ${brandColors.deep[500]};
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
`;

export default Input;
