import {
	brandColors,
	Caption,
	IconAlertCricle,
	IconAlertTriangle,
	IconCheckmarkCircle,
	IconHelp,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';

export enum EToastType {
	Error = 'error',
	Warning = 'warning',
	Success = 'success',
	Info = 'info',
	Hint = 'hint',
}

interface IProps {
	message: string | JSX.Element;
	type: EToastType;
	isHidden?: boolean;
	link?: string;
	noIcon?: boolean;
}

interface IColorType {
	color?: string;
	backgroundColor?: string;
	icon?: JSX.Element;
}

const InlineToast: FC<IProps> = props => {
	const { message, type, isHidden, noIcon, link } = props;
	const colorType: IColorType = {};
	if (type === EToastType.Error) {
		colorType.color = semanticColors.punch[700];
		colorType.backgroundColor = semanticColors.punch[100];
		colorType.icon = <IconAlertTriangle />;
	} else if (type === EToastType.Warning) {
		colorType.color = semanticColors.golden[700];
		colorType.backgroundColor = semanticColors.golden[200];
		colorType.icon = <IconAlertTriangle />;
	} else if (type === EToastType.Info) {
		colorType.color = semanticColors.blueSky[700];
		colorType.backgroundColor = semanticColors.blueSky[100];
		colorType.icon = <IconAlertCricle size={19} />;
	} else if (type === EToastType.Hint) {
		colorType.color = brandColors.giv[300];
		colorType.backgroundColor = brandColors.giv[50];
		colorType.icon = <IconHelp />;
	} else {
		// Success
		colorType.color = semanticColors.jade[700];
		colorType.backgroundColor = semanticColors.jade[100];
		colorType.icon = <IconCheckmarkCircle />;
	}

	return (
		<Container
			className={isHidden ? 'fadeOut' : 'fadeIn'}
			colorType={colorType}
		>
			{!noIcon && colorType.icon}
			<Caption>{message}</Caption>
			{link && (
				<ExternalLink color={colorType.color} href={link}>
					<Caption medium>Learn more</Caption>
				</ExternalLink>
			)}
		</Container>
	);
};

const Container = styled.div<{ colorType: IColorType }>`
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 16px;
	background: ${({ colorType }) => colorType.backgroundColor};
	border-radius: 8px;
	border: 1px solid ${({ colorType }) => colorType.color};
	margin: 24px 0;
	max-width: 750px;
	color: ${({ colorType }) => colorType.color};
	word-break: break-word;
	> svg:first-child,
	a {
		flex-shrink: 0;
	}
	a {
		font-weight: 500;
	}
`;

export default InlineToast;
