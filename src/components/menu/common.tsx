import { brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { ETheme } from '@/features/general/general.slice';

export const HighlightSection = styled.div`
	padding: 16px;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[500]
			: neutralColors.gray[600]};
	border-radius: 16px;
`;

export const NormalSection = styled.div`
	margin-top: 16px;
	padding: 8px 16px;
	border-radius: 16px;
`;
