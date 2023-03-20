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
import { useIntl } from 'react-intl';
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
	const { formatMessage } = useIntl();

	return (
		<Container>
			<H5 weight={700}>
				{formatMessage({
					id: 'label.boost_this_project_with_givpower',
				})}
			</H5>
			<Desc>
				{formatMessage({
					id: 'label.donors_to_higher_ranked_projects',
				})}
				<LearnMoreLink
					as='a'
					href={links.GIVPOWER_DOC}
					size='Big'
					target='_blank'
				>
					&nbsp;{formatMessage({ id: 'label.learn_more' })}
				</LearnMoreLink>
			</Desc>
			<RanksRow>
				<Col xs={12} md={6}>
					<RankBox>
						<RankTitle>
							{formatMessage({ id: 'label.current_rank' })}
						</RankTitle>
						<CurrentRank projectPower={projectPower} />
						<RankDescContainer gap='6px'>
							<IconWrapper>
								<IconAlertCircle16 />
							</IconWrapper>
							<Caption>
								{formatMessage({
									id: 'label.the_rank_will_update_at_the_start_of_the_next_round',
								})}
							</Caption>
						</RankDescContainer>
					</RankBox>
				</Col>
				<Col xs={12} md={6}>
					<RankBox>
						<RankTitle>
							{formatMessage({ id: 'label.projected_rank' })}
						</RankTitle>
						<NextRank
							projectPower={projectPower}
							projectFuturePower={projectFuturePower}
						/>
						<RankDescContainer gap='6px'>
							<IconWrapper>
								<IconAlertCircle16 />
							</IconWrapper>
							<Caption>
								{formatMessage({
									id: 'label.this_is_the_expected_rank_for_the_next_round',
								})}
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
