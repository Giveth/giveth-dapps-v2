import React from 'react';
import { B } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';

interface IFToast {
	message: string | JSX.Element;
	href?: string;
	color: string;
	boldColor?: string;
	backgroundColor: string;
	icon?: JSX.Element;
}

interface IToastContainer {
	borderColor: string;
}

const FixedToast = (props: IFToast) => {
	const { message, icon, color, backgroundColor, boldColor, href } = props;
	return (
		<Container color={backgroundColor} borderColor={color}>
			{icon && <Icon>{icon}</Icon>}
			<Text color={color}>{message}</Text>
			{href && (
				<ExternalLink href={href}>
					<Text color={boldColor}>Learn More</Text>
				</ExternalLink>
			)}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	background-color: ${props => props.color};
	padding: 13.5px 16px;
	border: 1px solid ${(props: IToastContainer) => props.borderColor};
	border-radius: 8px;
	> a {
		font-weight: bold !important;
		word-wrap: break-word;
		max-width: 110px;
		flex-shrink: 0;
		margin-left: 10px;
	}
`;

const Text = styled(B)`
	color: ${props => props.color};
	font-size: 14px;
	line-height: 150%;
	> a {
		font-weight: 700;
	}
`;

const Icon = styled.div`
	padding: 5px 5px 0 0;
`;

export default FixedToast;
