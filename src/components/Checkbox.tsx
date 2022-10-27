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
	size?: 14 | 16 | 18 | 20 | 24 | 32;
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
			<GLink as='span' size={labelSize}>
				{label}
			</GLink>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)<{
	size: number;
	disabled?: boolean;
	checked?: boolean;
}>`
	cursor: pointer;
	user-select: none;
	color: ${props =>
		props.disabled ? neutralColors.gray[600] : neutralColors.gray[800]};
	> div:first-child {
		border: 2px solid
			${props =>
				props.disabled
					? neutralColors.gray[400]
					: neutralColors.gray[900]};
		flex-shrink: 0;
		border-radius: 4px;
		width: ${props => `${props.size}px`};
		height: ${props => `${props.size}px`};
		background-color: ${props =>
			props.checked ? brandColors.deep[900] : 'transparent'};
		transition: background-color 0.3s ease;
	}
	${props => {
		switch (props.size) {
			case 14:
				return css`
					gap: 10px;
					> div:first-child {
						border-width: 1px;
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
					}
				`;
			case 20:
				return css`
					gap: 10px;
					> div:first-child {
						border-width: 2px;
					}
				`;
			case 24:
				return css`
					gap: 12px;
					> div:first-child {
						border-width: 2px;
					}
				`;
			case 32:
				return css`
					gap: 12px;
					> div:first-child {
						border-width: 2px;
					}
				`;
			default:
				break;
		}
	}};
`;

export default CheckBox;
