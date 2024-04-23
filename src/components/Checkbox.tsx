import {
	brandColors,
	Flex,
	FlexCenter,
	GLink,
	IconCheck,
	neutralColors,
} from '@giveth/ui-design-system';
import styled, { css } from 'styled-components';
import { ReactElement } from 'react';

interface ICheckBoxBase {
	onChange: (e: boolean) => void;
	checked?: boolean;
	disabled?: boolean;
	size?: 12 | 14 | 16 | 18 | 20 | 24 | 32;
}

interface ICheckBoxWithLabel extends ICheckBoxBase {
	label: string;
	labelSize?: 'Tiny' | 'Small' | 'Medium' | 'Big';
	children?: never;
}

interface ICheckBoxWithChildren extends ICheckBoxBase {
	children: ReactElement;
	label?: never;
}

type ICheckBox = ICheckBoxWithLabel | ICheckBoxWithChildren;

// CheckBox component
const CheckBox: React.FC<ICheckBox> = props => {
	const { onChange, checked = false, disabled = false, size = 16 } = props;
	const isLabelPresent = 'label' in props && typeof props.label === 'string';
	const labelSize = isLabelPresent ? props.labelSize || 'Medium' : undefined;

	return (
		<Wrapper
			onClick={() => !disabled && onChange(!checked)}
			$disabled={disabled}
			$checked={checked}
			$size={size}
			$alignItems='center'
		>
			<FlexCenter>
				{checked && <IconCheck size={size} color='white' />}
			</FlexCenter>
			{isLabelPresent ? (
				<GLink size={labelSize}>{props.label}</GLink>
			) : (
				props.children
			)}
		</Wrapper>
	);
};

const Wrapper = styled(Flex)<{
	$size: number;
	$disabled?: boolean;
	$checked?: boolean;
}>`
	cursor: ${props => (props.$disabled ? '' : 'pointer')};
	user-select: none;
	color: ${props =>
		props.$disabled ? neutralColors.gray[600] : neutralColors.gray[800]};
	> div:first-child {
		border-color: ${props =>
			props.$disabled
				? neutralColors.gray[400]
				: neutralColors.gray[900]};
		border-style: solid;
		flex-shrink: 0;
		width: ${props => `${props.$size}px`};
		height: ${props => `${props.$size}px`};
		background-color: ${props =>
			props.$disabled && props.$checked
				? neutralColors.gray[400]
				: props.$checked
					? brandColors.deep[900]
					: 'transparent'};
		transition: background-color 0.3s ease;
	}
	${props => {
		switch (props.$size) {
			case 12:
				return css`
					gap: 10px;
					> div:first-child {
						border-width: 1px;
						border-radius: 2px;
					}
					> span:last-child {
						font-size: 0.75rem;
					}
				`;
			case 14:
				return css`
					gap: 10px;
					> div:first-child {
						border-width: 1px;
						border-radius: 2px;
					}
				`;
			case 16:
				return css`
					gap: 10px;
					> div:first-child {
						border-width: 1px;
					}
				`;
			case 18:
				return css`
					gap: 18px;
					> div:first-child {
						border-width: 2px;
						border-radius: 3px;
					}
				`;
			case 20:
				return css`
					gap: 10px;
					> div:first-child {
						border-width: 2px;
						border-radius: 4px;
					}
				`;
			case 24:
				return css`
					gap: 12px;
					> div:first-child {
						border-width: 2px;
						border-radius: 4px;
					}
				`;
			case 32:
				return css`
					gap: 12px;
					> div:first-child {
						border-width: 2px;
						border-radius: 4px;
					}
				`;
			default:
				break;
		}
	}};
`;

export default CheckBox;
