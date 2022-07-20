import {
	brandColors,
	IconCheck,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FlexCenter } from '@/components/styled-components/Flex';
import type { FC } from 'react';

interface ICheckBox {
	onChange: (e: boolean) => void;
	label: string;
	checked?: boolean;
	disabled?: boolean;
}

const CheckBox: FC<ICheckBox> = ({ onChange, checked, label, disabled }) => {
	return (
		<Wrapper
			onClick={() => !disabled && onChange(!checked)}
			disabled={disabled}
			checked={checked}
		>
			<FlexCenter>
				{checked && <IconCheck size={24} color='white' />}
			</FlexCenter>
			<div>{label}</div>
		</Wrapper>
	);
};

const Wrapper = styled.div<{ disabled?: boolean; checked?: boolean }>`
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 12px;
	color: ${props =>
		props.disabled ? neutralColors.gray[600] : neutralColors.gray[900]};
	> div:first-child {
		border: 2px solid
			${props =>
				props.disabled
					? neutralColors.gray[400]
					: neutralColors.gray[900]};
		border-radius: 4px;
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		background: ${props =>
			props.checked ? brandColors.deep[900] : 'white'};
	}
`;

export default CheckBox;
