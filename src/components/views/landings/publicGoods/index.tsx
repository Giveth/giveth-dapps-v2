import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import PublicGoodsHeader from '@/components/views/landings/publicGoods/header';
import GivethIsTheOnly from '@/components/views/landings/publicGoods/GivethIsTheOnly';
import WhatArePublicGoods from '@/components/views/landings/publicGoods/WhatArePublicGoods';
import PublicGoodsAre from '@/components/views/landings/publicGoods/PublicGoodsAre';
import PublicGoodsFunding from '@/components/views/landings/publicGoods/PublicGoodsFunding';
import JoinUsOnDiscord from '@/components/JoinUsOnDiscord';
import GetUpdates from '@/components/GetUpdates';

const PublicGoods = () => {
	return (
		<Wrapper>
			<PublicGoodsHeader />
			<GivethIsTheOnly />
			<WhatArePublicGoods />
			<PublicGoodsAre />
			<PublicGoodsFunding />
			<JoinUsWrapper>
				<JoinUsOnDiscord />
			</JoinUsWrapper>
			<GetUpdates />
		</Wrapper>
	);
};

const JoinUsWrapper = styled.div`
	background: white;
	margin-bottom: 40px;
`;

const Wrapper = styled.div`
	background: ${neutralColors.gray[200]};
	color: ${neutralColors.gray[900]};
	margin-bottom: 60px;
`;

export default PublicGoods;
