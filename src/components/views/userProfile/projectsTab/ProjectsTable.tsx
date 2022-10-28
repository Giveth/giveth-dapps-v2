import {
	brandColors,
	IconHeart,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import { EOrderBy, IOrder } from '../UserProfile.view';
import { idToProjectEdit, slugToProjectView } from '@/lib/routeCreators';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { formatUSD, smallFormatDate } from '@/lib/helpers';
import { Flex } from '@/components/styled-components/Flex';
import InternalLink from '@/components/InternalLink';
import ListingBadge from '@/components/views/userProfile/projectsTab/ListingBadge';
import StatusBadge from '@/components/views/userProfile/projectsTab/StatusBadge';
import SortIcon from '@/components/SortIcon';
import { EVerificationStatus, IProject } from '@/apollo/types/types';
import { mediaQueries } from '@/lib/constants/constants';
import VerificationBadge from '@/components/VerificationBadge';
import {
	RowWrapper,
	TableCell,
	TableHeader,
} from '@/components/styled-components/Table';

interface IProjectsTable {
	projects: IProject[];
	order: IOrder;
	changeOrder: (orderBy: EOrderBy) => void;
}

const ProjectsTable: FC<IProjectsTable> = ({
	projects,
	changeOrder,
	order,
}) => {
	const { formatMessage } = useIntl();
	return (
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
				{formatMessage({ id: 'label.likes' })}
				<IconHeart />
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
				const isCancelled = status === EProjectStatus.CANCEL;
				const verStatus = project.verified
					? EVerificationStatus.VERIFIED
					: project.projectVerificationForm?.status;
				return (
					<ProjectsRowWrapper key={project.id}>
						<ProjectTableCell>
							{smallFormatDate(new Date(project.creationDate!))}
						</ProjectTableCell>
						<ProjectTableCell>
							<StatusBadge status={status!} />
						</ProjectTableCell>
						<ProjectTableCell bold>
							<ProjectTitle>
								{project.title}
								<VerificationBadge status={verStatus} />
							</ProjectTitle>
						</ProjectTableCell>
						<ProjectTableCell>
							{project.totalReactions}
						</ProjectTableCell>
						<ProjectTableCell bold>
							{formatUSD(project.totalDonations)} USD
						</ProjectTableCell>
						<ProjectTableCell>
							<ListingBadge listed={project.listed!} />
						</ProjectTableCell>
						<ProjectTableCell>
							<Actions isCancelled={isCancelled}>
								<InternalLink
									href={idToProjectEdit(project.id)}
									title={formatMessage({ id: 'label.edit' })}
									disabled={isCancelled}
								/>
								<InternalLink
									href={slugToProjectView(project.slug)}
									title={formatMessage({ id: 'label.view' })}
									disabled={isCancelled}
								/>
							</Actions>
						</ProjectTableCell>
					</ProjectsRowWrapper>
				);
			})}
		</Table>
	);
};

const Table = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 1.1fr 4fr 1.1fr 1.5fr 2fr 1fr;
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
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	font-weight: ${props => (props.bold ? 500 : 400)};
`;

const ProjectsRowWrapper = styled(RowWrapper)`
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
`;

const Actions = styled(Flex)<{ isCancelled: boolean }>`
	gap: 10px;
	> * {
		color: ${props =>
			props.isCancelled
				? brandColors.pinky[200]
				: brandColors.pinky[500]};
		cursor: ${props => (props.isCancelled ? 'default' : 'pointer')};
		font-size: 14px;
	}
`;

const ProjectTitle = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0 10px;
`;

export default ProjectsTable;
