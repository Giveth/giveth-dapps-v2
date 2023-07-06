import {
	B,
	brandColors,
	GLink,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ETheme } from '@/features/general/general.slice';
import { Shadow } from '../styled-components/Shadow';
import { Flex } from '../styled-components/Flex';

export const BaseMenuContainer = styled.div`
	padding: 16px;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[600]
			: neutralColors.gray[100]};
	border-radius: 16px;
	box-shadow: ${Shadow.Dark[500]};
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: neutralColors.gray[900]};
`;

export const HighlightSection = styled.div`
	padding: 16px 8px;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[500]
			: neutralColors.gray[200]};
	border-radius: 16px;
`;

interface IItemTitle {
	upperCase?: boolean;
}

export const ItemTitle = styled(Overline)<IItemTitle>`
	color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[300]
			: neutralColors.gray[800]};
	text-transform: ${props => (props.upperCase ? 'uppercase' : 'none')};
`;

export const ItemRow = styled(Flex)`
	justify-content: space-between;
	align-items: center;
`;

export const NetworkName = styled(B)`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	width: 90px;
`;

export const ItemAction = styled(GLink)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export const ItemSpacer = styled.div`
	border-bottom: 1px solid;
	border-color: ${neutralColors.gray[300]};
`;
