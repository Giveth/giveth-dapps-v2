import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Container, H5 } from '@giveth/ui-design-system';

import { captureException } from '@sentry/nextjs';
import { client } from '@/apollo/apolloClient';
import { SIMILAR_PROJECTS } from '@/apollo/gql/gqlProjects';
import { IProject } from '@/apollo/types/types';
import { deviceSize, mediaQueries } from '@/lib/constants/constants';
import ProjectCard from '@/components/project-card/ProjectCard';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import { showToastError } from '@/lib/helpers';
import { ISuggestedProjectsGQL } from '@/apollo/types/gqlTypes';
import useWindowDimensions from '@/hooks/useWindowDimensions';

const projectsToFetch = 12;

const SimilarProjects = (props: { slug: string }) => {
	const { slug } = props;

	const { width } = useWindowDimensions();

	let projectsToShow;
	if (width < deviceSize.tablet) {
		projectsToShow = 1;
	} else if (width < deviceSize.laptopL) {
		projectsToShow = 2;
	} else {
		projectsToShow = 3;
	}

	const [suggestedProjects, setSuggestedProjects] = useState<IProject[]>([]);
	const [listPosition, setListPosition] = useState<number>(0);

	const pagesCount = Math.ceil(suggestedProjects.length / projectsToShow);

	const moveList = (pos: number) => {
		if (suggestedProjects.length === 0) return;
		const newPos = listPosition + pos;
		if (newPos >= 0 && newPos < pagesCount) {
			setListPosition(newPos);
		}
	};

	useEffect(() => {
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
	}, []);

	if (!suggestedProjects || suggestedProjects.length === 0) return null;
	return (
		<ContainerStyled id='similar-projects'>
			<H5 weight={700}>Similar projects</H5>
			<SliderContainer>
				<CaretLeft
					onClick={() => moveList(-1)}
					disabled={listPosition === 0}
				>
					<img src={'/images/caret_right.svg'} alt='caret right' />
				</CaretLeft>
				{suggestedProjects
					?.slice(
						listPosition * projectsToShow,
						listPosition * projectsToShow + projectsToShow,
					)
					?.map(project => (
						<div className='fadeIn' key={project.id}>
							<ProjectCard project={project} />
						</div>
					))}
				<CaretRight
					disabled={listPosition === pagesCount - 1}
					onClick={() => moveList(1)}
				>
					<img src={'/images/caret_right.svg'} alt='caret right' />
				</CaretRight>
			</SliderContainer>
		</ContainerStyled>
	);
};

const ContainerStyled = styled(Container)`
	margin-top: 60px;
`;

const CaretRight = styled(FlexCenter)<{ disabled: boolean }>`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: white;
	box-shadow: ${Shadow.Neutral[500]};
	opacity: ${props => props.disabled && 0.4};
	cursor: ${props => (props.disabled ? 'default' : 'pointer')};
	position: absolute;
	top: calc(50% - 24px);
	right: -24px;
	z-index: 1;
`;

const CaretLeft = styled(CaretRight)`
	-ms-transform: rotate(180deg);
	transform: rotate(180deg);
	left: -24px;
`;

const SliderContainer = styled.div`
	display: grid;
	width: 100%;
	max-width: ${deviceSize.laptopL + 'px'};
	gap: 25px;
	position: relative;
	margin-bottom: 64px;
	margin-top: 28px;

	${mediaQueries.tablet} {
		grid-template-columns: repeat(2, 1fr);
	}
	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

export default SimilarProjects;
