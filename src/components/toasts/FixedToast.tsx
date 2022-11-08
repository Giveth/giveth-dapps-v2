import React from 'react';
import {
	Caption,
	IconCheckCircleFilled,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';

export enum EToastType {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info',
}

interface IFToast {
	message: string | JSX.Element;
	href?: string;
	color?: string;
	boldColor?: string;
	backgroundColor?: string;
	icon?: JSX.Element;
	type?: EToastType;
}

interface IToastContainer {
	borderColor: string;
}

const FixedToast = (props: IFToast) => {
	let { message, icon, color, backgroundColor, boldColor, href, type } =
		props;

	if (type === EToastType.SUCCESS) {
		color = semanticColors.jade[700];
		backgroundColor = semanticColors.jade[100];
		icon = <IconCheckCircleFilled color={semanticColors.jade[700]} />;
	}

	return (
		<Container color={backgroundColor} borderColor={color!}>
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

const Container = styled.div<{ color?: string; borderColor: string }>`
	display: flex;
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

const Text = styled(Caption)`
	color: ${props => props.color};
	line-height: 150%;
	> a {
		font-weight: 700;
	}
`;

const Icon = styled.div`
	padding: 5px 15px 0 0;
`;

export default FixedToast;
