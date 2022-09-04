import { Fragment } from 'react';
import styled from 'styled-components';
import {
	B,
	IconRocketInSpace,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import SortIcon from '@/components/SortIcon';
import { EDirection } from '@/apollo/types/gqlEnums';
import { EOrderBy } from '@/components/views/userProfile/UserProfile.view';

const order = {
	by: EOrderBy.TokenAmount,
	direction: EDirection.ASC,
};

const GIVPowerTable = () => {
	return (
		<Container>
			<TableHeader>
				Ranking
				<SortIcon order={order} title={EOrderBy.TokenAmount} />
			</TableHeader>
			<TableHeader></TableHeader>
			<TableHeader>
				<IconRocketInSpace size={20} />
				Amount
				<SortIcon order={order} title={EOrderBy.UsdAmount} />
			</TableHeader>
			{tableData.map(({ rank, name, amount }) => (
				<Fragment key={name}>
					<TableRow>#{rank}</TableRow>
					<TableRow>{name}</TableRow>
					<TableRow>{amount}</TableRow>
				</Fragment>
			))}
		</Container>
	);
};

const tableData = [
	{ name: 'Carlos Quintero', amount: 150, rank: 1 },
	{ name: 'Anonymous', amount: 823, rank: 2 },
	{ name: 'Lauren Luz', amount: 85, rank: 3 },
];

const TableRow = styled(P)`
	height: 60px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const TableHeader = styled(B)`
	border-bottom: 2px solid ${neutralColors.gray[400]};
	display: flex;
	gap: 8px;
	padding-bottom: 8px;
	cursor: pointer;
`;

const Container = styled.div`
	margin-top: 40px;
	margin-bottom: 40px;
	display: grid;
	grid-template-columns: 0.7fr 4fr 1fr;
`;

export default GIVPowerTable;
