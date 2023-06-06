import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import Header from '@/components/views/landings/web3CryptoDonation/Header';
import Body from '@/components/views/landings/web3CryptoDonation/Body';
import GetUpdates from '@/components/GetUpdates';
import JoinUsOnDiscord from '@/components/JoinUsOnDiscord';
import QuoteSection from '@/components/views/landings/refi/QuoteSection';

const ReFiLandingPage = () => {
	return (
		<Wrapper>
			<Header />
			<Body />
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
`;

export default ReFiLandingPage;
