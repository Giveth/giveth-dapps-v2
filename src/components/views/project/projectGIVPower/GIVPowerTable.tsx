import { FC } from 'react';
import styled from 'styled-components';
import {
	B,
	IconRocketInSpace,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { RowWrapper } from '@/components/styled-components/Table';
import { formatWeiHelper } from '@/helpers/number';
import { UserWithPFPInCell } from '@/components/UserWithPFPInCell';
import { IPowerBoostingWithUserGIVpower } from '.';

interface IGIVPowerTableProps {
	powerBoostings?: IPowerBoostingWithUserGIVpower[];
	totalPowerBoosting: string;
}

const GIVPowerTable: FC<IGIVPowerTableProps> = ({
	powerBoostings,
	totalPowerBoosting,
}) => {
	return (
		<Container>
			<TableHeader></TableHeader>
			<TableHeader>
				<IconRocketInSpace size={20} />
				Amount
			</TableHeader>
			{powerBoostings?.map(({ id, user }) => (
				<GIVpowerRowWrapper key={id}>
					<TableCell>
						<UserWithPFPInCell user={user} />
					</TableCell>
					<TableCell>{formatWeiHelper(user.allocated)}</TableCell>
				</GIVpowerRowWrapper>
			))}
			<TableHeader>TOTAL GIVPOWER</TableHeader>
			<TableHeader>{totalPowerBoosting || 0}</TableHeader>
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

const GIVpowerRowWrapper = styled(RowWrapper)`
	&:hover > div {
		background-color: ${neutralColors.gray[300]};
	}

	&:hover #pfp-avatar {
		box-shadow: 0px 0.762881px 4.57729px 1.14432px rgba(225, 69, 141, 0.5);
	}
`;

const Container = styled.div`
	margin-top: 40px;
	margin-bottom: 10px;
	display: grid;
	grid-template-columns: 4fr 1fr;
`;

export default GIVPowerTable;
