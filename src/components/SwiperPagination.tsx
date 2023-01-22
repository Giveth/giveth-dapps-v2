import {
	H5,
	IconPointerLeft,
	IconPointerRight,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Swiper as SwiperType } from 'swiper/types';
import { Flex } from './styled-components/Flex';
import { Shadow } from './styled-components/Shadow';

export interface ISwiperPaginationItem {
	label: string;
	page: number;
}

interface ISwiperPagination {
	swiper?: SwiperType;
	items: ISwiperPaginationItem[];
	hasPrevButton?: boolean;
	hasNextButton?: boolean;
}

export const SwiperPagination: FC<ISwiperPagination> = ({ swiper, items }) => {
	const [realIndex, setRealIndex] = useState(items[0].page);
	useEffect(() => {
		function realIndexChangeHandler(_swiper: SwiperType) {
			console.log('realIndexChange', _swiper.realIndex);
			setRealIndex(_swiper.realIndex);
		}
		swiper && swiper.on('realIndexChange', realIndexChangeHandler);
		return () => {
			swiper && swiper.off('realIndexChange', realIndexChangeHandler);
		};
	}, [swiper]);

	return (
		<PaginationContainer>
			<Navigation id='homeCampaignPrev'>
				<IconPointerLeft size={24} />
			</Navigation>
			{items.map((item, idx) => (
				<PaginationItem
					isActive={realIndex === item.page}
					key={idx}
					onClick={() => swiper?.slideTo(item.page)}
				>
					{item.label}
				</PaginationItem>
			))}
			<Navigation id='homeCampaignNext'>
				<IconPointerRight size={24} />
			</Navigation>
		</PaginationContainer>
	);
};

const PaginationContainer = styled(Flex)`
	gap: 24px;
	align-items: center;
`;

const Navigation = styled.div`
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
