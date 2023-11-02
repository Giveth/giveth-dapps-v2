import {
	H2,
	IconFund24,
	IconHeartOutline24,
	IconPublish16,
	P,
	Subline,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { IProject } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import { smallFormatDate } from '@/lib/helpers';
import { ManageProjectAddressesModal } from '@/components/modals/ManageProjectAddresses/ManageProjectAddressesModal';
import ProjectActions from './ProjectActions';

interface IProjectItem {
	project: IProject;
	setProjects: Dispatch<SetStateAction<IProject[]>>;
}

const ProjectItem = ({ project, setProjects }: IProjectItem) => {
	console.log('project', project);
	const { formatMessage, locale } = useIntl();
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [selectedProject, setSelectedProject] = useState<IProject>();

	return (
		<ProjectContainer>
			<Flex justifyContent='space-between' alignItems='center'>
				<div>
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
					<H2>{project.title}</H2>
				</div>
				<ProjectActions
					setSelectedProject={setSelectedProject}
					setShowAddressModal={setShowAddressModal}
					project={project}
				/>
			</Flex>
			<HorizontalDivider />
			<Flex justifyContent='space-between'>
				<ProjectStatusesContainer>
					<Flex justifyContent='space-between'>
						<P>{formatMessage({ id: 'label.project_status' })}</P>
						<div>456</div>
					</Flex>
					<Flex justifyContent='space-between'>
						<P>Listed on public site</P>
						<div>124312312412</div>
					</Flex>
					<Flex justifyContent='space-between'>
						<P>
							{formatMessage({
								id: 'label.verification_status',
							})}
						</P>
						<div>123123123</div>
					</Flex>
					<Flex justifyContent='space-between'>
						<div>
							{formatMessage({
								id: 'label.quadratic_funding',
							})}
						</div>
						<div>123123123</div>
					</Flex>
				</ProjectStatusesContainer>
				<ProjectStatusesContainer>
					<Flex justifyContent='space-between'>
						<P>
							<Flex alignItems='center' gap='6px'>
								<IconHeartOutline24 />
								{formatMessage({ id: 'label.likes' })}
							</Flex>
						</P>
						<div>{project.totalReactions}</div>
					</Flex>
					<Flex justifyContent='space-between'>
						<P>
							<Flex alignItems='center' gap='6px'>
								<IconFund24 />
								{formatMessage({ id: 'label.total_raised' })}
							</Flex>
						</P>
						<div>{project.sumDonationValueUsd}</div>
					</Flex>
					<Flex justifyContent='space-between'>
						<P>
							<Flex alignItems='center' gap='6px'>
								Claim Recurring Donations
							</Flex>
						</P>
						<div>{project.sumDonationValueUsd}</div>
					</Flex>
				</ProjectStatusesContainer>
			</Flex>
			{showAddressModal && selectedProject && (
				<ManageProjectAddressesModal
					project={selectedProject}
					setShowModal={setShowAddressModal}
					setProjects={setProjects}
				/>
			)}
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

const ProjectStatusesContainer = styled.div`
	width: 330px;
`;

export default ProjectItem;
