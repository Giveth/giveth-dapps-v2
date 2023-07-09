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
import VerificationBadge from '@/components/VerificationBadge';
import { Badge, EBadgeStatus } from '@/components/Badge';

export const ProjectStats = () => {
	const { formatMessage } = useIntl();
	const { projectData } = useProjectContext();

	console.log(
		'projectData?.verificationFormStatus',
		projectData?.verificationFormStatus,
		projectData?.verified,
	);
	return (
		<div>
			<Title>{formatMessage({ id: 'label.project_stats' })}</Title>
			<Flex flexDirection='column' gap='24px'>
				<StatRow justifyContent='space-between'>
					<Flex alignItems='center' gap='4px'>
						<P>{formatMessage({ id: 'label.project_status' })}</P>
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
						<P>{formatMessage({ id: 'label.listing' })}</P>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction='bottom'
						>
							<StatTooltip>Listing</StatTooltip>
						</IconWithTooltip>
					</Flex>
					<ListingBadge listed={projectData?.listed} />
				</StatRow>
				<StatRow justifyContent='space-between'>
					<Flex alignItems='center' gap='4px'>
						<P>
							{formatMessage({ id: 'label.verification_status' })}
						</P>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction='bottom'
						>
							<StatTooltip>Verification status</StatTooltip>
						</IconWithTooltip>
					</Flex>
					{projectData?.verified ? (
						<Badge label='Verified' status={EBadgeStatus.SUCCESS} />
					) : projectData?.verificationFormStatus ? (
						<VerificationBadge
							status={projectData?.verificationFormStatus}
						/>
					) : (
						<Badge
							label='Not verified'
							status={EBadgeStatus.DEFAULT}
						/>
					)}
				</StatRow>
			</Flex>
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
