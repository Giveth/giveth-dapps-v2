import {
	brandColors,
	neutralColors,
	IconHeartFilled,
} from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { EOrderBy, IOrder } from '../UserProfile.view';
import { slugToProjectView } from '@/lib/routeCreators';
import { formatUSD, smallFormatDate } from '@/lib/helpers';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import ListingBadge from '@/components/ListingBadge';
import StatusBadge from '@/components/views/userProfile/projectsTab/StatusBadge';
import SortIcon from '@/components/SortIcon';
import { IProject } from '@/apollo/types/types';
import { mediaQueries } from '@/lib/constants/constants';
import VerificationBadge from '@/components/VerificationBadge';
import {
	RowWrapper,
	TableCell,
	TableHeader,
} from '@/components/styled-components/Table';
import { ManageProjectAddressesModal } from '@/components/modals/ManageProjectAddresses/ManageProjectAddressesModal';
import ProjectActions from '@/components/views/userProfile/projectsTab/ProjectActions';

interface IProjectsTable {
	projects: IProject[];
	order: IOrder;
	changeOrder: (orderBy: EOrderBy) => void;
	setProjects: Dispatch<SetStateAction<IProject[]>>;
}

const ProjectsTable: FC<IProjectsTable> = ({
	projects,
	changeOrder,
	order,
	setProjects,
}) => {
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [selectedProject, setSelectedProject] = useState<IProject>();
	const { formatMessage, locale } = useIntl();
	return (
		<>
			<Table>
				<ProjectsTableHeader
					onClick={() => changeOrder(EOrderBy.CreationDate)}
				>
					{formatMessage({ id: 'label.created_at' })}
					<SortIcon order={order} title={EOrderBy.CreationDate} />
				</ProjectsTableHeader>
				<ProjectsTableHeader>
					{formatMessage({ id: 'label.status' })}
				</ProjectsTableHeader>
				<ProjectsTableHeader>
					{formatMessage({ id: 'label.project' })}
				</ProjectsTableHeader>
				<ProjectsTableHeader>
					<FlexCenter gap='8px'>
						{formatMessage({ id: 'label.likes' })}
						<IconHeartFilled />
					</FlexCenter>
				</ProjectsTableHeader>
				<ProjectsTableHeader
					onClick={() => changeOrder(EOrderBy.Donations)}
				>
					{formatMessage({ id: 'label.total_raised' })}
					<SortIcon order={order} title={EOrderBy.Donations} />
				</ProjectsTableHeader>
				<ProjectsTableHeader>
					{formatMessage({ id: 'label.listing' })}
				</ProjectsTableHeader>
				<ProjectsTableHeader>
					{formatMessage({ id: 'label.actions' })}
				</ProjectsTableHeader>
				{projects?.map(project => {
					const status = project.status.name;
					return (
						<ProjectsRowWrapper key={project.id}>
							<ProjectTableCell>
								{smallFormatDate(
									new Date(project.creationDate!),
									locale,
								)}
							</ProjectTableCell>
							<ProjectTableCell>
								<StatusBadge status={status!} />
							</ProjectTableCell>
							<ProjectTableCell bold>
								<ProjectTitle>
									<Link
										href={slugToProjectView(project.slug)}
									>
										{project.title}
									</Link>
									<VerificationBadge
										isVerified={project.verified}
										verificationStatus={
											project.projectVerificationForm
												?.status
										}
									/>
								</ProjectTitle>
							</ProjectTableCell>
							<ProjectTableCell>
								{project.totalReactions}
							</ProjectTableCell>
							<ProjectTableCell bold>
								{formatUSD(project.totalDonations)} USD
							</ProjectTableCell>
							<ProjectTableCell>
								<ListingBadge
									listed={project.listed!}
									showBullet
								/>
							</ProjectTableCell>
							<ProjectTableCell>
								<ProjectActions project={project} />
							</ProjectTableCell>
						</ProjectsRowWrapper>
					);
				})}
			</Table>
			{showAddressModal && selectedProject && (
				<ManageProjectAddressesModal
					project={selectedProject}
					setShowModal={setShowAddressModal}
					setProjects={setProjects}
				/>
			)}
		</>
	);
};

const Table = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 1.1fr 4fr 1.1fr 1.5fr 2fr 200px;
	overflow: auto;
	min-width: 900px;

	${mediaQueries.laptopS} {
		min-width: 1000px;
	}
`;

const ProjectsTableHeader = styled(TableHeader)`
	img {
		padding-left: 5px;
	}
`;

const ProjectTableCell = styled(TableCell)<{ bold?: boolean }>`
	width: 100%;
	min-height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	font-weight: ${props => (props.bold ? 500 : 400)};
`;

const ProjectsRowWrapper = styled(RowWrapper)`
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
`;

const ProjectTitle = styled(Flex)`
	padding-top: 8px;
	flex-wrap: wrap;
	gap: 0 10px;
`;

export default ProjectsTable;
