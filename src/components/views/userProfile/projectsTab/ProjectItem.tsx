import {
	H1,
	IconPublish16,
	P,
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
import { VerifiedBadge } from '@/components/badges/VerifiedBadge';

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
			<HorizontalDivider />
			<Flex>
				<Flex flexDirection='column' gap='8px'>
					<P>
						{formatMessage({
							id: 'label.verification_status',
						})}
					</P>
					{/* Should change after new design is ready */}
					<VerifiedBadge />
				</Flex>
				<VerticalDivider />
				<Flex flexDirection='column' gap='8px'>
					<P>Listed on public site</P>
					{/* Should change after new design is ready */}
					<VerifiedBadge />
				</Flex>
				<VerticalDivider />

				<Flex flexDirection='column' gap='8px'>
					<P>
						{formatMessage({
							id: 'label.quadratic_funding',
						})}
					</P>
					{/* Should change after new design is ready */}
					<VerifiedBadge />
					<VerticalDivider />
				</Flex>
			</Flex>
		</ProjectContainer>
	);
};

const ProjectContainer = styled.div`
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
`;

const HorizontalDivider = styled.hr`
	border: 1px solid ${neutralColors.gray[300]};
	margin: 24px 0;
`;

const VerticalDivider = styled.div`
	width: 1px;

	background-color: ${neutralColors.gray[300]};
	flex-shrink: 0;
	margin: 10px 20px;
`;

const FlexContainer = styled.div`
	flex: 1;
`;

export default ProjectItem;
