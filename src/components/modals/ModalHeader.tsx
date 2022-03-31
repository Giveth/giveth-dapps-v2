import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { H6, IconX } from '@giveth/ui-design-system';

export type ModalHeaderTitlePosition = 'center' | 'left';

export interface IModalHeader {
	hiddenClose?: boolean;
	title?: string;
	icon?: ReactNode;
	closeModal?: () => void;
	position?: ModalHeaderTitlePosition;
}

export const ModalHeader: React.FC<IModalHeader> = ({
	hiddenClose = false,
	title = '',
	icon,
	closeModal = () => {},
	position = 'center',
}) => {
	return (
		<ModalHeaderRow
			justifyContent={position === 'center' ? 'center' : 'flex-start'}
		>
			{icon}
			<H6 weight={700}>{title}</H6>
			{!hiddenClose && (
				<CloseModalButton onClick={closeModal}>
					<IconX size={24} />
				</CloseModalButton>
			)}
		</ModalHeaderRow>
	);
};

export const ModalHeaderRow = styled(Flex)`
	gap: 14px;
	min-height: 48px;
	padding: 24px 24px 8px;
	position: relative;
	align-items: center;
`;

const CloseModalButton = styled.div`
	position: absolute;
	top: 16px;
	right: 16px;
	cursor: pointer;
`;
