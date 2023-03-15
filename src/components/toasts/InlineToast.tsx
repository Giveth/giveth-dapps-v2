import {
	brandColors,
	Caption,
	IconAlertCircle,
	IconAlertTriangleFilled,
	IconCheckCircleFilled,
	IconHelpFilled16,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import ExternalLink from '@/components/ExternalLink';
import { FlexCenter } from '@/components/styled-components/Flex';

export enum EToastType {
	Error = 'error',
	Warning = 'warning',
	Success = 'success',
	Info = 'info',
	Hint = 'hint',
}

interface IProps {
	message: string | JSX.Element;
	title?: string;
	type: EToastType;
	isHidden?: boolean;
	link?: string;
	linkText?: string;
	noIcon?: boolean;
	className?: string;
}

interface IColorType {
	color?: string;
	backgroundColor?: string;
	icon?: JSX.Element;
}

const InlineToast: FC<IProps> = props => {
	const { message, title, type, isHidden, noIcon, link, linkText } = props;
	const { formatMessage } = useIntl();
	const colorType: IColorType = {};
	if (type === EToastType.Error) {
		colorType.color = semanticColors.punch[700];
		colorType.backgroundColor = semanticColors.punch[100];
		colorType.icon = <IconAlertTriangleFilled />;
	} else if (type === EToastType.Warning) {
		colorType.color = semanticColors.golden[700];
		colorType.backgroundColor = semanticColors.golden[200];
		colorType.icon = <IconAlertTriangleFilled />;
	} else if (type === EToastType.Info) {
		colorType.color = semanticColors.blueSky[700];
		colorType.backgroundColor = semanticColors.blueSky[100];
		colorType.icon = <IconAlertCircle size={19} />;
	} else if (type === EToastType.Hint) {
		colorType.color = brandColors.giv[300];
		colorType.backgroundColor = brandColors.giv[50];
		colorType.icon = <IconHelpFilled16 />;
	} else {
		// Success
		colorType.color = semanticColors.jade[700];
		colorType.backgroundColor = semanticColors.jade[100];
		colorType.icon = <IconCheckCircleFilled />;
	}

	return (
		<Container
			className={`${props.className} ${isHidden ? 'fadeOut' : 'fadeIn'}`}
			colorType={colorType}
		>
			{!noIcon && <IconContainer>{colorType.icon}</IconContainer>}
			<Text>
				<div>
					{title && <Title medium>{title}</Title>}
					<Caption>{message}</Caption>
				</div>
				{link && (
					<ExternalLink color={colorType.color} href={link}>
						<Caption medium>
							{linkText ||
								formatMessage({ id: 'label.learn_more' })}
						</Caption>
					</ExternalLink>
				)}
			</Text>
		</Container>
	);
};

const Title = styled(Caption)`
	margin-bottom: 4px;
`;

const IconContainer = styled(FlexCenter)`
	height: 21px;
`;

const Text = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	width: 100%;
`;

const Container = styled.div<{ colorType: IColorType }>`
	display: flex;
	gap: 16px;
	text-align: left;
	padding: 16px;
	background: ${({ colorType }) => colorType.backgroundColor};
	border-radius: 8px;
	border: 1px solid ${({ colorType }) => colorType.color};
	margin: 24px 0;
	color: ${({ colorType }) => colorType.color};
	word-break: break-word;
	> svg:first-child,
	a {
		flex-shrink: 0;
	}
`;

export default InlineToast;
