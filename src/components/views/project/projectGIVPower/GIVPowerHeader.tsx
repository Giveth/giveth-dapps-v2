import styled from 'styled-components';
import { H5, neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import { IProjectPower } from '@/apollo/types/types';

interface IGIVPowerHeader {
	projectPower?: IProjectPower;
	projectFuturePower?: IProjectPower;
}

const GIVPowerHeader: FC<IGIVPowerHeader> = ({
	projectPower,
	projectFuturePower,
}) => {
	const handlePowerRank = () => {
		if (projectPower?.totalPower === 0) {
			return '--';
		} else if (projectPower?.powerRank) {
			return projectPower?.powerRank;
		} else {
			return '--';
		}
	};

	return (
		<Container>
			<H5 weight={700}>
				Boost this project with GIVpower to improve its rank!
			</H5>
		</Container>
	);
};

const Container = styled.div`
	padding: 16px 24px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[100]};
`;

export default GIVPowerHeader;
