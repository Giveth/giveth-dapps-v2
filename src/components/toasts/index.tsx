import {
	brandColors,
	Caption,
	IconAlertCircle16,
	semanticColors,
	ButtonText,
	IconCheckCircleFilled16,
} from '@giveth/ui-design-system';
import toast, { ToastPosition } from 'react-hot-toast';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '../styled-components/Flex';

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
	title?: string;
	direction?: ToastDirection;
	dismissLabel?: string;
	dismissCB?: any;
	position?: ToastPosition;
	duration?: number;
}

const toastIcon = (type: ToastType) => {
	switch (type) {
		case ToastType.INFO_PRIMARY:
			return <IconAlertCircle16 />;
		case ToastType.INFO_SECONDARY:
			return <IconAlertCircle16 />;
		case ToastType.SUCCESS:
			return <IconCheckCircleFilled16 />;
		case ToastType.HINT:
			return <IconAlertCircle16 />;
		case ToastType.WARNING:
			return <IconAlertCircle16 />;
		case ToastType.DANGER:
			return <IconAlertCircle16 />;
		default:
			return <IconAlertCircle16 />;
	}
};

export const gToast = (message: string, options: IToast) => {
	const {
		type = ToastType.INFO_PRIMARY,
		direction = ToastDirection.LEFT,
		title,
		dismissLabel,
		dismissCB,
		position = 'bottom-center',
		duration,
	} = options;
	const toastID = toast.custom(
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
				<DismissButton
					size='small'
					onClick={() => {
						if (dismissCB) {
							dismissCB();
						}
						toast.remove(toastID);
					}}
				>
					{dismissLabel}
				</DismissButton>
			)}
			{direction === ToastDirection.RIGHT && (
				<IconContainer>{toastIcon(type)}</IconContainer>
			)}
		</ToastContainer>,
		{
			duration,
			position,
		},
	);
};

const ToastContainer = styled(Flex)<IToast>`
	min-width: 250px;
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
	border: 1px solid
		${props => {
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
	${mediaQueries.laptopS} {
		min-width: 580px;
	}
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

const DismissButton = styled(ButtonText)`
	cursor: pointer;
`;
