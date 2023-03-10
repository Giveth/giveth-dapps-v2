import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import EventBanner from '@/components/views/landings/EthDenver/EventBanner';
import EventDetails from '@/components/views/landings/EthDenver/EventDetails';
import GivethTalks from '@/components/views/landings/EthDenver/givethTalks';
import GivethSwag from '@/components/views/landings/EthDenver/GivethSwag';
import ImpactQuest from '@/components/views/landings/EthDenver/impactQuest';
import SupportUs from '@/components/views/landings/EthDenver/SupportUs';
import { IEthDenverProps } from 'pages/landings/ethdenver';
import GetUpdates from '@/components/GetUpdates';

const EthDenverView: FC<IEthDenverProps> = ({ campaign }) => {
	return (
		<Wrapper>
			<EventBanner />
			<Separator />
			<EventDetails />
			<Separator />
			<GivethTalks />
			<Separator />
			<GivethSwag />
			<Separator />
			<ImpactQuest campaign={campaign} />
			<Separator />
			<SupportUs />
			<Separator />
			<Separator />
			<GetUpdates />
		</Wrapper>
	);
};

const Separator = styled.div`
	width: 100%;
	height: 40px;
	background: ${neutralColors.gray[200]};
`;

const Wrapper = styled.div`
	background: white;
	overflow-x: hidden;
	width: 100vw;
`;

export default EthDenverView;
