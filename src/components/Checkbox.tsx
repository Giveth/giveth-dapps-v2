import { P, neutralColors } from '@giveth/ui-design-system';
import { useDeviceDetect } from '@/utils';
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
	const { isMobile } = useDeviceDetect();
	return (
		<Wrapper
			onClick={() => onChange(!checked)}
			checked={checked}
			style={style}
		>
			{checked ? (
				<img src='/images/checkmark-2.svg' alt='checkmark' />
			) : (
				<span />
			)}
			<TitleBox>
				<P>{title}</P>
			</TitleBox>
		</Wrapper>
	);
};

const Wrapper = styled.div<ICheckBox>`
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 12px;
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
		width: 28px;
	}
	span {
		width: 28px;
		height: 28px;
		border-radius: 4px;
		border: 2px solid ${neutralColors.gray[400]};
	}
`;

const TitleBox = styled.div`
	padding-bottom: 15px;
`;

export default CheckBox;
