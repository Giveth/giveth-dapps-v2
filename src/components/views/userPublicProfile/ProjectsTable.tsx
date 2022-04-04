import {
	B,
	brandColors,
	IconArrowBottom,
	IconArrowTop,
	IconSort16,
	neutralColors,
	P,
	GLink,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { useRouter } from 'next/router';
import { smallFormatDate } from '@/lib/helpers';
import { Flex } from '@/components/styled-components/Flex';
import { FC } from 'react';
import styled from 'styled-components';
import {
	IProjectsTable,
	EOrderBy,
	EDirection,
	IOrder,
} from './UserPublicProfile.view';
import { mediaQueries } from '@/utils/constants';
import { idToProjectEdit } from '@/lib/routeCreators';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

interface IBadge {
	mainColor?: any;
}

interface IEditGLink {
	disabled?: boolean;
}

interface IStatus {
	id?: string;
	name?: string;
}

const injectSortIcon = (order: IOrder, title: EOrderBy) => {
	return order.by === title ? (
		order.direction === EDirection.DESC ? (
			<IconArrowBottom size={16} />
		) : (
			<IconArrowTop size={16} />
		)
	) : (
		<IconSort16 />
	);
};

const ProjectsTable: FC<IProjectsTable> = ({
	projects,
	orderChangeHandler,
	order,
}) => {
	const router = useRouter();

	const setupBadge = (status: IStatus, listed?: boolean | null) => {
		console.log('projects', projects);
		const Bull = () => <BulletPoint>&bull;</BulletPoint>;
		let color,
			title = '';

		if (listed) {
			color = semanticColors.jade;
			title = 'Listed';
		} else if (listed === null) {
			color = semanticColors.blueSky;
			title = 'Waiting for review';
		} else {
			color = semanticColors.golden;
			title = 'Not Listed';
		}

		switch (status.name) {
			case EProjectStatus.DEACTIVE:
				color = semanticColors.golden;
				title = 'Not Listed';
				break;
			case EProjectStatus.CANCEL:
				color = semanticColors.punch;
				title = 'Banned';
				break;
			case EProjectStatus.DRAFT:
				color = brandColors.cyan;
				title = 'Draft';
				break;
		}

		return (
			<Badge mainColor={color}>
				<Bull />
				<SublineBold>{title}</SublineBold>
			</Badge>
		);
	};

	return (
		<>
			<ProjectTablecontainer>
				<TableHeader
					onClick={() => orderChangeHandler(EOrderBy.CreationDate)}
				>
					<B>Created at</B>
					{injectSortIcon(order, EOrderBy.CreationDate)}
				</TableHeader>
				<TableHeaderCentered>
					<B>Active</B>
				</TableHeaderCentered>
				<TableHeader>
					<B>Project</B>
				</TableHeader>
				<TableHeader>
					<B>Likes</B>{' '}
					<img
						src='/images/heart-black.svg'
						width='24px'
						height='24px'
					/>
				</TableHeader>
				<TableHeader
					onClick={() => orderChangeHandler(EOrderBy.Donations)}
				>
					<B>Total Funds Raised</B>
					{injectSortIcon(order, EOrderBy.Donations)}
				</TableHeader>
				<TableHeader>
					<B>Listing</B>
				</TableHeader>
				<TableHeader>
					<B>Actions</B>
				</TableHeader>
				{projects?.map((project, idx) => (
					<RowWrapper key={idx}>
						<TableCell>
							<B>
								{project.creationDate &&
									smallFormatDate(
										new Date(project.creationDate),
									)}
							</B>
						</TableCell>
						<CenteredCell>
							{project?.status?.id == '5' ? (
								<img
									src='/images/checkmark-3.svg'
									width='24px'
									height='24px'
								/>
							) : (
								<img
									src='/images/cross-black.svg'
									width='24px'
									height='24px'
								/>
							)}
						</CenteredCell>
						<TableCell>
							<B>{project?.title}</B>
							{project?.verified && (
								<Badge mainColor={semanticColors.jade}>
									Verified
								</Badge>
							)}
						</TableCell>
						<TableCell>
							<P>{project?.totalReactions}</P>
						</TableCell>
						<TableCell>
							<B>
								{project?.totalDonations?.toLocaleString(
									'en-US',
									{
										minimumFractionDigits: 0,
										maximumFractionDigits: 1,
									} || '',
								)}{' '}
								USD
							</B>
						</TableCell>
						<TableCell>
							{setupBadge(project.status, project.listed)}
						</TableCell>
						<TableCell>
							<Actions>
								<EditGLink
									disabled={project?.status?.id === '7'}
									color={
										project?.status?.id !== '7'
											? brandColors.pinky[500]
											: brandColors.pinky[200]
									}
									onClick={() =>
										router.push(idToProjectEdit(project.id))
									}
								>
									Edit
								</EditGLink>
								<GLink
									onClick={() =>
										router.push(`project/${project.slug}`)
									}
								>
									View
								</GLink>
							</Actions>
						</TableCell>
					</RowWrapper>
				))}
			</ProjectTablecontainer>
		</>
	);
};

const ProjectTablecontainer = styled.div`
	display: grid;
	grid-template-columns: 1.5fr 1fr 4fr 1.1fr 2fr 1.75fr 1fr;
	overflow: auto;
	${mediaQueries.laptop} {
		min-width: 1133px;
	}
	${mediaQueries.tablet} {
		min-width: 1000px;
	}
	${mediaQueries.mobileL} {
		min-width: 1133px;
	}
	${mediaQueries.mobileS} {
		min-width: 1133px;
	}
`;

const TableHeader = styled(Flex)`
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

const TableHeaderCentered = styled(TableHeader)`
	display: flex;
	justify-content: center;
`;

const TableCell = styled(Flex)`
	width: 100%;
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	align-items: center;
	gap: 8px;
`;

const CenteredCell = styled(TableCell)`
	display: flex;
	justify-content: center;
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

const Actions = styled(Flex)`
	gap: 10px;
	* {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const Badge = styled(Flex)`
	align-items: center;
	color: ${(props: IBadge) => props.mainColor![700]} !important;
	background: ${(props: IBadge) => props.mainColor![100]};
	border: 2px solid ${(props: IBadge) => props.mainColor![300]};
	box-sizing: border-box;
	border-radius: 50px;
	padding: 0 8px;
`;

const BulletPoint = styled.div`
	font-size: 18px;
	margin: 0 5px 0 0;
	padding: 0;
`;

const EditGLink = styled(GLink)`
	color: ${props => props.color};
	cursor: ${(props: IEditGLink) => (props.disabled ? 'default' : 'pointer')};
`;

export default ProjectsTable;
