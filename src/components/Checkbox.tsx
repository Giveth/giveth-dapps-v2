import {
	brandColors,
	GLink,
	IconCheck,
	neutralColors,
} from '@giveth/ui-design-system';
import styled, { css } from 'styled-components';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import type { FC } from 'react';

interface ICheckBox {
	onChange: (e: boolean) => void;
	label: string;
	checked?: boolean;
	disabled?: boolean;
	size?: 12 | 14 | 16 | 18 | 20 | 24 | 32;
	labelSize?: 'Tiny' | 'Small' | 'Medium' | 'Big';
}

const CheckBox: FC<ICheckBox> = ({
	onChange,
	checked,
	label,
	disabled,
	size = 24,
	labelSize = 'Big',
}) => {
	return (
		<Wrapper
			onClick={() => !disabled && onChange(!checked)}
			disabled={disabled}
			checked={checked}
			size={size}
			alignItems='center'
		>
			<FlexCenter>
				{checked && <IconCheck size={size} color='white' />}
			</FlexCenter>
			<GLink size={labelSize}>{label}</GLink>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)<{
	size: number;
	disabled?: boolean;
	checked?: boolean;
}>`
	cursor: ${props => (props.disabled ? '' : 'pointer')};
	user-select: none;
	color: ${props =>
		props.disabled ? neutralColors.gray[600] : neutralColors.gray[800]};
	> div:first-child {
		border-color: ${props =>
			props.disabled ? neutralColors.gray[400] : neutralColors.gray[900]};
		border-style: solid;
		flex-shrink: 0;
		width: ${props => `${props.size}px`};
		height: ${props => `${props.size}px`};
		background-color: ${props =>
			props.disabled && props.checked
				? neutralColors.gray[400]
				: props.checked
				? brandColors.deep[900]
				: 'transparent'};
		transition: background-color 0.3s ease;
	}
	${props => {
		switch (props.size) {
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
