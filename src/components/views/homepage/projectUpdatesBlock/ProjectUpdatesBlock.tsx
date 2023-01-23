import React, { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import styled from 'styled-components';
import { H4, mediaQueries, neutralColors } from '@giveth/ui-design-system';
import { SwiperPagination } from '@/components/SwiperPagination';
import { Flex } from '@/components/styled-components/Flex';
import { IProject } from '@/apollo/types/types';
import { Container, Row } from '@/components/Grid';
import { ProjectUpdateSlide } from './ProjectUpdateSlide';

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
					<BlockTitle weight={700}>
						Awesome Project Updates
					</BlockTitle>
					<SwiperPagination swiper={swiper} itemsCount={6} />
				</Header>
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

const Header = styled(Flex)`
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
	gap: 24px;
	margin-bottom: 32px;
`;

const BlockTitle = styled(H4)`
	color: ${neutralColors.gray[600]};
	text-align: center;
`;

const SwiperWrapper = styled(Row)``;
