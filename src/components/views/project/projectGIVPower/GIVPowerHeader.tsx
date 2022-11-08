import styled from 'styled-components';
import {
	brandColors,
	Caption,
	GLink,
	H3,
	H5,
	IconAlertCircle16,
	neutralColors,
	P,
	Subline,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import { IProjectPower } from '@/apollo/types/types';
import { Col, Row } from '@/components/Grid';
import { Flex } from '@/components/styled-components/Flex';

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
			<RanksRow>
				<Col xs={12} md={6}>
					<RankBox>
						<RankTitle>Current Rank</RankTitle>
						<CurrentRank weight={700}>
							#{projectPower?.powerRank}
						</CurrentRank>
						<RankDescContainer gap='6px'>
							<IconAlertCircle16 />
							<Caption>
								The rank will update at the start of the next
								GIVbacks round.
							</Caption>
						</RankDescContainer>
					</RankBox>
				</Col>
				<Col xs={12} md={6}>
					<RankBox>
						<RankTitle>Current Rank</RankTitle>
						<CurrentRank weight={700}>
							#{projectPower?.powerRank}
						</CurrentRank>
						<RankDescContainer gap='6px'>
							<IconAlertCircle16 />
							<Caption>
								The rank will update at the start of the next
								GIVbacks round.
							</Caption>
						</RankDescContainer>
					</RankBox>
				</Col>
			</RanksRow>
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

const RanksRow = styled(Row)``;

const RankBox = styled.div`
	padding: 0 60px 32px 0;
`;

const RankTitle = styled(Subline)``;

const CurrentRank = styled(H3)`
	height: 54px;
`;
const RankDescContainer = styled(Flex)`
	padding-top: 6px;
`;

export default GIVPowerHeader;
