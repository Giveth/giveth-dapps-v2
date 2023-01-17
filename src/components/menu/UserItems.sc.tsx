import styled from 'styled-components';
import {
	brandColors,
	neutralColors,
	Subline,
	P,
	Overline,
} from '@giveth/ui-design-system';
import { ETheme } from '@/features/general/general.slice';

export const MenuItem = styled.a`
	height: 45px;
	line-height: 45px;
	padding: 0 16px;
	font-size: 14px;
	cursor: pointer;
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: neutralColors.gray[800]};
	border-top: 2px solid
		${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[300]
				: neutralColors.gray[300]};
	&:hover {
		background-color: ${props =>
			props.theme === ETheme.Dark
				? brandColors.giv[700]
				: neutralColors.gray[200]};
	}
`;

export const Menus = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 15px;
	padding: 0 !important;
	/* border-bottom: 2px solid ${brandColors.giv[300]}; */
`;

export const StyledButton = styled(Subline)`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export const LeftSection = styled(P)`
	font-weight: 500;

	> span {
		font-size: 14px;
		font-weight: 400;
	}
`;

export const Subtitle = styled(Overline)`
	display: flex;
	justify-content: space-between;
	margin-bottom: 7px;
`;

export const Title = styled(Overline)`
	/* color: ${neutralColors.gray[800]}; */
	text-transform: uppercase;
	/* font-weight: 500; */
	margin-bottom: 2px;
`;
