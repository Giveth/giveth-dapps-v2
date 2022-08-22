import {
	brandColors,
	IconCheck,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FlexCenter } from '@/components/styled-components/Flex';

const CheckBox = (props: {
	onChange: (e: boolean) => void;
	title: string;
	checked?: boolean;
	disabled?: boolean;
}) => {
	const { onChange, checked, title, disabled } = props;
	return (
		<Wrapper
			onClick={() => !disabled && onChange(!checked)}
			disabled={disabled}
			checked={checked}
		>
			<FlexCenter>
				{checked && <IconCheck size={24} color='white' />}
			</FlexCenter>
			<P>{title}</P>
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
