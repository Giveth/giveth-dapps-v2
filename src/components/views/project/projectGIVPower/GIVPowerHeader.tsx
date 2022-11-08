import styled from 'styled-components';
import {
	brandColors,
	GLink,
	H5,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
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
			<Desc>
				Donors to higher ranked projects get more GIVbacks.
				<LearnMoreLink href='' size='Big'>
					&nbsp;Learn more.
				</LearnMoreLink>
			</Desc>
		</Container>
	);
};

const Container = styled.div`
	padding: 16px 24px;
	border-radius: 8px;
	background-color: ${neutralColors.gray[100]};
`;

const Desc = styled(P)`
	padding: 8px 0 32px;
`;

const LearnMoreLink = styled(GLink)`
	color: ${brandColors.pinky[500]};
`;

export default GIVPowerHeader;
