import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import GetUpdates from '@/components/GetUpdates';
import JoinUsOnDiscord from '@/components/JoinUsOnDiscord';
import QuoteSection from '@/components/views/landings/refi/QuoteSection';
import ReFiHeader from '@/components/views/landings/refi/ReFiHeader';
import ReFiBody from '@/components/views/landings/refi/body';

const ReFiLandingPage = () => {
	return (
		<Wrapper>
			<ReFiHeader />
			<ReFiBody />
			<Separator />
			<JoinUsOnDiscord />
			<Separator />
			<QuoteSection />
			<Separator />
			<GetUpdates />
		</Wrapper>
	);
};

const Separator = styled.div`
	background: ${neutralColors.gray[200]};
	width: 100%;
	height: 40px;
`;

const Wrapper = styled.div`
	width: 100%;
	background: white;
	overflow: auto;
`;

export default ReFiLandingPage;
