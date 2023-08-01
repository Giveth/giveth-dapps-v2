import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import PublicGoodsHeader from '@/components/views/landings/publicGoods/header';
import GivethIsTheOnly from '@/components/views/landings/publicGoods/GivethIsTheOnly';
import WhatArePublicGoods from '@/components/views/landings/publicGoods/WhatArePublicGoods';
import PublicGoodsAre from '@/components/views/landings/publicGoods/PublicGoodsAre';
import PublicGoodsFunding from '@/components/views/landings/publicGoods/PublicGoodsFunding';
import JoinUsOnDiscord from '@/components/JoinUsOnDiscord';

const PublicGoods = () => {
	return (
		<Wrapper>
			<PublicGoodsHeader />
			<GivethIsTheOnly />
			<WhatArePublicGoods />
			<PublicGoodsAre />
			<PublicGoodsFunding />
			<JoinUsOnDiscord />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background: ${neutralColors.gray[200]};
	color: ${neutralColors.gray[900]};
`;

export default PublicGoods;
