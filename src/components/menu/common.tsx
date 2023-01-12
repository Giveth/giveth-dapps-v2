import { brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ETheme } from '@/features/general/general.slice';
import { Shadow } from '../styled-components/Shadow';

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
	padding: 16px;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[500]
			: neutralColors.gray[200]};
	border-radius: 16px;
`;
