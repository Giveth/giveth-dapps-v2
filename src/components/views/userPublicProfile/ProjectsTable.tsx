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
import { Row } from '@/components/styled-components/Grid';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { IUserProfileProjectsView } from './UserPublicProfile.view';

const itemPerPage = 10;

enum EOrderBy {
	TokenAmount = 'TokenAmount',
	UsdAmount = 'UsdAmount',
	CreationDate = 'CreationDate',
}

enum EDirection {
	DESC = 'DESC',
	ASC = 'ASC',
}

interface IOrder {
	by: EOrderBy;
	direction: EDirection;
}

interface IBadge {
	mainColor?: any;
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

const ProjectsTable: FC<IUserProfileProjectsView> = ({ projects }) => {
	const router = useRouter();

	const [order, setOrder] = useState<IOrder>({
		by: EOrderBy.CreationDate,
		direction: EDirection.DESC,
	});

	const orderChangeHandler = (orderby: EOrderBy) => {
		if (orderby === order.by) {
			setOrder({
				by: orderby,
				direction:
					order.direction === EDirection.ASC
						? EDirection.DESC
						: EDirection.ASC,
			});
		} else {
			setOrder({
				by: orderby,
				direction: EDirection.DESC,
			});
		}
	};

	const setupBadge = (status: IStatus) => {
		const Bull = () => <BulletPoint>&bull;</BulletPoint>;
		let color,
			title = '';
		switch (status.id) {
			case '5':
				color = semanticColors.jade;
				title = 'Active';
				break;
			case '6':
				color = semanticColors.punch;
				title = 'Deactivated';
				break;
			case '7':
				color = semanticColors.golden;
				title = 'Cancelled';
				break;
			default:
				color = semanticColors.jade;
				title = status.name!;
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
			<DonationTablecontainer>
				<TableHeader
					onClick={() => orderChangeHandler(EOrderBy.CreationDate)}
				>
					<B>Created at</B>
					{injectSortIcon(order, EOrderBy.CreationDate)}
				</TableHeader>
				<TableHeader>
					<B>Active</B>
				</TableHeader>
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
					onClick={() => orderChangeHandler(EOrderBy.TokenAmount)}
				>
					<B>Total Raised</B>
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
							<P>
								{project.creationDate &&
									smallFormatDate(
										new Date(project.creationDate),
									)}
							</P>
						</TableCell>
						<ProjectTitleCell>
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
						</ProjectTitleCell>
						<TableCell>
							<P>{project?.title}</P>
							{project?.verified && (
								<Badge mainColor={semanticColors.jade}>
									verified
								</Badge>
							)}
						</TableCell>
						<TableCell>
							<P>{project?.totalReactions}</P>
						</TableCell>
						<TableCell>
							<P>
								{project?.totalDonations}{' '}
								{project.totalDonations &&
								project.totalDonations > 0
									? 'USD'
									: ''}
							</P>
						</TableCell>
						<TableCell>{setupBadge(project.status)}</TableCell>
						<TableCell>
							<Actions>
								<GLink>Edit</GLink>
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
			</DonationTablecontainer>
		</>
	);
};

const DonationTablecontainer = styled.div`
	display: grid;
	grid-template-columns: 2fr 1fr 4fr 1fr 1fr 1fr 1fr;
	width: 100%;
	min-width: 1133px;
`;

const TableHeader = styled(Row)`
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

const TableCell = styled(Row)`
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	align-items: center;
	gap: 8px;
`;

const ProjectTitleCell = styled(TableCell)`
	cursor: pointer;
	& > svg {
		display: none;
	}
	&:hover > svg {
		display: block;
	}
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

const Actions = styled(Row)`
	gap: 10px;
	* {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const Badge = styled(Row)`
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

export default ProjectsTable;
