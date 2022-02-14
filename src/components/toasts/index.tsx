import {
	brandColors,
	Caption,
	IconAlertCricle,
	IconCheckmarkCircle,
	semanticColors,
	ButtonText,
} from '@giveth/ui-design-system';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { Row } from '../styled-components/Grid';

export enum ToastType {
	INFO_PRIMARY,
	INFO_SECONDARY,
	SUCCESS,
	HINT,
	WARNING,
	DANGER,
}

export enum ToastDirection {
	LEFT,
	RIGHT,
}

export interface IToast {
	type?: ToastType;
	actionLabel?: string;
	actionCB?: any;
	title?: string;
	direction?: ToastDirection;
	dismissLabel?: string;
	dismissCB?: any;
}

const toastIcon = (type: ToastType) => {
	switch (type) {
		case ToastType.INFO_PRIMARY:
			return <IconAlertCricle size={16} />;
		case ToastType.INFO_SECONDARY:
			return <IconAlertCricle size={16} />;
		case ToastType.SUCCESS:
			return <IconCheckmarkCircle size={16} />;
		case ToastType.HINT:
			return <IconAlertCricle size={16} />;
		case ToastType.WARNING:
			return <IconAlertCricle size={16} />;
		case ToastType.DANGER:
			return <IconAlertCricle size={16} />;
		default:
			return <IconAlertCricle size={16} />;
	}
};

export const gToast = (message: string, options: IToast) => {
	const {
		type = ToastType.INFO_PRIMARY,
		direction = ToastDirection.LEFT,
		title,
		dismissLabel,
	} = options;
	return toast.custom(
		<ToastContainer {...options}>
			{direction === ToastDirection.LEFT && (
				<LeftIconContainer>{toastIcon(type)}</LeftIconContainer>
			)}
			<Content>
				{title && <Caption medium>{title}</Caption>}
				<Caption>{message}</Caption>
			</Content>
			<Spacer />
			{dismissLabel && (
				<DismissButton size='small'>{dismissLabel}</DismissButton>
			)}
			{direction === ToastDirection.RIGHT && (
				<IconContainer>{toastIcon(type)}</IconContainer>
			)}
		</ToastContainer>,
		{
			duration: 400000,
		},
	);
};

const ToastContainer = styled(Row)<IToast>`
	min-width: 580px;
	padding: 16px;
	gap: 16px;
	align-items: center;
	color: ${props => {
		switch (props.type) {
			case ToastType.INFO_PRIMARY:
			case ToastType.INFO_SECONDARY:
				return semanticColors.blueSky[700];
			case ToastType.SUCCESS:
				return semanticColors.jade[700];
			case ToastType.HINT:
				return brandColors.giv[300];
			case ToastType.WARNING:
				return semanticColors.golden[700];
			case ToastType.DANGER:
				return semanticColors.punch[700];
			default:
				break;
		}
	}};
	background-color: ${props => {
		switch (props.type) {
			case ToastType.INFO_PRIMARY:
				return semanticColors.blueSky[100];
			case ToastType.INFO_SECONDARY:
				return 'unset';
			case ToastType.SUCCESS:
				return semanticColors.jade[100];
			case ToastType.HINT:
				return '#F6F3FF';
			case ToastType.WARNING:
				return semanticColors.golden[100];
			case ToastType.DANGER:
				return semanticColors.punch[100];
			default:
				break;
		}
	}};
	border: 1px solid;
	border-color: ${props => {
		switch (props.type) {
			case ToastType.INFO_PRIMARY:
				return semanticColors.blueSky[700];
			case ToastType.INFO_SECONDARY:
				return `${semanticColors.blueSky[700]}00`;
			case ToastType.SUCCESS:
				return semanticColors.jade[700];
			case ToastType.HINT:
				return brandColors.giv[300];
			case ToastType.WARNING:
				return semanticColors.golden[700];
			case ToastType.DANGER:
				return semanticColors.punch[700];
			default:
				break;
		}
	}};
	border-radius: 8px;
`;

const IconContainer = styled.div``;

const LeftIconContainer = styled.div`
	align-self: flex-start;
	padding-top: 2px;
`;

const Content = styled.div`
	// padding: 0 16px;
`;

const Spacer = styled.div`
	flex: 1;
`;

const DismissButton = styled(ButtonText)``;
