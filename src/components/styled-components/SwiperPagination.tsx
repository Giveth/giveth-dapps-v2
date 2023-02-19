import { H5, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Shadow } from './Shadow';

export const PaginationWrapper = styled(H5)`
	display: flex;
	align-items: center;
`;

export const NavigationWrapper = styled.div<{ disabled?: boolean }>`
	cursor: pointer;
	border-radius: 48px;
	box-shadow: ${Shadow.Giv[400]};
	padding: 8px 13px;
	&.swiper-button-disabled {
		opacity: 0.4;
		cursor: default;
	}
`;

export const PaginationItem = styled(H5)<{ isActive: boolean }>`
	border-radius: 50%;
	cursor: pointer;
	user-select: none;
	color: ${({ isActive }) =>
		isActive ? neutralColors.gray[900] : neutralColors.gray[700]};
	font-weight: ${({ isActive }) => (isActive ? 700 : 500)};
`;
