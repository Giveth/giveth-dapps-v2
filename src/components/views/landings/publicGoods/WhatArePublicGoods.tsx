import { brandColors, H4, semanticColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	PublicGoodsOuterWrapper,
	PublicGoodsWrapper,
} from '@/components/views/landings/publicGoods/common.styles';
import Plus from '@/components/particles/Plus';
import { Absolute } from '@/components/styled-components/Position';
import ArcWithDot from '@/components/particles/ArcWithDot';

const WhatArePublicGoods = () => {
	return (
		<PublicGoodsOuterWrapper>
			<PublicGoodsWrapper>
				<InnerWrapper>
					<div>What are public goods?</div>
					<div>
						Public goods are commodities or services that benefit
						all members of a community, often offered free of
						charge. The cost is typically covered by government
						entities, meaning that public goods are often financed
						via taxes. Some examples are public education, roads,
						street lighting, parks, law enforcement and military.
					</div>
				</InnerWrapper>
			</PublicGoodsWrapper>
			<PlusWrapper>
				<Plus color={semanticColors.jade[400]} />
			</PlusWrapper>
			<AcrWrapper>
				<ArcWithDot color={brandColors.mustard[500]} />
			</AcrWrapper>
		</PublicGoodsOuterWrapper>
	);
};

const AcrWrapper = styled(Absolute)`
	left: -10px;
	top: 80px;
	transform: rotate(190deg);
`;

const PlusWrapper = styled(Absolute)`
	right: 60px;
	bottom: 180px;
	display: none;
`;

const InnerWrapper = styled(H4)`
	padding: 80px 0;
	*:first-child {
		margin-bottom: 16px;
		font-weight: 700;
	}
`;

export default WhatArePublicGoods;
