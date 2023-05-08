import {
	Caption,
	IconHelpFilled16,
	IconInfoOutline16,
	IconRocketInSpace24,
	Lead,
	P,
	Subline,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { BoostTooltip } from '../projectDonateCard/ProjectDonateCard';
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
				<Flex>
					<IconInfoOutline16 />
					<div>
						<Caption>
							The rank will update at the start of the next
							GIVbacks round.
						</Caption>
					</div>
				</Flex>
			</CurrentRankSection>
			<NextRankSection>
				<Flex>
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
			</NextRankSection>
		</GIVpowerCardWrapper>
	);
};

const GIVpowerCardWrapper = styled.div`
	padding: 24px;
	background: ${neutralColors.gray[100]};
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 16px;
`;

const CurrentRankSection = styled.div``;

const NextRankSection = styled.div`
	border: 1px solid ${neutralColors.gray[300]};
	border-radius: 16px;
`;
