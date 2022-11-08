import { Fragment } from 'react';
import styled from 'styled-components';
import {
	B,
	IconRocketInSpace,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { IPowerBoostingsData } from '@/apollo/types/types';

interface IGIVPowerTableProps {
	boostingsData: IPowerBoostingsData[];
}

const GIVPowerTable = ({ boostingsData }: IGIVPowerTableProps) => {
	return (
		<Container>
			{/* <TableHeader>Ranking</TableHeader> */}
			<TableHeader></TableHeader>
			<TableHeader>
				<IconRocketInSpace size={20} />
				Amount
			</TableHeader>
			{boostingsData?.map(({ id, user, boostedPower, rank }) => (
				<Fragment key={id}>
					{/* <TableCell>#{rank}</TableCell> */}
					<TableCell>{user.name || 'Anonymous'}</TableCell>
					<TableCell>{boostedPower.toFixed(2)}</TableCell>
				</Fragment>
			))}
			{/* <TableCell></TableCell> */}
			<TableHeader>TOTAL GIVPOWER</TableHeader>
			<TableHeader>1000</TableHeader>
		</Container>
	);
};

const TableCell = styled(P)`
	height: 60px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const TableHeader = styled(B)`
	border-bottom: 2px solid ${neutralColors.gray[400]};
	display: flex;
	gap: 8px;
	padding-top: 16px;
	padding-bottom: 8px;
`;

const Container = styled.div`
	margin-top: 40px;
	margin-bottom: 10px;
	display: grid;
	grid-template-columns: 4fr 1fr;
`;

export default GIVPowerTable;
