import { GLink, IconChevronDown24 } from '@giveth/ui-design-system';
import { ReactNode, FC, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '../styled-components/Flex';

interface ISidebarItem {
	title: string;
	href?: string;
	subItems?: ISidebarItemProps[];
}

interface ISidebarItemProps {
	item: ISidebarItem;
	children?: ReactNode;
}

export const SidebarItem: FC<ISidebarItemProps> = ({ item, children }) => {
	const [showChildren, setShowChildren] = useState(false);
	return (
		<ItemContainer
			flexDirection='column'
			onClick={() => setShowChildren(s => !s)}
		>
			<ItemWrapper justifyContent='space-between'>
				<GLink size='Big'>{item.title}</GLink>
				{children && <IconChevronDown24 />}
			</ItemWrapper>
			{showChildren && children && (
				<ChildrenWrapper>{children}</ChildrenWrapper>
			)}
		</ItemContainer>
	);
};

const ItemContainer = styled(Flex)`
	cursor: pointer;
`;

const ItemWrapper = styled(Flex)`
	padding: 12px 16px;
`;

const ChildrenWrapper = styled.div`
	padding: 12px 16px;
`;
