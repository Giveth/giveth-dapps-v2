import {
	IconRocketInSpace24,
	IconHelpFilled16,
	Subline,
	neutralColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { Flex } from '@/components/styled-components/Flex';
import { BoostTooltip } from '../projectDonateCard/ProjectDonateCard';
import { CurrentRank, NextRank } from '@/components/GIVpowerRank';
import { useProjectContext } from '@/context/project.context';

export const GIVPowerSection = () => {
	const { formatMessage } = useIntl();
	const { projectData } = useProjectContext();
	const { projectPower, projectFuturePower } = projectData!;

	return (
		<GIVPowerSectionWrapper>
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
			<CurrentRank projectPower={projectPower} />
			<Flex justifyContent='space-between' alignItems='center'>
				<Subline>
					{formatMessage({
						id: 'label.projected_rank',
					})}
				</Subline>
				<NextRank
					projectPower={projectPower}
					projectFuturePower={projectFuturePower}
				/>
			</Flex>
		</GIVPowerSectionWrapper>
	);
};

const GIVPowerSectionWrapper = styled.div`
	border-top: 1px solid ${neutralColors.gray[500]};
	padding-top: 16px;
`;
