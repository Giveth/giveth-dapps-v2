import React, { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import { Navigation } from 'swiper';
import styled from 'styled-components';
import { H4, neutralColors } from '@giveth/ui-design-system';
import {
	ISwiperPaginationItem,
	SwiperPagination,
} from '@/components/SwiperPagination';
import { Flex } from '@/components/styled-components/Flex';
import { IProject } from '@/apollo/types/types';
import { Container, Row } from '@/components/Grid';
import { ProjectUpdateSlide } from './ProjectUpdateSlide';

const items: ISwiperPaginationItem[] = [
	{
		label: '1',
		page: 0,
	},
	{
		label: '2',
		page: 1,
	},
	{
		label: '3',
		page: 2,
	},
	{
		label: '4',
		page: 3,
	},
	{
		label: '5',
		page: 4,
	},
	{
		label: '6',
		page: 5,
	},
];

interface IProjectUpdatesBlockProps {
	projects: IProject[];
}

export const ProjectUpdatesBlock: FC<IProjectUpdatesBlockProps> = ({
	projects,
}) => {
	const [swiper, setSwiper] = useState<SwiperType>();

	return (
		<ProjectUpdatesBlockWrapper>
			<Container>
				<Header>
					<BlockTitle>Awesome Project Updates</BlockTitle>
					<SwiperPagination swiper={swiper} items={items} />
				</Header>
				<SwiperWrapper>
					<Swiper
						slidesPerView={1}
						onSwiper={setSwiper}
						modules={[Navigation]}
						navigation={{
							nextEl: '#homeCampaignNext',
							prevEl: '#homeCampaignPrev',
						}}
						spaceBetween={24}
					>
						{projects.map((project, idx) => (
							<SwiperSlide key={idx}>
								<ProjectUpdateSlide project={project} />
							</SwiperSlide>
						))}
					</Swiper>
				</SwiperWrapper>
			</Container>
		</ProjectUpdatesBlockWrapper>
	);
};

const Header = styled(Flex)`
	justify-content: space-between;
	align-items: center;
`;

const BlockTitle = styled(H4)`
	color: ${neutralColors.gray[600]};
`;

const ProjectUpdatesBlockWrapper = styled.div``;

const SwiperWrapper = styled(Row)``;
