import React from 'react';
import { B } from '@giveth/ui-design-system';
import styled from 'styled-components';

interface IFToast {
	message: string;
	href?: string;
	color: string;
	boldColor?: string;
	backgroundColor: string;
	icon?: any;
}

interface IToastContainer {
	borderColor: string;
}

const FixedToast = (props: IFToast) => {
	const { message, icon, color, backgroundColor, boldColor, href } = props;
	return (
		<Container color={backgroundColor} borderColor={color}>
			{icon && <Icon>{icon()}</Icon>}
			<Text color={color}>{message}</Text>
			{href && (
				<a href={href} target='_blank' rel='noreferrer'>
					<Text color={boldColor}>Learn More</Text>
				</a>
			)}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: row;
	background-color: ${props => props.color};
	padding: 13.5px 16px;
	border: 1px solid ${(props: IToastContainer) => props.borderColor};
	border-radius: 8px;
	align-items: center;
	a {
		cursor: pointer;
		font-weight: bold !important;
	}
	div:first-child {
		margin-right: 4px;
	}
`;

const Text = styled(B)`
	color: ${props => props.color};
	font-size: 14px;
	line-height: 150%;
`;

const Icon = styled.div`
	padding: 5px 5px 0 0;
`;

export default FixedToast;
