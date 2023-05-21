import styled from 'styled-components';
import Header from '@/components/views/landings/getStarted/Header';
import WhatIsGiveth from '@/components/views/landings/getStarted/WhatIsGiveth';
import WhatIsGiv from '@/components/views/landings/getStarted/WhatIsGiv';
import ReadyToGive from '@/components/views/landings/getStarted/ReadyToGive';
import DonateToProject from '@/components/views/landings/getStarted/DonateToProject';
import FundraiseForYou from '@/components/views/landings/getStarted/FundraiseForYou';
import JoinOurCommunity from '@/components/views/landings/getStarted/JoinOurCommunity';

const GetStarted = () => {
	return (
		<Wrapper>
			<Header />
			<WhatIsGiveth />
			<WhatIsGiv />
			<ReadyToGive />
			<DonateToProject />
			<FundraiseForYou />
			<JoinOurCommunity />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin: 0 auto;
	max-width: 1200px;
	width: 100%;
	padding: 40px;
`;

export default GetStarted;
