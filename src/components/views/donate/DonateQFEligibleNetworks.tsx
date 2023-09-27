import {
	Caption,
	IconInfoFilled16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import SwitchNetwork from '@/components/modals/SwitchNetwork';
import { useDonateData } from '@/context/donate.context';
import { getActiveRound } from '@/helpers/qf';
import { SwitchCaption } from './common.styled';
import { chainNameById } from '@/lib/network';

const DonateQFEligibleNetworks = () => {
	const [showModal, setShowModal] = useState(false);
	const { project } = useDonateData();
	const { formatMessage } = useIntl();

	const activeRound = getActiveRound(project.qfRounds);

	const eligibleChainNames = activeRound?.eligibleNetworks.map(network =>
		chainNameById(network),
	);

	const chainsString = eligibleChainNames?.join(' & ');

	console.log('activeRoundd', eligibleChainNames);

	return (
		<Container>
			<Flex justifyContent='space-between' alignItems='center'>
				<MakeDonationTitle>
					<Flex alignItems='center' gap='4px'>
						<IconInfoFilled16 />
						{formatMessage({
							id: 'label.make_your_donation_eligible_for_matching',
						})}
					</Flex>
				</MakeDonationTitle>
				<CustomSwitchCaption onClick={() => setShowModal(true)}>
					{formatMessage({ id: 'label.switch_network' })}
				</CustomSwitchCaption>
			</Flex>
			<MakeDonationDescription>
				{formatMessage({ id: 'label.donations_made_on' })}
				&nbsp; <BoldCaption>{chainsString}</BoldCaption> &nbsp;
				{formatMessage({ id: 'label.are_eligible_to_be_matched' })}
			</MakeDonationDescription>
			{showModal && (
				<SwitchNetwork
					setShowModal={setShowModal}
					customNetworks={activeRound?.eligibleNetworks}
				/>
			)}
		</Container>
	);
};

const Container = styled.div`
	margin-top: 8px;
	border: 1px solid ${brandColors.giv[500]};
	border-radius: 8px;
	padding: 16px 8px;
`;

const MakeDonationTitle = styled(Caption)`
	color: ${brandColors.giv[500]};
`;

const MakeDonationDescription = styled(Caption)`
	width: 100%;
	display: inline-block;
	margin-top: 8px;
	padding-top: 8px;
	border-top: 1px solid ${neutralColors.gray[400]};
	color: ${neutralColors.gray[700]};
`;

const BoldCaption = styled(Caption)`
	font-weight: 500;
	display: inline;
`;

const CustomSwitchCaption = styled(SwitchCaption)`
	margin: 0;
	font-weight: 500;
`;

export default DonateQFEligibleNetworks;
