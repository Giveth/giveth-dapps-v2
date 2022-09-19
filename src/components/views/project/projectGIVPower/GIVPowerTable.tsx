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
			<TableHeader>Ranking</TableHeader>
			<TableHeader></TableHeader>
			<TableHeader>
				<IconRocketInSpace size={20} />
				Amount
			</TableHeader>
			{boostingsData?.map(({ id, user, boostedPower, rank }) => (
				<Fragment key={id}>
					<TableRow>#{rank}</TableRow>
					<TableRow>{user.name}</TableRow>
					<TableRow>{boostedPower}</TableRow>
				</Fragment>
			))}
		</Container>
	);
};

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
`;

const Container = styled.div`
	margin-top: 40px;
	margin-bottom: 10px;
	display: grid;
	grid-template-columns: 0.7fr 4fr 1fr;
`;

export default GIVPowerTable;
