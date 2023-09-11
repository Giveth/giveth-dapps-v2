import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import GetUpdates from '@/components/GetUpdates';
import GIVBacksHeader from '@/components/views/landings/GIVBacks/GIVBacksHeader';
import YouKnowHow from '@/components/views/landings/GIVBacks/YouKnowHow';
import Divider from '@/components/Divider';
import WhatAreGIVbacks from '@/components/views/landings/GIVBacks/WhatAreGIVbacks';
import OfTheDonors from '@/components/views/landings/GIVBacks/OfTheDonors';
import WhatMakesGIVbacks from '@/components/views/landings/GIVBacks/WhatMakesGIVbacks';
import HowGIVbacksWork from '@/components/views/landings/GIVBacks/HowGIVbacksWork';
import WhatCanYouDo from '@/components/views/landings/GIVBacks/WhatCanYouDo';
import JoinTheRevolution from '@/components/views/landings/GIVBacks/JoinTheRevolution';
import GiveAndGetGIVback from '@/components/views/landings/GIVBacks/GiveAndGetGIVback';

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
			<Divider color={neutralColors.gray[200]} height='40px' />
			<HowGIVbacksWork />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<WhatCanYouDo />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<JoinTheRevolution />
			<Divider color={neutralColors.gray[200]} height='40px' />
			<GiveAndGetGIVback />
			<Divider color={neutralColors.gray[200]} height='100px' />
			<GetUpdates />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background: white;
`;

export default GIVBacksIndex;
