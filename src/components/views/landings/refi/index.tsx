import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import GetUpdates from '@/components/GetUpdates';
import JoinUsOnDiscord from '@/components/JoinUsOnDiscord';
import QuoteSection from '@/components/views/landings/refi/QuoteSection';
import ReFiHeader from '@/components/views/landings/refi/ReFiHeader';
import Divider from '@/components/Divider';
import GivethTheRevolutionary from '@/components/views/landings/refi/GivethTheRevolutionary';
import FirstOfAll from '@/components/views/landings/refi/FirstOfAll';

const ReFiLandingPage = () => {
	return (
		<Wrapper>
			<ReFiHeader />
			<GivethTheRevolutionary />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<FirstOfAll />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<JoinUsOnDiscord />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<QuoteSection />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<GetUpdates />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	width: 100%;
	background: white;
	overflow: auto;
`;

export default ReFiLandingPage;
