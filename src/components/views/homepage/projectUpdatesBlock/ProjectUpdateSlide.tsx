import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
	B,
	brandColors,
	ButtonText,
	H6,
	IconChevronRight32,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { IProject, IProjectUpdate } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';
import { mediaQueries } from '@/lib/constants/constants';
import { client } from '@/apollo/apolloClient';
import { FETCH_FEATURED_PROJECT_UPDATES } from '@/apollo/gql/gqlProjects';
import Routes from '@/lib/constants/Routes';
import { EProjectPageTabs } from '../../project/ProjectIndex';

interface IProjectUpdateSlideProps {
	project: IProject;
}

export const ProjectUpdateSlide: FC<IProjectUpdateSlideProps> = ({
	project,
}) => {
	const [update, setUpdate] = useState<IProjectUpdate>();
	const [loading, setLoading] = useState(true);
	const elRef = useRef<HTMLDivElement>(null);
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (update) return;
		const handleObserver = async (entities: any) => {
			const target = entities[0];
			if (project.id && target.isIntersecting) {
				setLoading(true);
				const { data } = await client.query({
					query: FETCH_FEATURED_PROJECT_UPDATES,
					variables: {
						projectId: parseInt(project.id),
					},
				});
				setLoading(false);
				const _update = data.featuredProjectUpdate;
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
				{loading ? (
					<LoadingDotIcon>
						<div className='dot-flashing' />
					</LoadingDotIcon>
				) : update ? (
					<>
						<UpdateDate>
							{update && update.createdAt
								? new Date(update.createdAt).toLocaleString(
										'en-GB',
										{
											day: 'numeric',
											month: 'short',
											year: 'numeric',
										},
								  )
								: ''}
						</UpdateDate>
						<UpdateTitle weight={700}>{update?.title}</UpdateTitle>
						<UpdateDesc
							dangerouslySetInnerHTML={{
								__html: update?.content || '',
							}}
						/>
						<Flex justifyContent='flex-end'>
							<Link
								href={`${Routes.Project}/${project.slug}?tab=${EProjectPageTabs.UPDATES}`}
							>
								<ReadMore gap='22px'>
									<ButtonText>
										{formatMessage({
											id: 'label.read_more',
										})}
									</ButtonText>
									<IconChevronRight32 />
								</ReadMore>
							</Link>
						</Flex>
					</>
				) : (
					"This Project hasn't any update"
				)}
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
	overflow: hidden;
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
	overflow: hidden;
`;

const UpdateDate = styled(B)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 8px;
`;

const UpdateTitle = styled(H6)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 8px;
`;

const UpdateDesc = styled(P)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 8px;
	height: 290px;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const ReadMore = styled(FlexCenter)`
	color: ${brandColors.giv[500]};
	cursor: pointer;
`;

export const LoadingDotIcon = styled.div`
	padding: 4px 50%;
`;
