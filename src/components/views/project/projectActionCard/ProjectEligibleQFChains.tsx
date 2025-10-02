import { Caption, neutralColors, SublineBold } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { getActiveRound } from '@/helpers/qf';
import { useProjectContext } from '@/context/project.context';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import config from '@/configuration';
import { EProjectType } from '@/apollo/types/gqlEnums';

const ProjectEligibleQFChains = () => {
	const { projectData } = useProjectContext();
	const { formatMessage } = useIntl();

	const { activeStartedRound } = getActiveRound(projectData?.qfRounds);
	const projectType = projectData?.projectType;
	const causesAcceptedNetworks = config.CAUSES_CONFIG.acceptedNetworks;

	// conditional check if project or cause has an address for this network
	function checkEligibleAddresses(network: number) {
		if (projectType === EProjectType.CAUSE) {
			return causesAcceptedNetworks?.includes(network);
		} else {
			return projectData?.addresses?.some(
				address => address.networkId === network && address.isRecipient,
			);
		}
	}
	return (
		<Container>
			<Wrapper>
				<Caption $medium>
					{formatMessage({
						id: 'label.eligible_networks_for_matching',
					})}
				</Caption>
				<IconsWrapper>
					{activeStartedRound?.eligibleNetworks?.map(network => {
						// Check if project or cause has an address for this network
						const hasAddresses = checkEligibleAddresses(network);

						// Only render if project or cause has an address for this network
						return hasAddresses ? (
							<IconWithTooltip
								icon={
									<TooltipIconWrapper>
										{config.NETWORKS_CONFIG_WITH_ID[
											network
										]?.chainLogo(24)}
									</TooltipIconWrapper>
								}
								direction='top'
								align='top'
								key={network}
							>
								<SublineBold>
									{
										config.NETWORKS_CONFIG_WITH_ID[network]
											?.name
									}
								</SublineBold>
							</IconWithTooltip>
						) : null;
					})}
				</IconsWrapper>
			</Wrapper>
		</Container>
	);
};

const Container = styled.div`
	border-radius: 8px;
	padding: 16px 0;
`;

const TooltipIconWrapper = styled.div`
	margin-top: 4px;
`;

const IconsWrapper = styled.div`
	margin-top: 14px;
	display: flex;
	flex-wrap: wrap; /* Allow content to wrap to the next line */
	max-width: 100%; /* Ensure the content does not exceed the width of the parent */
	max-height: 100%; /* Ensure the content does not exceed the height of the parent */
	gap: 8px;
`;

const Wrapper = styled.div`
	border-radius: 8px;
	background: ${neutralColors.gray[100]};
	color: ${neutralColors.gray[800]};
`;
export default ProjectEligibleQFChains;
