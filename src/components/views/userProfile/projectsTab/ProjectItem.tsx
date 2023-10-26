import {
	H1,
	IconPublish16,
	Subline,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { IProject } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import StatusBadge from './StatusBadge';
import { smallFormatDate } from '@/lib/helpers';

interface IProjectItem {
	project: IProject;
}

const ProjectItem = ({ project }: IProjectItem) => {
	console.log('project', project);
	const { formatMessage, locale } = useIntl();

	return (
		<ProjectContainer>
			<Flex gap='16px' alignItems='center'>
				<StatusBadge status={project.status.name!}></StatusBadge>
				<Subline>
					<Flex alignItems='center'>
						<IconPublish16 />
						&nbsp;
						{formatMessage({ id: 'label.created_at' })} &nbsp;
						{smallFormatDate(
							new Date(project.creationDate!),
							locale,
						)}
					</Flex>
				</Subline>
			</Flex>
			<H1>{project.title}</H1>
		</ProjectContainer>
	);
};

const ProjectContainer = styled.div`
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
`;

export default ProjectItem;
