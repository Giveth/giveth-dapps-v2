import {
	H2,
	IconFund24,
	IconPublish16,
	P,
	Subline,
	neutralColors,
	Flex,
	mediaQueries,
	IconUpdate24,
} from '@giveth/ui-design-system';
import { type FC, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { EVerificationStatus, IProject } from '@/apollo/types/types';
import { smallFormatDate } from '@/lib/helpers';
import { ManageProjectAddressesModal } from '@/components/modals/ManageProjectAddresses/ManageProjectAddressesModal';
import ProjectActions from './ProjectActions';
import ClaimRecurringDonationModal from './ClaimRecurringDonationModal';
import ProjectStatusBadge from './ProjectStatusBadge';
import ProjectQFStatus from './ProjectQFStatus';
import ProjectListedStatus from './ProjectListedStatus';
import { formatDonation } from '@/helpers/number';
import VerificationBadge from '@/components/VerificationBadge';
import DeleteProjectModal from './DeleteProjectModal';
import ProjectVerificationStatus from './ProjectVerificationStatus';
import { EProjectStatus, EProjectType } from '@/apollo/types/gqlEnums';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import { idToCauseEdit } from '@/lib/routeCreators';

interface IProjectItem {
	project: IProject;
	refetchProjects: () => void;
}

const ProjectItem: FC<IProjectItem> = props => {
	const { formatMessage, locale } = useIntl();
	const [project, setProject] = useState(props.project);
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [selectedProject, setSelectedProject] = useState<IProject>();
	const [showClaimModal, setShowClaimModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// Check does cause have some projects that has been not active
	// or missing network 137 address
	let projectStatus = '';
	if (project.projectType === EProjectType.CAUSE) {
		if (project.causeProjects) {
			projectStatus = project.causeProjects.some(p => {
				const isInactiveOrUnverifiedAndIncluded =
					(p.project.status.name !== EProjectStatus.ACTIVE ||
						!p.project.verified) &&
					p.isIncluded;

				const isMissingNetwork137 = !p.project.addresses?.some(
					address => address.networkId === 137,
				);

				return isInactiveOrUnverifiedAndIncluded || isMissingNetwork137;
			})
				? 'label.cause.review_status'
				: '';
		}
	}

	return (
		<ProjectContainer>
			{project.projectType === EProjectType.CAUSE && projectStatus && (
				<InlineToastWrapper
					type={EToastType.Warning}
					message={formatMessage({ id: projectStatus })}
					link={idToCauseEdit(project.id)}
					linkText={formatMessage({
						id: 'label.cause.review',
					})}
				/>
			)}
			<ProjectInfoContainer
				$justifyContent='space-between'
				$alignItems='center'
				gap='24px'
			>
				<Header>
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
					<Link
						href={
							project.projectType === EProjectType.CAUSE
								? `/cause/${project.slug}`
								: `/project/${project.slug}`
						}
					>
						<Title>{project.title}</Title>
					</Link>
				</Header>
				<StyledProjectActions
					setSelectedProject={setSelectedProject}
					setShowAddressModal={setShowAddressModal}
					project={project}
					setShowClaimModal={setShowClaimModal}
					setProject={setProject}
					setShowDeleteModal={setShowDeleteModal}
				/>
			</ProjectInfoContainer>
			<HorizontalDivider />
			<ProjectInfoContainer $justifyContent='space-between' gap='8px'>
				<ProjectStatusesContainer $flexDirection='column' gap='16px'>
					<Flex $justifyContent='space-between'>
						<P>
							{project.projectType === EProjectType.CAUSE
								? formatMessage({
										id: 'label.cause.cause_status_small',
									})
								: formatMessage({ id: 'label.project_status' })}
						</P>
						<div>
							<ProjectStatusBadge project={project} />
						</div>
					</Flex>
					<Flex $justifyContent='space-between'>
						<P>
							{project.projectType === EProjectType.CAUSE
								? formatMessage({
										id: 'label.cause.listed_publicly',
									})
								: formatMessage({
										id: 'label.project_listed_on_public_site',
									})}
						</P>
						<div>
							<ProjectListedStatus project={project} />
						</div>
					</Flex>

					<Flex $justifyContent='space-between'>
						<P>
							{formatMessage({
								id: 'label.verification_status_backs',
							})}
						</P>
						<div>
							<VerificationBadge
								isGivbackEligible={project?.isGivbackEligible}
								verificationStatus={
									project.projectVerificationForm?.status
								}
							/>
						</div>
					</Flex>
					{project.projectType === EProjectType.PROJECT && (
						<Flex $justifyContent='space-between'>
							<P>
								{formatMessage({
									id: 'label.verification_status',
								})}
							</P>
							<div>
								<ProjectVerificationStatus
									verified={
										project.projectVerificationForm
											?.status ===
										EVerificationStatus.VERIFIED
									}
								/>
							</div>
						</Flex>
					)}
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
					{project.projectType === EProjectType.CAUSE && (
						<Flex $justifyContent='space-between'>
							<P>
								<Flex $alignItems='center' gap='6px'>
									<IconUpdate24 />
									{formatMessage({
										id: 'label.projects',
									})}
								</Flex>
							</P>
							{project.activeProjectsCount || 0}
						</Flex>
					)}
					<Flex $justifyContent='space-between'>
						<P>
							<Flex $alignItems='center' gap='6px'>
								<IconFund24 />
								{formatMessage({ id: 'label.total_raised' })}
							</Flex>
						</P>
						{formatDonation(project.totalRaised || 0, '$', locale)}
					</Flex>
					{project.projectType === EProjectType.CAUSE && (
						<Flex $justifyContent='space-between'>
							<P>
								<Flex $alignItems='center' gap='6px'>
									<IconFund24 />
									{formatMessage({
										id: 'label.cause.total_distributed',
									})}
								</Flex>
							</P>
							{formatDonation(
								project.totalDistributed || 0,
								'$',
								locale,
							)}
						</Flex>
					)}
				</ProjectStatusesContainer>
			</ProjectInfoContainer>
			{showAddressModal && selectedProject && (
				<ManageProjectAddressesModal
					project={selectedProject}
					setShowModal={setShowAddressModal}
					setProject={setProject}
				/>
			)}
			{showClaimModal && selectedProject && (
				<ClaimRecurringDonationModal
					setShowModal={setShowClaimModal}
					project={project}
				/>
			)}
			{showDeleteModal && selectedProject && (
				<DeleteProjectModal
					setShowModal={setShowDeleteModal}
					project={selectedProject}
					refetchProjects={props.refetchProjects}
				/>
			)}
		</ProjectContainer>
	);
};

const ProjectContainer = styled.div`
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
	overflow: hidden;
`;

const Header = styled.div`
	max-width: 100%;
	overflow: hidden;
`;

const Title = styled(H2)`
	text-overflow: ellipsis;
	overflow: hidden;
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
	${mediaQueries.tablet} {
		width: 330px;
	}
`;

const InlineToastWrapper = styled(InlineToast)`
	width: 100%;
`;

export default ProjectItem;
