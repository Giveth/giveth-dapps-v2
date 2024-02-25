import { brandColors, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@giveth/ui-design-system';
import { ETheme } from '@/features/general/general.slice';
import { Shadow } from '../styled-components/Shadow';

interface IMenuContainerProps {
	isAnimating?: boolean;
	$baseTheme?: ETheme;
}

export const MenuContainer = styled(Flex)<IMenuContainerProps>`
	position: absolute;
	flex-direction: column;
	gap: 8px;
	top: 40%;
	right: 0;
	width: 276px;
	background-color: ${props =>
		props.$baseTheme === ETheme.Dark ? brandColors.giv[600] : 'white'};
	border: 1px solid
		${props =>
			props.$baseTheme === ETheme.Dark ? brandColors.giv[600] : 'white'};
	border-radius: 10px 0 10px 10px;
	padding: 24px 16px 16px;
	z-index: 0;
	box-shadow: ${props =>
		props.$baseTheme === ETheme.Dark
			? Shadow.Dark[500]
			: Shadow.Neutral[500]};
	overflow-y: overlay;
	color: ${props =>
		props.$baseTheme === ETheme.Dark
			? neutralColors.gray[100]
			: neutralColors.gray[900]};
	opacity: ${props => (props.isAnimating ? 1 : 0)};
	transition: opacity 0.3s ease;
`;

export const NotificationMenuWrapper = styled.div`
	position: relative;
	max-height: 85vh;
`;
