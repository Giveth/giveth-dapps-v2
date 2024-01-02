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
import ClaimRecurringDonationModal from './ClaimRecurringDonationModal';
import ProjectStatusBadge from './ProjectStatusBadge';
import ProjectVerificationBadge from './ProjectVerificationBadge';
import ProjectQFStatus from './ProjectQFStatus';
import ProjectListedStatus from './ProjectListedStatus';

interface IProjectItem {
	project: IProject;
	setProjects: Dispatch<SetStateAction<IProject[]>>;
}

const ProjectItem = ({ project, setProjects }: IProjectItem) => {
	console.log('project', project);
	const { formatMessage, locale } = useIntl();
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [selectedProject, setSelectedProject] = useState<IProject>();
	const [showClaimModal, setShowClaimModal] = useState(false);
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
					setShowClaimModal={setShowClaimModal}
				/>
			</Flex>
			<HorizontalDivider />
			<Flex justifyContent='space-between'>
				<ProjectStatusesContainer flexDirection='column' gap='16px'>
					<Flex justifyContent='space-between'>
						<P>{formatMessage({ id: 'label.project_status' })}</P>
						<div>
							<ProjectStatusBadge project={project} />
						</div>
					</Flex>
					<Flex justifyContent='space-between'>
						<P>Listed on public site</P>
						<div>
							<ProjectListedStatus project={project} />
						</div>
					</Flex>
					<Flex justifyContent='space-between'>
						<P>
							{formatMessage({
								id: 'label.verification_status',
							})}
						</P>
						<div>
							<ProjectVerificationBadge project={project} />
						</div>
					</Flex>
					<Flex justifyContent='space-between'>
						<div>
							{formatMessage({
								id: 'label.quadratic_funding',
							})}
						</div>
						<div>
							<ProjectQFStatus project={project} />
						</div>
					</Flex>
				</ProjectStatusesContainer>
				<ProjectStatusesContainer flexDirection='column' gap='16px'>
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
					{process.env.NEXT_PUBLIC_RECURRING_DONATION === 'true' && (
						<Flex justifyContent='space-between'>
							<P>
								<Flex alignItems='center' gap='6px'>
									Claim Recurring Donations
								</Flex>
							</P>
							<div>{project.sumDonationValueUsd}</div>
						</Flex>
					)}
				</ProjectStatusesContainer>
			</Flex>
			{showAddressModal && selectedProject && (
				<ManageProjectAddressesModal
					project={selectedProject}
					setShowModal={setShowAddressModal}
					setProjects={setProjects}
				/>
			)}
			{showClaimModal && selectedProject && (
				<ClaimRecurringDonationModal
					setShowModal={setShowClaimModal}
					project={project}
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

const ProjectStatusesContainer = styled(Flex)`
	width: 330px;
`;

export default ProjectItem;
