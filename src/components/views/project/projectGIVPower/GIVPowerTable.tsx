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
import { IPowerBoostingsData } from '@/apollo/types/types';

const order = {
	by: EOrderBy.TokenAmount,
	direction: EDirection.ASC,
};

interface IGIVPowerTableProps {
	boostingsData: IPowerBoostingsData[];
}

const GIVPowerTable = ({ boostingsData }: IGIVPowerTableProps) => {
	console.log('boostingsData', boostingsData);
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
			{boostingsData?.map(({ id, user, boostedPower }) => (
				<Fragment key={user.id}>
					<TableRow>#{id}</TableRow>
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
	cursor: pointer;
`;

const Container = styled.div`
	margin-top: 40px;
	margin-bottom: 40px;
	display: grid;
	grid-template-columns: 0.7fr 4fr 1fr;
`;

export default GIVPowerTable;
