import styled from 'styled-components';
import Banner from '@/components/views/landings/taketh/Banner';
import Introducing from '@/components/views/landings/taketh/Introducing';
import HowDoesItWork from '@/components/views/landings/taketh/HowDoesItWork';
import WantIn from '@/components/views/landings/taketh/WantIn';
import WhatIsTaketh from '@/components/views/landings/taketh/WhatIsTaketh';

const Taketh = () => {
	return (
		<Wrapper>
			<Banner />
			<Introducing />
			<WhatIsTaketh />
			<HowDoesItWork />
			<WantIn />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin: 40px 0 140px;
`;

export default Taketh;
