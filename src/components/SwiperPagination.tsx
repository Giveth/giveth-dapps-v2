import {
	H5,
	IconPointerLeft,
	IconPointerRight,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Swiper as SwiperType } from 'swiper/types';
import { ArrayFrom0ToN } from '@/lib/helpers';
import { Flex } from './styled-components/Flex';
import { Shadow } from './styled-components/Shadow';

export interface ISwiperPaginationItem {
	label: string;
	page: number;
}

interface ISwiperPagination {
	swiper?: SwiperType;
	items?: ISwiperPaginationItem[];
	itemsCount?: number;
	hasPrevButton?: boolean;
	hasNextButton?: boolean;
	className?: string;
}

export const SwiperPagination: FC<ISwiperPagination> = ({
	swiper,
	items,
	itemsCount,
	hasPrevButton = true,
	hasNextButton = true,
	className,
}) => {
	const _items = items ? items : ArrayFrom0ToN(itemsCount || 1);
	const [realIndex, setRealIndex] = useState(_items[0].page || _items[0]);
	useEffect(() => {
		function realIndexChangeHandler(_swiper: SwiperType) {
			setRealIndex(_swiper.realIndex);
		}
		swiper && swiper.on('realIndexChange', realIndexChangeHandler);
		return () => {
			swiper && swiper.off('realIndexChange', realIndexChangeHandler);
		};
	}, [swiper]);

	return (
		<PaginationContainer className={className}>
			{hasPrevButton && (
				<Navigation
					onClick={() => swiper?.slidePrev()}
					disabled={realIndex === 0}
				>
					<IconPointerLeft size={24} />
				</Navigation>
			)}
			{_items.map((item, idx) => (
				<PaginationItem
					isActive={
						item.page ? realIndex === item.page : realIndex === item
					}
					key={idx}
					onClick={() => swiper?.slideTo(item.page || item)}
				>
					{item.label || item + 1}
				</PaginationItem>
			))}
			{hasNextButton && (
				<Navigation
					onClick={() => swiper?.slideNext()}
					disabled={realIndex === _items.length - 1}
				>
					<IconPointerRight size={24} />
				</Navigation>
			)}
		</PaginationContainer>
	);
};

const PaginationContainer = styled(Flex)`
	gap: 24px;
	align-items: center;
`;

const Navigation = styled.div<{ disabled: boolean }>`
	cursor: pointer;
	border-radius: 48px;
	box-shadow: ${Shadow.Giv[400]};
	padding: 8px 13px;
	${props =>
		props.disabled
			? css`
					opacity: 0.4;
					cursor: default;
			  `
			: ''}
`;

export const PaginationItem = styled(H5)<{ isActive: boolean }>`
	border-radius: 50%;
	cursor: pointer;
	user-select: none;
	color: ${({ isActive }) =>
		isActive ? neutralColors.gray[900] : neutralColors.gray[700]};
	font-weight: ${({ isActive }) => (isActive ? 700 : 500)};
`;
