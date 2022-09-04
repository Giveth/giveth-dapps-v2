import {
	brandColors,
	Button,
	H5,
	IconTrash,
	IconUnlock16,
	neutralColors,
	OutlineButton,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';

import { mediaQueries } from '@/lib/constants/constants';
import {
	RowWrapper,
	TableCell,
	TableFooter,
	TableHeader,
} from '@/components/styled-components/Table';
import { IBoostedProject } from '@/apollo/types/gqlTypes';
import { EBoostedOrderBy, IBoostedOrder } from './ProfileBoostedTab';
import { BN, formatWeiHelper } from '@/helpers/number';
import { Flex } from '@/components/styled-components/Flex';
import Input, { InputSize } from '@/components/Input';

interface IBoostsTable {
	boosts: IBoostedProject[];
	totalAmountOfGIVpower: string;
	order: IBoostedOrder;
	changeOrder: (orderBy: EBoostedOrderBy) => void;
}

enum ETableNode {
	VIEWING,
	EDITING,
}

const BoostsTable: FC<IBoostsTable> = ({
	boosts,
	totalAmountOfGIVpower,
	order,
	changeOrder,
}) => {
	const [mode, setMode] = useState(ETableNode.VIEWING);
	const [_boosts, setBoosts] = useState(boosts);
	const _totalAmountOfGIVpower = BN(totalAmountOfGIVpower);
	return (
		<>
			<Header justifyContent='space-between'>
				<H5 weight={700}>GIVPower Table Summary</H5>
				<Flex gap='8px'>
					{mode === ETableNode.VIEWING ? (
						<Button
							buttonType='primary'
							label='edit boosting'
							size='small'
							onClick={() => setMode(ETableNode.EDITING)}
						/>
					) : (
						<>
							<OutlineButton
								buttonType='primary'
								label='reset all'
								size='small'
								onClick={() => setBoosts(boosts)}
							/>
							<Button
								buttonType='primary'
								label='Apply changes'
								size='small'
								onClick={() => setMode(ETableNode.EDITING)}
							/>
							<OutlineButton
								buttonType='primary'
								label='cancel'
								size='small'
								onClick={() => setMode(ETableNode.VIEWING)}
							/>
						</>
					)}
				</Flex>
			</Header>
			<Table>
				<TableHeader>Projects</TableHeader>
				<TableHeader
					onClick={() => {
						if (mode === ETableNode.VIEWING)
							changeOrder(EBoostedOrderBy.Percentage);
					}}
				>
					GIVpower amount
					{/* <SortIcon order={order} title={EBoostedOrderBy.Percentage} /> */}
				</TableHeader>
				<TableHeader>Boosted with</TableHeader>
				<TableHeader></TableHeader>
				{_boosts?.map(boost => {
					return (
						<BoostsRowWrapper key={boost.project.id}>
							<BoostsTableCell bold>
								{boost.project.title}
							</BoostsTableCell>
							<BoostsTableCell>
								{formatWeiHelper(
									_totalAmountOfGIVpower
										.mul(boost.percentage)
										.div(100),
								)}
							</BoostsTableCell>
							<BoostsTableCell bold>
								{mode === ETableNode.VIEWING ? (
									`${boost.percentage}%`
								) : (
									<Input
										size={InputSize.SMALL}
										LeftIcon={
											<IconUnlock16
												size={16}
												color={neutralColors.gray[600]}
											/>
										}
									/>
								)}
							</BoostsTableCell>
							<BoostsTableCell>
								<IconTrash size={24} />
							</BoostsTableCell>
						</BoostsRowWrapper>
					);
				})}
				<TableFooter>TOTAL GIVPOWER</TableFooter>
				<TableFooter></TableFooter>
				<TableFooter>100%</TableFooter>
				<TableFooter></TableFooter>
			</Table>
		</>
	);
};

const Header = styled(Flex)`
	margin: 68px 0 48px;
`;

const Table = styled.div`
	display: grid;
	grid-template-columns: 4fr 1fr 1fr 0.1fr;
	overflow: auto;
	min-width: 700px;

	${mediaQueries.laptopS} {
		min-width: 900px;
	}
`;

const BoostsTableCell = styled(TableCell)<{ bold?: boolean }>`
	width: 100%;
	height: 60px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	font-weight: ${props => (props.bold ? 500 : 400)};
`;

const BoostsRowWrapper = styled(RowWrapper)`
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
		color: ${brandColors.pinky[500]};
	}
`;

export default BoostsTable;
