import React, { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import styled from 'styled-components';
import { SwiperPagination } from '@/components/SwiperPagination';
import { IProject } from '@/apollo/types/types';
import { Container, Row } from '@/components/Grid';
import { ProjectUpdateSlide } from './ProjectUpdateSlide';
import { BlockHeader, BlockTitle } from '../common';

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
				<BlockHeader>
					<BlockTitle>Awesome Project Updates</BlockTitle>
					<SwiperPagination swiper={swiper} itemsCount={6} />
				</BlockHeader>
				<SwiperWrapper>
					<Swiper
						slidesPerView={1}
						onSwiper={setSwiper}
						spaceBetween={24}
					>
						{projects.slice(0, 6).map((project, idx) => (
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
const ProjectUpdatesBlockWrapper = styled.div`
	padding: 80px 0 64px;
`;

const SwiperWrapper = styled(Row)``;
