import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
	P,
	SublineBold,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Navigation } from 'swiper';
import { useProjectContext } from '@/context/project.context';
import 'swiper/css';
import 'swiper/css/navigation';
import { Flex } from '@/components/styled-components/Flex';

export const QfRoundSelector = () => {
	const { projectData } = useProjectContext();

	console.log('projectData', projectData?.qfRounds);

	return (
		<Swiper
			modules={[Navigation]}
			navigation={{
				nextEl: '#nextIcon',
				prevEl: '#prevIcon',
			}}
			slidesPerView='auto'
			spaceBetween={21}
		>
			{projectData?.qfRounds?.map((round, index) => (
				<SwiperSlide key={index} style={{ width: 'auto' }}>
					<TabItem alignItems='center' gap='4px'>
						<P>{round.id}</P>
						{round.isActive && <OpenLabel>Open</OpenLabel>}
					</TabItem>
				</SwiperSlide>
			))}
		</Swiper>
	);
};

interface ITabItemProps {
	isSelected?: boolean;
}

const TabItem = styled(Flex)<ITabItemProps>`
	padding: 8px 16px;
	border-radius: 50px;
	width: fit-content;
	cursor: pointer;
	transition: background-color 300ms ease;
	&:hover {
		background: ${neutralColors.gray[300]};
	}
`;

const OpenLabel = styled(SublineBold)`
	padding: 2px 8px;
	background: ${semanticColors.jade[500]};
	color: ${neutralColors.gray[100]};
	border-radius: 40px;
`;
