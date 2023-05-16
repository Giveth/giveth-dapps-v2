import {
	B,
	Caption,
	IconHelpFilled16,
	IconInfoOutline16,
	IconRocketInSpace24,
	Lead,
	P,
	Subline,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { CurrentRank } from '@/components/GIVpowerRank';
import { useProjectContext } from '@/context/project.context';
import { NextRank } from '@/components/GIVpowerRank';

export const GIVpowerCard = () => {
	const { formatMessage } = useIntl();
	const { projectData } = useProjectContext();
	const { projectPower, projectFuturePower } = projectData!;

	return (
		<GIVpowerCardWrapper>
			<Flex gap='8px' alignItems='center'>
				<IconRocketInSpace24 />
				<Subline>
					{formatMessage({
						id: 'label.givpower_rank',
					})}
				</Subline>
				<IconWithTooltip
					icon={<IconHelpFilled16 />}
					direction={'bottom'}
				>
					<BoostTooltip>
						{formatMessage({
							id: 'label.boost_this_project_with_givpower_to_improve_its_rank',
						})}
					</BoostTooltip>
				</IconWithTooltip>
			</Flex>
			<CurrentRankSection>
				<Lead>{formatMessage({ id: 'label.current_rank' })}</Lead>
				<CurrentRank projectPower={projectPower} />
				<Flex gap='8px'>
					<IconInfoOutline16 />
					<div>
						<Caption>
							The rank will update at the start of the
							<b> next GIVbacks round</b> .
						</Caption>
					</div>
				</Flex>
			</CurrentRankSection>
			<NextRankSection>
				<Flex alignItems='center' justifyContent='space-between'>
					<P>
						{formatMessage({
							id: 'label.projected_rank',
						})}
					</P>
					<NextRank
						projectPower={projectPower}
						projectFuturePower={projectFuturePower}
					/>
				</Flex>
				<Separator />
				<Flex gap='8px'>
					<IconInfoOutline16 />
					<div>
						<Caption>
							This is the expected rank for the next round based
							on <b>current GIVpower</b>.
						</Caption>
					</div>
				</Flex>
			</NextRankSection>
			<Separator />
			<Desc>Boost this project with GIVpower to improve its rank!</Desc>
		</GIVpowerCardWrapper>
	);
};

const GIVpowerCardWrapper = styled.div`
	padding: 24px;
	background: ${neutralColors.gray[100]};
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 16px;
`;

const CurrentRankSection = styled.div`
	margin: 32px 0 40px;
`;

const NextRankSection = styled.div`
	padding: 16px;
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 16px;
	margin-bottom: 40px;
`;

const Separator = styled.div`
	margin: 16px 0;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const Desc = styled(B)`
	text-align: center;
`;

const BoostTooltip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	${mediaQueries.tablet} {
		width: 260px;
	}
`;
