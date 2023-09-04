import { H5, brandColors, neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';

import Link from 'next/link';
import BigNumber from 'bignumber.js';
import {
	RowWrapper,
	TableCell,
	TableFooter,
	TableHeader,
} from '@/components/styled-components/Table';
import { Flex } from '@/components/styled-components/Flex';
import SortIcon from '@/components/SortIcon';
import { IPowerBoosting } from '@/apollo/types/types';
import {
	IBoostedOrder,
	EPowerBoostingOrder,
} from './useFetchPowerBoostingInfo';
import { formatWeiHelper } from '@/helpers/number';
import { slugToProjectView } from '@/lib/routeCreators';

interface IBoostsTable {
	totalAmountOfGIVpower: BigNumber;
	boosts: IPowerBoosting[];
	order: IBoostedOrder;
	changeOrder: (orderBy: EPowerBoostingOrder) => void;
}

export const PublicBoostsTable: FC<IBoostsTable> = ({
	totalAmountOfGIVpower,
	order,
	boosts,
	changeOrder,
}) => {
	return (
		<>
			<Header justifyContent='space-between' flexWrap gap='16px'>
				<H5 weight={700}>GIVpower Summary</H5>
			</Header>
			<Table>
				<TableHeader>Projects</TableHeader>
				<TableHeader
					onClick={() => {
						changeOrder(EPowerBoostingOrder.Percentage);
					}}
				>
					GIVpower Amount
					<SortIcon
						order={order}
						title={EPowerBoostingOrder.Percentage}
					/>
				</TableHeader>
				<TableHeader>% of Total</TableHeader>
				{boosts?.map(boost => {
					return (
						<BoostsRowWrapper key={boost.project.id}>
							<BoostsTableCell bold>
								<Link
									href={slugToProjectView(boost.project.slug)}
								>
									{boost.project.title}
								</Link>
							</BoostsTableCell>
							<BoostsTableCell>
								{formatWeiHelper(
									totalAmountOfGIVpower
										.multipliedBy(boost.percentage || 0)
										.dividedBy(100),
								)}
							</BoostsTableCell>
							<BoostsTableCell bold>
								${boost.percentage}%
							</BoostsTableCell>
						</BoostsRowWrapper>
					);
				})}
				<TableFooter>Total GIVpower</TableFooter>
				<TableFooter></TableFooter>
				<TableFooter>100%</TableFooter>
			</Table>
		</>
	);
};

const Header = styled(Flex)`
	margin-bottom: 48px;
`;

const Table = styled.div`
	display: grid;
	grid-template-columns: 4fr 1.5fr 0.6fr;
	min-width: 700px;
`;

const BoostsTableCell = styled(TableCell)<{ bold?: boolean }>`
	width: 100%;
	min-height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	font-weight: ${props => (props.bold ? 500 : 400)};
	line-height: unset;
`;

const BoostsRowWrapper = styled(RowWrapper)`
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
	overflow-y: hidden;
`;
