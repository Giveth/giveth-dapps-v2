import {
	H2,
	IconFund24,
	IconHeartOutline24,
	IconPublish16,
	P,
	Subline,
	neutralColors,
	Flex,
	mediaQueries,
} from '@giveth/ui-design-system';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { IProject } from '@/apollo/types/types';
import { smallFormatDate } from '@/lib/helpers';
import { ManageProjectAddressesModal } from '@/components/modals/ManageProjectAddresses/ManageProjectAddressesModal';
import ProjectActions from './ProjectActions';
import ClaimRecurringDonationModal from './ClaimRecurringDonationModal';
import ProjectStatusBadge from './ProjectStatusBadge';
import ProjectQFStatus from './ProjectQFStatus';
import ProjectListedStatus from './ProjectListedStatus';
import { formatDonation } from '@/helpers/number';
import VerificationBadge from '@/components/VerificationBadge';

interface IProjectItem {
	project: IProject;
	setProjects: Dispatch<SetStateAction<IProject[]>>;
}

const ProjectItem = ({ project, setProjects }: IProjectItem) => {
	const { formatMessage, locale } = useIntl();
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [selectedProject, setSelectedProject] = useState<IProject>();
	const [showClaimModal, setShowClaimModal] = useState(false);

	return (
		<ProjectContainer>
			<ProjectInfoContainer
				$justifyContent='space-between'
				$alignItems='center'
				gap='24px'
			>
				<div>
					<Subline>
						<Flex $alignItems='center'>
							<IconPublish16 />
							&nbsp;
							{formatMessage({ id: 'label.created_at' })} &nbsp;
							{smallFormatDate(
								new Date(project.creationDate!),
								locale,
							)}
						</Flex>
					</Subline>
					<Link href={`/project/${project.slug}`}>
						<H2>{project.title}</H2>
					</Link>
				</div>
				<StyledProjectActions
					setSelectedProject={setSelectedProject}
					setShowAddressModal={setShowAddressModal}
					project={project}
					setShowClaimModal={setShowClaimModal}
				/>
			</ProjectInfoContainer>
			<HorizontalDivider />
			<ProjectInfoContainer $justifyContent='space-between' gap='8px'>
				<ProjectStatusesContainer $flexDirection='column' gap='16px'>
					<Flex $justifyContent='space-between'>
						<P>{formatMessage({ id: 'label.project_status' })}</P>
						<div>
							<ProjectStatusBadge project={project} />
						</div>
					</Flex>
					<Flex $justifyContent='space-between'>
						<P>Listed on public site</P>
						<div>
							<ProjectListedStatus project={project} />
						</div>
					</Flex>
					<Flex $justifyContent='space-between'>
						<P>
							{formatMessage({
								id: 'label.verification_status',
							})}
						</P>
						<div>
							<VerificationBadge
								isVerified={project?.verified}
								verificationStatus={
									project.projectVerificationForm?.status
								}
							/>
						</div>
					</Flex>
					<Flex $justifyContent='space-between'>
						<div>
							{formatMessage({
								id: 'label.qf_eligibility',
							})}
						</div>
						<div>
							<ProjectQFStatus project={project} showRoundName />
						</div>
					</Flex>
				</ProjectStatusesContainer>
				<ProjectStatusesContainer $flexDirection='column' gap='16px'>
					<Flex $justifyContent='space-between'>
						<P>
							<Flex $alignItems='center' gap='6px'>
								<IconHeartOutline24 />
								{formatMessage({ id: 'label.likes' })}
							</Flex>
						</P>
						<div>{project.totalReactions}</div>
					</Flex>
					<Flex $justifyContent='space-between'>
						<P>
							<Flex $alignItems='center' gap='6px'>
								<IconFund24 />
								{formatMessage({ id: 'label.total_raised' })}
							</Flex>
						</P>
						{formatDonation(
							project.totalDonations || 0,
							'$',
							locale,
						)}
					</Flex>
				</ProjectStatusesContainer>
			</ProjectInfoContainer>
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

const StyledProjectActions = styled(ProjectActions)`
	width: 100%;
	${mediaQueries.tablet} {
		width: unset;
	}
`;

const HorizontalDivider = styled.hr`
	border: 1px solid ${neutralColors.gray[300]};
	margin: 24px 0;
`;

const ProjectInfoContainer = styled(Flex)`
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const ProjectStatusesContainer = styled(Flex)`
	width: 330px;
`;

export default ProjectItem;
