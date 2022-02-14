import React from 'react';
import { B } from '@giveth/ui-design-system';
import styled from 'styled-components';

interface IFToast {
	message: string;
	href: string;
	color: any;
	backgroundColor: string;
}

interface IToastContainer {
	borderColor: string;
}

const FixedToast = (props: IFToast) => {
	const { message, color, backgroundColor, href } = props;
	return (
		<Container color={backgroundColor} borderColor={color}>
			<Text color={color}>{message}</Text>
			{href && (
				<a href={href} target='_blank' rel='noreferrer'>
					<Text color={color}>Learn More</Text>
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

export default FixedToast;
