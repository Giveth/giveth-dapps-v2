import { P, brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

interface ICheckBox {
	checked?: boolean | undefined;
}

const CheckBox = (props: {
	onChange: (e: any) => void;
	value?: any;
	title: string;
	checked: boolean | undefined;
	style?: any;
}) => {
	const { onChange, checked, title, style } = props;
	const isChecked = checked;
	return (
		<Wrapper onClick={onChange} checked={isChecked} style={style}>
			<Box checked={isChecked} />
			{checked ? <img src='/images/checkmark-2.svg' /> : <span />}
			<P>{title}</P>
		</Wrapper>
	);
};

const Wrapper = styled.div<ICheckBox>`
	cursor: pointer;
	display: flex;
	flex-direction: row;
	align-items: center;
	color: ${(props: any) =>
		props.checked ? neutralColors.gray[900] : neutralColors.gray[700]};
	img {
		border: 2px solid
			${(props: any) =>
				props.checked
					? neutralColors.gray[900]
					: neutralColors.gray[400]};
		border-radius: 4px;
		padding: 8px 8px 8px 6.67px;
		margin: 0 12px 0 0;
	}
	span {
		width: 28px;
		height: 28px;
		border-radius: 4px;
		margin: 0 12px 0 0;
		border: 2px solid ${neutralColors.gray[400]};
	}
`;

const Box = styled.div<ICheckBox>`
	display: flex;
	width: 4px;
	height: 4px;
	justify-content: center;
	align-items: center;
`;

export default CheckBox;
