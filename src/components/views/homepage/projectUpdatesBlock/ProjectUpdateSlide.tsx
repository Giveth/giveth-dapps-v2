import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { B, H6, neutralColors } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { IProject, IProjectUpdate } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';
import { mediaQueries } from '@/lib/constants/constants';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_UPDATES } from '@/apollo/gql/gqlProjects';

interface IProjectUpdateSlideProps {
	project: IProject;
}

export const ProjectUpdateSlide: FC<IProjectUpdateSlideProps> = ({
	project,
}) => {
	const [update, setUpdate] = useState<IProjectUpdate>();
	const elRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (update) return;
		const handleObserver = async (entities: any) => {
			const target = entities[0];
			if (project.id && target.isIntersecting) {
				const { data } = await client.query({
					query: FETCH_PROJECT_UPDATES,
					variables: {
						projectId: parseInt(project.id),
						take: 1,
						skip: 0,
					},
				});
				const _update = data.getProjectUpdates[0];
				_update && setUpdate(_update);
			}
		};
		const option = {
			root: null,
			threshold: 1,
		};
		const observer = new IntersectionObserver(handleObserver, option);
		if (elRef.current) {
			observer.observe(elRef.current);
		}
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, [project.id, update]);

	return (
		<ProjectUpdateSlideWrapper ref={elRef}>
			<StyledProjectCard project={project} />
			<ProjectUpdateCard>
				<UpdateDate>
					{update?.createdAt &&
						new Date(update?.createdAt).toLocaleString('en-GB', {
							day: 'numeric',
							month: 'short',
							year: 'numeric',
						})}
				</UpdateDate>
				<UpdateTitle weight={700}>{update?.title}</UpdateTitle>
			</ProjectUpdateCard>
		</ProjectUpdateSlideWrapper>
	);
};

const ProjectUpdateSlideWrapper = styled(Flex)`
	padding: 16px 0;
	gap: 24px;
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

const StyledProjectCard = styled(ProjectCard)`
	${mediaQueries.laptopS} {
		width: 384px !important;
	}
`;

const ProjectUpdateCard = styled.div`
	flex: 1;
	padding: 32px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 16px;
`;

const UpdateDate = styled(B)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 8px;
`;

const UpdateTitle = styled(H6)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 8px;
`;
