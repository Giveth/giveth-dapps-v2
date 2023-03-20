import styled from 'styled-components';
import {
	brandColors,
	Caption,
	GLink,
	H5,
	IconAlertCircle16,
	neutralColors,
	P,
	Subline,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import { Col, Row } from '@giveth/ui-design-system';
import { IProjectPower } from '@/apollo/types/types';
import { Flex } from '@/components/styled-components/Flex';
import links from '@/lib/constants/links';
import { CurrentRank, NextRank } from '@/components/GIVpowerRank';

interface IGIVPowerHeader {
	projectPower?: IProjectPower;
	projectFuturePower?: IProjectPower;
}

const GIVPowerHeader: FC<IGIVPowerHeader> = ({
	projectPower,
	projectFuturePower,
}) => {
	return (
		<Container>
			<H5 weight={700}>
				Boost this project with GIVpower to improve its rank!
			</H5>
			<Desc>
				Donors to higher ranked projects get more GIVbacks.
				<LearnMoreLink
					as='a'
					href={links.GIVPOWER_DOC}
					size='Big'
					target='_blank'
				>
					&nbsp;Learn more.
				</LearnMoreLink>
			</Desc>
			<RanksRow>
				<Col xs={12} md={6}>
					<RankBox>
						<RankTitle>Current Rank</RankTitle>
						<CurrentRank projectPower={projectPower} />
						<RankDescContainer gap='6px'>
							<IconWrapper>
								<IconAlertCircle16 />
							</IconWrapper>
							<Caption>
								The rank will update at the start of the next
								GIVbacks round.
							</Caption>
						</RankDescContainer>
					</RankBox>
				</Col>
				<Col xs={12} md={6}>
					<RankBox>
						<RankTitle>Projected Rank</RankTitle>
						<NextRank
							projectPower={projectPower}
							projectFuturePower={projectFuturePower}
						/>
						<RankDescContainer gap='6px'>
							<IconWrapper>
								<IconAlertCircle16 />
							</IconWrapper>
							<Caption>
								This is the expected rank for the next round
								based on current GIVpower.
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

const RankDescContainer = styled(Flex)`
	padding-top: 6px;
`;

const IconWrapper = styled.div`
	padding-top: 2px;
	width: 16px;
`;

export default GIVPowerHeader;
