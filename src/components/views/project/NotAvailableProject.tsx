import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { client } from '@/apollo/apolloClient';
import { IProject } from '@/apollo/types/types';
import { FETCH_HOME_PROJECTS } from '@/apollo/gql/gqlProjects';
import { EDirection, gqlEnums } from '@/apollo/types/gqlEnums';
import { brandColors, neutralColors, H4, H6 } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import ProjectCard from '@/components/project-card/ProjectCard';

const projectsToFetch = 12;
const projectsToShow = 3;
const NotAvailableProject = () => {
	const [suggestedProjects, setSuggestedProjects] = useState<IProject[]>([]);
	const [listPosition, setListPosition] = useState<number>(0);

	const moveList = (pos: number) => {
		if (suggestedProjects.length === 0) return;
		const newPos = listPosition + pos;
		if (newPos >= 0 && newPos < projectsToFetch / projectsToShow) {
			setListPosition(newPos);
		}
	};

	useEffect(() => {
		const fetchSuggestedProjects = async () => {
			const variables: any = {
				limit: projectsToFetch,
				orderBy: {
					field: gqlEnums.QUALITYSCORE,
					direction: EDirection.DESC,
				},
			};
			const { data } = await client.query({
				query: FETCH_HOME_PROJECTS,
				variables,
				fetchPolicy: 'network-only',
			});
			setSuggestedProjects(data.projects?.projects);
		};

		fetchSuggestedProjects();
	}, []);

	return (
		<Wrapper>
			<Image
				src='/images/missing-project.svg'
				width={122.69}
				height={112}
			/>
			<TitleText>Oops! This project is no longer available!</TitleText>
			<SubtitleText>Take a look at similar projects</SubtitleText>
			<Slider>
				{listPosition !== 0 ? (
					<CaretLeft
						src='/images/caret_right.svg'
						onClick={() => moveList(-1)}
					/>
				) : (
					<Empty />
				)}

				<ProjectsContainer>
					{suggestedProjects
						?.slice(
							listPosition * projectsToShow,
							listPosition * projectsToShow + projectsToShow,
						)
						?.map(project => (
							<ProjectCard key={project.id} project={project} />
						))}
				</ProjectsContainer>
				<CaretRight
					src='/images/caret_right.svg'
					onClick={() => moveList(1)}
				/>
			</Slider>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
	background-image: url('/images/backgrounds/background-2.png');
	justify-content: center;
	align-items: center;
	padding-top: 160px;
`;

const TitleText = styled(H4)`
	width: 377px;
	color: ${brandColors.deep[800]};
	text-align: center;
`;

const SubtitleText = styled(H6)`
	margin: 54px 0 0 0;
	color: ${neutralColors.gray[900]};
`;

const ProjectsContainer = styled.div`
	display: grid;
	width: 80%;
	gap: 25px;
	margin-bottom: 64px;
	margin-top: 28px;

	${mediaQueries.laptop} {
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaQueries.laptopL} {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const Slider = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: center;
`;

const CaretRight = styled.img`
	width: 48;
	height: 48;
	cursor: pointer;
	margin: 0 24px;
`;

const CaretLeft = styled(CaretRight)`
	-webkit-transform: rotate(180deg);
	-moz-transform: rotate(180deg);
	-ms-transform: rotate(180deg);
	-o-transform: rotate(180deg);
	transform: rotate(180deg);
`;

const Empty = styled.div`
	width: 48px;
	height: 48px;
	margin: 0 24px;
`;

export default NotAvailableProject;
