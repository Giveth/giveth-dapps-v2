import {
	brandColors,
	IconTrash,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';

import { Flex } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import {
	RowWrapper,
	TableCell,
	TableHeader,
} from '@/components/styled-components/Table';
import { IBoostedProject } from '@/apollo/types/gqlTypes';
import { EBoostedOrderBy, IBoostedOrder } from './ProfileBoostedTab';
import { BN, formatWeiHelper } from '@/helpers/number';

interface IBoostsTable {
	boosts: IBoostedProject[];
	totalAmountOfGIVpower: string;
	order: IBoostedOrder;
	changeOrder: (orderBy: EBoostedOrderBy) => void;
}

const BoostsTable: FC<IBoostsTable> = ({
	boosts,
	totalAmountOfGIVpower,
	order,
	changeOrder,
}) => {
	const _totalAmountOfGIVpower = BN(totalAmountOfGIVpower);
	return (
		<Table>
			<TableHeader>Projects</TableHeader>
			<TableHeader
				onClick={() => changeOrder(EBoostedOrderBy.Percentage)}
			>
				GIVpower amount
				{/* <SortIcon order={order} title={EBoostedOrderBy.Percentage} /> */}
			</TableHeader>
			<TableHeader>Boosted with</TableHeader>
			<TableHeader></TableHeader>
			{boosts?.map(boost => {
				return (
					<ProjectsRowWrapper key={boost.project.id}>
						<ProjectTableCell bold>
							{boost.project.title}
						</ProjectTableCell>
						<ProjectTableCell>
							{formatWeiHelper(
								_totalAmountOfGIVpower
									.mul(boost.percentage)
									.div(100),
							)}
						</ProjectTableCell>
						<ProjectTableCell bold>
							{boost.percentage}%
						</ProjectTableCell>
						<ProjectTableCell>
							<IconTrash size={24} />
						</ProjectTableCell>
					</ProjectsRowWrapper>
				);
			})}
		</Table>
	);
};

const Table = styled.div`
	display: grid;
	grid-template-columns: 4fr 1fr 1fr 0.1fr;
	overflow: auto;
	min-width: 700px;

	${mediaQueries.laptopS} {
		min-width: 900px;
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

export default BoostsTable;
