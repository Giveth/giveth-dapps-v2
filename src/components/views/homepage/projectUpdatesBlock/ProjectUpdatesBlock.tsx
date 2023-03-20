import React, { FC, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { IconPointerLeft, IconPointerRight } from '@giveth/ui-design-system';
import { Navigation, Pagination } from 'swiper';
import { Container, Row } from '@giveth/ui-design-system';
import { IProject } from '@/apollo/types/types';
import { ProjectUpdateSlide } from './ProjectUpdateSlide';
import { BlockHeader, BlockTitle } from '../common';
import {
	NavigationWrapper,
	PaginationWrapper,
	SwiperPaginationWrapper,
} from '@/components/styled-components/SwiperPagination';

interface IProjectUpdatesBlockProps {
	projects: IProject[];
}

export const ProjectUpdatesBlock: FC<IProjectUpdatesBlockProps> = ({
	projects,
}) => {
	const [swiper, setSwiper] = useState<SwiperType>();
	const pagElRef = useRef<HTMLDivElement>(null);
	const nextElRef = useRef<HTMLDivElement>(null);
	const prevElRef = useRef<HTMLDivElement>(null);
	const { formatMessage } = useIntl();

	return (
		<ProjectUpdatesBlockWrapper>
			<Container>
				<BlockHeader>
					<BlockTitle>
						{formatMessage({ id: 'label.awesome_project_updates' })}
					</BlockTitle>
					<SwiperPaginationWrapper>
						<NavigationWrapper ref={prevElRef}>
							<IconPointerLeft size={24} />
						</NavigationWrapper>
						<PaginationWrapper ref={pagElRef}></PaginationWrapper>
						<NavigationWrapper ref={nextElRef}>
							<IconPointerRight size={24} />
						</NavigationWrapper>
					</SwiperPaginationWrapper>
				</BlockHeader>
				<SwiperWrapper>
					<Swiper
						slidesPerView={1}
						onSwiper={setSwiper}
						modules={[Navigation, Pagination]}
						navigation={{
							nextEl: nextElRef.current,
							prevEl: prevElRef.current,
						}}
						pagination={{
							el: pagElRef.current,
							clickable: true,
							type: 'bullets',
							renderBullet: function (index, className) {
								return (
									'<span class="' +
									className +
									'">' +
									(index + 1) +
									'</span>'
								);
							},
						}}
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
