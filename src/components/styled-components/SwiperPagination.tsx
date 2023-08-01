import { H5, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from './Flex';
import { Shadow } from './Shadow';

export const PaginationWrapper = styled(H5)`
	display: flex;
	align-items: center;
	overflow-x: scroll;
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
	height: 40px;
	width: 50px;
	margin-right: 8px;
	margin-left: 8px;
	user-select: none;
`;

export const SwiperPaginationWrapper = styled(Flex)`
	padding: 16px;
	position: relative;
	width: 100%;
	${mediaQueries.tablet} {
		width: unset;
	}
`;
