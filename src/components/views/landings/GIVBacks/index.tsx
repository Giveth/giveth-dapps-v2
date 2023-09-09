import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import GetUpdates from '@/components/GetUpdates';
import GIVBacksHeader from '@/components/views/landings/GIVBacks/GIVBacksHeader';
import YouKnowHow from '@/components/views/landings/GIVBacks/YouKnowHow';
import Divider from '@/components/Divider';
import WhatAreGIVbacks from '@/components/views/landings/GIVBacks/WhatAreGIVbacks';
import OfTheDonors from '@/components/views/landings/GIVBacks/OfTheDonors';
import WhatMakesGIVbacks from '@/components/views/landings/GIVBacks/WhatMakesGIVbacks';

const GIVBacksIndex = () => {
	return (
		<Wrapper>
			<GIVBacksHeader />
			<YouKnowHow />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<WhatAreGIVbacks />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<OfTheDonors />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<WhatMakesGIVbacks />
			<GetUpdates />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background: white;
`;

export default GIVBacksIndex;
