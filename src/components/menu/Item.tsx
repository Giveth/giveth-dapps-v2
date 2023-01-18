import React, { FC, ReactNode } from 'react';
import { useItemsContext } from '@/context/Items.context';
import { ItemContainer } from './common';
import { ETheme } from '@/features/general/general.slice';

interface IItem {
	theme: ETheme;
	isHighlighted?: boolean;
	onClick?: Function;
	children: ReactNode;
}

export const Item: FC<IItem> = ({
	isHighlighted,
	theme,
	onClick,
	children,
}) => {
	const { close } = useItemsContext();
	return (
		<ItemContainer
			isHighlighted={isHighlighted}
			theme={theme}
			onClick={() => {
				close();
				onClick && onClick();
			}}
		>
			{children}
		</ItemContainer>
	);
};
