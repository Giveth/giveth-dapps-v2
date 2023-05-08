import {
	IconHelpFilled16,
	P,
	SemiTitle,
	Subline,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { useProjectContext } from '@/context/project.context';
import StatusBadge from './StatusBadge';
import ListingBadge from '@/components/ListingBadge';

export const ProjectStats = () => {
	const { formatMessage } = useIntl();
	const { projectData } = useProjectContext();
	return (
		<div>
			<Title>{formatMessage({ id: 'label.project_stats' })}</Title>
			<StatRow justifyContent='space-between'>
				<Flex alignItems='center' gap='4px'>
					<P>Project status</P>
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction='bottom'
					>
						<StatTooltip>Project status</StatTooltip>
					</IconWithTooltip>
				</Flex>
				<StatusBadge status={projectData?.status.name} />
			</StatRow>
			<StatRow justifyContent='space-between'>
				<Flex alignItems='center' gap='4px'>
					<P>Listing</P>
					<IconWithTooltip
						icon={<IconHelpFilled16 />}
						direction='bottom'
					>
						<StatTooltip>Listing</StatTooltip>
					</IconWithTooltip>
				</Flex>
				<ListingBadge listed={projectData?.listed} />
			</StatRow>
		</div>
	);
};

const Title = styled(SemiTitle)`
	font-weight: 500;
	padding-bottom: 16px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	margin-bottom: 16px;
`;

const StatRow = styled(Flex)``;

const StatTooltip = styled(Subline)`
	max-width: 200px;
`;
