import { Caption, neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { getActiveRound } from '@/helpers/qf';
import { getChainName } from '@/lib/network';
import { useProjectContext } from '@/context/project.context';

const ProjectEligibleQFChains = () => {
	const { projectData } = useProjectContext();
	const { formatMessage } = useIntl();

	const activeRound = getActiveRound(projectData?.qfRounds);

	const eligibleChainNames = activeRound?.eligibleNetworks.map(network =>
		getChainName(network),
	);

	const chainsString = eligibleChainNames?.join(' & ');

	return (
		<Container>
			<MakeDonationDescription>
				{formatMessage({ id: 'label.donations_made_on' })}
				&nbsp; <BoldCaption>{chainsString}</BoldCaption> &nbsp;
				{formatMessage({ id: 'label.are_eligible_to_be_matched' })}
			</MakeDonationDescription>
		</Container>
	);
};

const Container = styled.div`
	border-radius: 8px;
	padding: 16px 0;
`;

const MakeDonationDescription = styled(Caption)`
	width: 100%;
	display: inline-block;
	color: ${neutralColors.gray[700]};
`;

const BoldCaption = styled(Caption)`
	font-weight: 500;
	display: inline;
`;

export default ProjectEligibleQFChains;
