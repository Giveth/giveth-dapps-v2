import styled from 'styled-components';
import {
	brandColors,
	Caption,
	GLink,
	H5,
	H6,
	IconAlertCircle16,
	IconArrowUp16,
	IconArrowDown16,
	neutralColors,
	P,
	semanticColors,
	Subline,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import { IProjectPower } from '@/apollo/types/types';
import { Col, Row } from '@/components/Grid';
import { Flex } from '@/components/styled-components/Flex';
import links from '@/lib/constants/links';

interface IGIVPowerHeader {
	projectPower?: IProjectPower;
	projectFuturePower?: IProjectPower;
}

const GIVPowerHeader: FC<IGIVPowerHeader> = ({
	projectPower,
	projectFuturePower,
}) => {
	const goingUp =
		!projectFuturePower?.powerRank || !projectPower?.powerRank
			? 0
			: projectFuturePower.powerRank - projectPower?.powerRank;

	return (
		<Container>
			<H5 weight={700}>
				Boost this project with GIVpower to improve its rank!
			</H5>
			<Desc>
				Donors to higher ranked projects get more GIVbacks.
				<LearnMoreLink
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
						<Rank>
							<H5 weight={700}>#{projectPower?.powerRank}</H5>
						</Rank>
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
						<RankTitle>Projected Rank</RankTitle>
						<NextRank state={goingUp}>
							<Flex alignItems='baseline' gap='4px'>
								{goingUp > 0 ? (
									<IconArrowDown16 />
								) : (
									<IconArrowUp16 />
								)}
								<H6 weight={700}>
									#
									{projectFuturePower?.powerRank ||
										projectPower?.powerRank}
								</H6>
							</Flex>
						</NextRank>
						<RankDescContainer gap='6px'>
							<IconAlertCircle16 />
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

const Rank = styled.div`
	height: 54px;
`;

const NextRank = styled(Rank)<{ state: number }>`
	color: ${props =>
		props.state > 0 ? semanticColors.punch[700] : semanticColors.jade[700]};
`;
const RankDescContainer = styled(Flex)`
	padding-top: 6px;
`;

export default GIVPowerHeader;
