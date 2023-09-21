import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import {
	Container,
	deviceSize,
	H4,
	IconPointerLeft,
	IconPointerRight,
	neutralColors,
} from '@giveth/ui-design-system';
import 'swiper/css';
import 'swiper/css/navigation';
import { captureException } from '@sentry/nextjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { Swiper as SwiperClass } from 'swiper/types';
import { useIntl } from 'react-intl';
import { client } from '@/apollo/apolloClient';
import { SIMILAR_PROJECTS } from '@/apollo/gql/gqlProjects';
import { IProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';
import { Flex } from '@/components/styled-components/Flex';
import { showToastError } from '@/lib/helpers';
import { ISuggestedProjectsGQL } from '@/apollo/types/gqlTypes';
import useDetectDevice from '@/hooks/useDetectDevice';
import {
	NavigationWrapper,
	PaginationWrapper,
	SwiperPaginationWrapper,
} from '@/components/styled-components/SwiperPagination';
import useMediaQuery from '@/hooks/useMediaQuery';

const projectsToFetch = 12;

const SimilarProjects = (props: { slug: string }) => {
	const { slug } = props;

	const { isMobile, isTablet, isLaptopS } = useDetectDevice();

	const [swiperInstance, setSwiperInstance] = useState<SwiperClass>();

	let projectsPerSlide;
	if (isMobile) {
		projectsPerSlide = 1;
	} else if (isTablet || isLaptopS) {
		projectsPerSlide = 2;
	} else {
		projectsPerSlide = 3;
	}

	const pagElRef = useRef<HTMLDivElement>(null);
	const nextElRef = useRef<HTMLDivElement>(null);
	const prevElRef = useRef<HTMLDivElement>(null);

	const { formatMessage } = useIntl();
	const [suggestedProjects, setSuggestedProjects] = useState<IProject[]>([]);

	useEffect(() => {
		swiperInstance?.slideTo(0);
		client
			.query({
				query: SIMILAR_PROJECTS,
				variables: {
					slug,
					take: projectsToFetch,
				},
				fetchPolicy: 'no-cache',
			})
			.then((res: ISuggestedProjectsGQL) => {
				const { similarProjectsBySlug } = res.data;
				const { projects } = similarProjectsBySlug;
				setSuggestedProjects(projects);
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'fetchSimilarProjects',
					},
				});
			});
	}, [slug]);

	const isBigScreen = useMediaQuery(`(min-width: ${deviceSize.tablet}px)`);

	if (!isBigScreen) suggestedProjects.slice(0, 5);

	if (!suggestedProjects || suggestedProjects.length === 0) return null;

	const slicedSuggestedProjects = isBigScreen
		? suggestedProjects
		: suggestedProjects?.slice(0, 5);

	const isOnePage = slicedSuggestedProjects?.length <= projectsPerSlide;

	return (
		<ContainerStyled id='similar-projects'>
			<Title>
				<H4 weight={700}>
					{formatMessage({ id: 'label.similar_projects' })}
				</H4>
				{!isOnePage && (
					<SwiperPaginationWrapper>
						<NavigationWrapper ref={prevElRef}>
							<IconPointerLeft
								color={neutralColors.gray[900]}
								size={24}
							/>
						</NavigationWrapper>
						<PaginationWrapper ref={pagElRef} />
						<NavigationWrapper ref={nextElRef}>
							<IconPointerRight
								color={neutralColors.gray[900]}
								size={24}
							/>
						</NavigationWrapper>
					</SwiperPaginationWrapper>
				)}
			</Title>
			<SwiperContainer>
				<Swiper
					onSwiper={setSwiperInstance}
					modules={[Navigation, Pagination]}
					navigation={{
						nextEl: nextElRef.current,
						prevEl: prevElRef.current,
					}}
					slidesPerView={projectsPerSlide}
					slidesPerGroup={projectsPerSlide}
					spaceBetween={24}
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
				>
					{slicedSuggestedProjects?.map(project => (
						<SwiperSlide key={project.id}>
							<ProjectCard project={project} />
						</SwiperSlide>
					))}
				</Swiper>
			</SwiperContainer>
		</ContainerStyled>
	);
};

const Title = styled(Flex)`
	justify-content: space-between;
	margin-bottom: 20px;
	flex-wrap: wrap;
	color: ${neutralColors.gray[600]};
`;

const SwiperContainer = styled.div`
	margin-left: -30px;
	.swiper {
		padding: 30px;
	}
`;

const ContainerStyled = styled(Container)`
	position: relative;
	margin-top: 60px;
	margin-bottom: 120px;
`;

export default SimilarProjects;
