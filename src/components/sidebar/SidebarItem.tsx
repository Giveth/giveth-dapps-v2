import {
	brandColors,
	GLink,
	IconChevronDown24,
	neutralColors,
} from '@giveth/ui-design-system';
import { ReactNode, FC, useState } from 'react';
import styled from 'styled-components';
import { ETheme } from '@/features/general/general.slice';
import { Flex } from '../styled-components/Flex';
import { useAppSelector } from '@/features/hooks';

interface ISidebarItem {
	title: string;
	href?: string;
	subItems?: ISidebarItemProps[];
}

interface ISidebarItemProps {
	item: ISidebarItem;
	children: ReactNode;
}

export const SidebarParentItem: FC<ISidebarItemProps> = ({
	item,
	children,
}) => {
	const [showChildren, setShowChildren] = useState(false);
	const theme = useAppSelector(state => state.general.theme);

	return (
		<Flex flexDirection='column'>
			<ItemWrapper
				justifyContent='space-between'
				onClick={() => setShowChildren(s => !s)}
			>
				<GLink size='Big'>{item.title}</GLink>
				{children && <IconChevronDown24 />}
			</ItemWrapper>
			{showChildren && children && (
				<ChildrenWrapper theme={theme}>{children}</ChildrenWrapper>
			)}
		</Flex>
	);
};

const ItemWrapper = styled(Flex)`
	cursor: pointer;
	padding: 12px 16px;
`;

const ChildrenWrapper = styled.div`
	padding: 12px 0;
	border-bottom: 1px solid
		${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[500]
				: neutralColors.gray[400]};
`;
