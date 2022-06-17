import { IconCheck, neutralColors } from '@giveth/ui-design-system';
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
		>
			<FlexCenter>{checked && <IconCheck />}</FlexCenter>
			<div>{title}</div>
		</Wrapper>
	);
};

const Wrapper = styled.div<{ disabled?: boolean }>`
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
		width: 24px;
		height: 24px;
		flex-shrink: 0;
	}
`;

export default CheckBox;
