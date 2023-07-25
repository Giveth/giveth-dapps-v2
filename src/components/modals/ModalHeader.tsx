import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { H6, IconChevronLeft32, IconX } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';

export type ModalHeaderTitlePosition = 'center' | 'left';

export interface IModalHeader {
	hiddenClose?: boolean;
	hiddenHeader?: boolean;
	title?: string;
	icon?: ReactNode;
	iconClick?: () => void;
	closeModal: () => void;
	position?: ModalHeaderTitlePosition;
	color?: string;
	backButtonCallback?: () => void;
}

export const ModalHeader: React.FC<IModalHeader> = ({
	hiddenClose = false,
	hiddenHeader = false,
	title = '',
	icon,
	backButtonCallback,
	closeModal,
	position = 'center',
	color,
}) => {
	return !hiddenHeader ? (
		<ModalHeaderRow
			justifyContent={position === 'center' ? 'center' : 'flex-start'}
			hasContent={!!icon || !!title}
			color={color}
		>
			{!!backButtonCallback ? (
				<IconWrapper
					onClick={backButtonCallback}
					clickable={!!backButtonCallback}
				>
					<IconChevronLeft32 />
				</IconWrapper>
			) : (
				icon && <IconWrapper>{icon}</IconWrapper>
			)}
			<H6 weight={700}>{title}</H6>
			{!hiddenClose && (
				<CloseModalButton onClick={closeModal}>
					<IconX size={24} />
				</CloseModalButton>
			)}
			{!hiddenClose && <CloseModalPlaceHolder />}
		</ModalHeaderRow>
	) : !hiddenClose ? (
		<CloseModalButton onClick={closeModal}>
			<IconX size={24} />
		</CloseModalButton>
	) : null;
};

export const ModalHeaderRow = styled(Flex)<{
	color?: string;
	hasContent: boolean;
}>`
	gap: 14px;
	min-height: ${props => (props.hasContent ? '48px' : '36px')};
	padding: 24px 24px 8px;
	position: relative;
	align-items: center;
	color: ${props => props.color || 'inherit'};
`;

const CloseModalButton = styled.div`
	position: absolute;
	right: 24px;
	cursor: pointer;
	z-index: 1;
`;

const CloseModalPlaceHolder = styled.div`
	width: 24px;
	height: 24px;
`;

interface IIconWrapper {
	clickable?: boolean;
}

const IconWrapper = styled.div<IIconWrapper>`
	height: 32px;
	${props => props.clickable && 'cursor: pointer;'}
`;
