import Image from 'next/image';
import WalletIcon from '/public/images/wallet_donate_tab.svg';
import { Shadow } from '@/components/styled-components/Shadow';
import {
	Subline,
	H2,
	neutralColors,
	H5,
	brandColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

const ProjectTotalFundCard = (props: {
	address?: string;
	totalFund?: number;
}) => {
	const { address, totalFund } = props;
	return (
		<Wrapper>
			<UpperSection>
				<div>
					<Subline>All time funding received</Subline>
					<H2>{'$' + totalFund}</H2>
				</div>
				<div>
					<Subline>Funding from Traces</Subline>
					<FromTraces>$50.32</FromTraces>
				</div>
			</UpperSection>
			<BottomSection>
				<Image src={WalletIcon} alt='wallet icon' />
				<Subline>{address}</Subline>
			</BottomSection>
		</Wrapper>
	);
};

const BottomSection = styled.div`
	background: ${neutralColors.gray[200]};
	padding: 9.5px 22px;
	display: flex;
	gap: 8px;
	color: ${neutralColors.gray[500]};
`;

const FromTraces = styled(H5)`
	margin-top: 12px;
	font-weight: 400;
`;

const UpperSection = styled.div`
	padding: 24px 21px 16px 21px;
	color: ${brandColors.deep[800]};
	text-transform: uppercase;
	display: flex;
	flex-wrap: wrap;
	gap: 40px 150px;
`;

const Wrapper = styled.div`
	background: white;
	max-width: 750px;
	margin-right: 30px;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[400]};
	overflow: hidden;
`;

export default ProjectTotalFundCard;
