import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Container, H5 } from '@giveth/ui-design-system';
import 'swiper/css';
import 'swiper/css/navigation';
import { captureException } from '@sentry/nextjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import Image from 'next/image';
import { Swiper as SwiperClass } from 'swiper/types';

import { client } from '@/apollo/apolloClient';
import { SIMILAR_PROJECTS } from '@/apollo/gql/gqlProjects';
import { IProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import { showToastError } from '@/lib/helpers';
import { ISuggestedProjectsGQL } from '@/apollo/types/gqlTypes';
import useDetectDevice from '@/hooks/useDetectDevice';
import CaretRightIcon from '/public/images/caret_right.svg';

const projectsToFetch = 12;

const SimilarProjects = (props: { slug: string }) => {
	const { slug } = props;

	const { isMobile, isTablet, isLaptopS } = useDetectDevice();

	const [swiperInstance, setSwiperInstance] = useState<SwiperClass>();

	let projectsToShow;
	if (isMobile) {
		projectsToShow = 1;
	} else if (isTablet || isLaptopS) {
		projectsToShow = 2;
	} else {
		projectsToShow = 3;
	}

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

	if (!suggestedProjects || suggestedProjects.length === 0) return null;
	return (
		<ContainerStyled id='similar-projects'>
			<H5 weight={700}>Similar projects</H5>
			<SwiperContainer>
				<CaretLeft id='prevIcon'>
					<Image src={CaretRightIcon} alt='caret right' />
				</CaretLeft>
				<Swiper
					onSwiper={setSwiperInstance}
					modules={[Navigation]}
					navigation={{
						nextEl: '#nextIcon',
						prevEl: '#prevIcon',
					}}
					slidesPerView={projectsToShow}
					spaceBetween={24}
				>
					{suggestedProjects?.map(project => (
						<SwiperSlide key={project.id}>
							<ProjectCard project={project} />
						</SwiperSlide>
					))}
				</Swiper>
				<CaretRight id='nextIcon'>
					<Image src={CaretRightIcon} alt='caret right' />
				</CaretRight>
			</SwiperContainer>
		</ContainerStyled>
	);
};

const SwiperContainer = styled.div`
	overflow: unset;
	position: relative;
`;

const ContainerStyled = styled(Container)`
	position: relative;
	margin-top: 60px;
	margin-bottom: 120px;
	> h5 {
		margin-bottom: 21px;
	}
`;

const CaretRight = styled(FlexCenter)`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: white;
	box-shadow: ${Shadow.Neutral[500]};
	cursor: pointer;
	position: absolute;
	top: calc(50% - 24px);
	right: -24px;
	z-index: 10;
	user-select: none;
	&.swiper-button-disabled {
		opacity: 0.4;
		cursor: default;
	}
	transition: opacity 0.3s ease-in-out;
`;

const CaretLeft = styled(CaretRight)`
	-ms-transform: rotate(180deg);
	transform: rotate(180deg);
	left: -24px;
`;

export default SimilarProjects;
