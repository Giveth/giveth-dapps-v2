import Image from 'next/image';
import styled from 'styled-components';
import {
	Subline,
	H2,
	neutralColors,
	H5,
	brandColors,
} from '@giveth/ui-design-system';

import WalletIcon from '/public/images/wallet_donate_tab.svg';
import { Shadow } from '@/components/styled-components/Shadow';
import { IProject } from '@/apollo/types/types';

const ProjectTotalFundCard = (props: { project?: IProject }) => {
	const {
		totalDonations,
		walletAddress,
		traceCampaignId,
		totalTraceDonations,
	} = props.project || {};

	return (
		<Wrapper>
			<UpperSection>
				<div>
					<Subline>All time funding received</Subline>
					<TotalFund>{'$' + totalDonations}</TotalFund>
				</div>
				{!!traceCampaignId && (
					<div>
						<Subline>Funding from Traces</Subline>
						<FromTraces>{'$' + totalTraceDonations}</FromTraces>
					</div>
				)}
			</UpperSection>
			<BottomSection>
				<Image src={WalletIcon} alt='wallet icon' />
				<Subline>{walletAddress}</Subline>
			</BottomSection>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background: white;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[400]};
	overflow: hidden;
`;

const UpperSection = styled.div`
	padding: 24px 21px 16px 21px;
	color: ${brandColors.deep[800]};
	text-transform: uppercase;
	display: flex;
	flex-wrap: wrap;
	gap: 40px 150px;
`;

const TotalFund = styled(H2)`
	font-weight: 700;
`;

const FromTraces = styled(H5)`
	margin-top: 12px;
	font-weight: 400;
`;

const BottomSection = styled.div`
	background: ${neutralColors.gray[200]};
	padding: 9.5px 22px;
	display: flex;
	gap: 8px;
	color: ${neutralColors.gray[500]};
`;

export default ProjectTotalFundCard;
