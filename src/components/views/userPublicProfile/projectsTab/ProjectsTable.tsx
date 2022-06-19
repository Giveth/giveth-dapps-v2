import {
	B,
	brandColors,
	IconHeart,
	neutralColors,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';

import { EOrderBy, IOrder } from '../UserPublicProfile.view';
import { idToProjectEdit, slugToProjectView } from '@/lib/routeCreators';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { formatUSD, smallFormatDate } from '@/lib/helpers';
import { Flex } from '@/components/styled-components/Flex';
import InternalLink from '@/components/InternalLink';
import ListingBadge from '@/components/views/userPublicProfile/projectsTab/ListingBadge';
import StatusBadge from '@/components/views/userPublicProfile/projectsTab/StatusBadge';
import SortIcon from '@/components/SortIcon';
import { IProject } from '@/apollo/types/types';
import { Badge } from '@/components/views/userPublicProfile/StyledComponents';
import { mediaQueries } from '@/lib/constants/constants';

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
	return (
		<Container>
			<TableHeader onClick={() => changeOrder(EOrderBy.CreationDate)}>
				Created at
				<SortIcon order={order} title={EOrderBy.CreationDate} />
			</TableHeader>
			<TableHeader>Status</TableHeader>
			<TableHeader>Project</TableHeader>
			<TableHeader>
				Likes 
				<IconHeart />
			</TableHeader>
			<TableHeader onClick={() => changeOrder(EOrderBy.Donations)}>
				Total Raised
				<SortIcon order={order} title={EOrderBy.Donations} />
			</TableHeader>
			<TableHeader>Listing</TableHeader>
			<TableHeader>Actions</TableHeader>
			{projects?.map(project => {
				const status = project.status.name;
				const isCancelled = status === EProjectStatus.CANCEL;
				return (
					<RowWrapper key={project.id}>
						<TableCell>
							{smallFormatDate(new Date(project.creationDate!))}
						</TableCell>
						<TableCell>
							<StatusBadge status={status!} />
						</TableCell>
						<TableCell bold>
							<ProjectTitle>
								{project.title}
								{project.verified && (
									<Badge mainColor={semanticColors.jade}>
										Verified
									</Badge>
								)}
							</ProjectTitle>
						</TableCell>
						<TableCell>{project.totalReactions}</TableCell>
						<TableCell bold>
							{formatUSD(project.totalDonations)} USD
						</TableCell>
						<TableCell>
							<ListingBadge listed={project.listed!} />
						</TableCell>
						<TableCell>
							<Actions isCancelled={isCancelled}>
								<InternalLink
									href={idToProjectEdit(project.id)}
									title='Edit'
									disabled={isCancelled}
								/>
								<InternalLink
									href={slugToProjectView(project.slug)}
									title='View'
									disabled={isCancelled}
								/>
							</Actions>
						</TableCell>
					</RowWrapper>
				);
			})}
		</Container>
	);
};

const Container = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 1.1fr 3fr 1.1fr 1.5fr 1.75fr 1fr;
	overflow: auto;
	min-width: 900px;

	${mediaQueries.laptopS} {
		min-width: 1000px;
	}
`;

const TableHeader = styled(B)`
	display: flex;
	height: 40px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
	align-items: center;
	${props =>
		props.onClick &&
		`cursor: pointer;
	gap: 8px;
	align-items: center;`}
	img {
		padding-left: 5px;
	}
`;

const TableCell = styled(P)<{ bold?: boolean }>`
	display: flex;
	width: 100%;
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	align-items: center;
	gap: 8px;
	font-weight: ${props => (props.bold ? 500 : 400)};
`;

const RowWrapper = styled.div`
	display: contents;
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
	& > div:first-child {
		padding-left: 4px;
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
	> :last-child {
		margin-left: 7px;
	}
`;

export default ProjectsTable;
