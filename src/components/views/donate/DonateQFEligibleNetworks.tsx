import {
	Caption,
	IconInfoFilled16,
	brandColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useNetwork } from 'wagmi';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import SwitchNetwork from '@/components/modals/SwitchNetwork';
import { useDonateData } from '@/context/donate.context';
import { getActiveRound } from '@/helpers/qf';
import { SwitchCaption } from './common.styled';

const DonateQFEligibleNetworks = () => {
	const [showModal, setShowModal] = React.useState(false);
	const { project } = useDonateData();
	const { chains } = useNetwork();
	const { formatMessage } = useIntl();

	const activeRound = getActiveRound(project.qfRounds);

	const eligibleChainNames = chains
		.filter(chain => activeRound?.eligibleNetworks?.includes(chain.id))
		?.map(chain => chain.name);

	console.log('activeRoundd', eligibleChainNames);

	return (
		<Container>
			<Flex justifyContent='space-between' alignItems='center'>
				<MakeDonationTitle>
					<Flex alignItems='center' gap='4px'>
						<IconInfoFilled16 />
						Make your donation eligible for matching
					</Flex>
				</MakeDonationTitle>
				<CustomSwitchCaption onClick={() => setShowModal(true)}>
					{formatMessage({ id: 'label.switch_network' })}
				</CustomSwitchCaption>
			</Flex>
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

const CustomSwitchCaption = styled(SwitchCaption)`
	margin: 0;
	font-weight: 500;
`;

export default DonateQFEligibleNetworks;
