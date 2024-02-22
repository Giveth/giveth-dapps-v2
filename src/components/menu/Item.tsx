import React, { FC, ReactNode } from 'react';
import { brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useItemsContext } from '@/context/Items.context';
import { ETheme } from '@/features/general/general.slice';
import { Flex } from '../styled-components/Flex';

interface IItem {
	$baseTheme: ETheme;
	isHighlighted?: boolean;
	onClick?: Function;
	children: ReactNode;
	className?: string;
}

export const Item: FC<IItem> = ({
	isHighlighted,
	$baseTheme,
	onClick,
	children,
	className,
}) => {
	const { close } = useItemsContext();
	return (
		<ItemContainer
			isHighlighted={isHighlighted}
			$baseTheme={$baseTheme}
			onClick={() => {
				close();
				onClick && onClick();
			}}
			className={className}
		>
			{children}
		</ItemContainer>
	);
};

interface IItemContainer {
	isHighlighted?: boolean;
	$baseTheme: ETheme;
}

const ItemContainer = styled(Flex)<IItemContainer>`
	position: relative;
	padding: 12px 16px;
	gap: 6px;
	flex-direction: column;
	border-radius: 8px;
	background-color: ${props =>
		props.isHighlighted
			? props.$baseTheme === ETheme.Dark
				? brandColors.giv[500]
				: neutralColors.gray[200]
			: 'unset'};
	&:hover {
		background-color: ${props =>
			// props.isHighlighted
			// 	? props.$baseTheme=== ETheme.Dark
			// 		? brandColors.giv[700]
			// 		: neutralColors.gray[400]
			// 	:
			props.$baseTheme === ETheme.Dark
				? brandColors.giv[500]
				: neutralColors.gray[200]};
	}
	transition: background-color 0.3s ease;
	cursor: pointer;
`;
