import { FC } from 'react';
import styled from 'styled-components';
import {
	B,
	IconRocketInSpace,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import { IPowerBoostingsData, IProjectPower } from '@/apollo/types/types';
import { RowWrapper } from '@/components/styled-components/Table';

interface IGIVPowerTableProps {
	boostingsData: IPowerBoostingsData[];
	projectPower?: IProjectPower;
}

const GIVPowerTable: FC<IGIVPowerTableProps> = ({
	boostingsData,
	projectPower,
}) => {
	return (
		<Container>
			<TableHeader></TableHeader>
			<TableHeader>
				<IconRocketInSpace size={20} />
				Amount
			</TableHeader>
			{boostingsData?.map(({ id, user, boostedPower }) => (
				<GIVpowerRowWrapper key={id}>
					<TableCell>{user.name || 'Anonymous'}</TableCell>
					<TableCell>{boostedPower.toFixed(2)}</TableCell>
				</GIVpowerRowWrapper>
			))}
			<TableHeader>TOTAL GIVPOWER</TableHeader>
			<TableHeader>
				{projectPower?.totalPower?.toFixed(2) || 0}
			</TableHeader>
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
`;

const Container = styled.div`
	margin-top: 40px;
	margin-bottom: 10px;
	display: grid;
	grid-template-columns: 4fr 1fr;
`;

export default GIVPowerTable;
