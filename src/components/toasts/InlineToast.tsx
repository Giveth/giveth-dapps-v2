import {
	Caption,
	IconAlertTriangle,
	IconCheckmarkCircle,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';

export enum EToastType {
	Error = 'error',
	Warning = 'warning',
	Success = 'success',
}

interface IProps {
	message: string;
	type: EToastType;
	isHidden?: boolean;
}

const InlineToast: FC<IProps> = ({ message, type, isHidden }) => {
	const colorType: keyof typeof semanticColors =
		type === EToastType.Error
			? 'punch'
			: type === EToastType.Warning
			? 'golden'
			: 'jade';

	return (
		<Container
			className={isHidden ? 'fadeOut' : 'fadeIn'}
			colorType={colorType}
		>
			{type === EToastType.Success ? (
				<IconCheckmarkCircle />
			) : (
				<IconAlertTriangle />
			)}
			<Caption>{message}</Caption>
		</Container>
	);
};

const Container = styled.div<{ colorType: keyof typeof semanticColors }>`
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 16px;
	background: ${({ colorType }) =>
		semanticColors[colorType][colorType === 'golden' ? 200 : 100]};
	border-radius: 8px;
	border: 1px solid ${({ colorType }) => semanticColors[colorType][700]};
	margin: 24px 0;
	max-width: 750px;
	color: ${({ colorType }) => semanticColors[colorType][700]};
	word-break: break-word;
	> *:first-child {
		flex-shrink: 0;
	}
`;

export default InlineToast;
