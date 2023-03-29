import { brandColors, Lead, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	H3Styled,
	Wrapper,
} from '@/components/views/landings/taketh/common.styled';
import QuarterArc from '@/components/particles/QuarterArc';

const WhatIsTaketh = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<H3Styled weight={700}>What is Taketh?</H3Styled>
				<Lead size='large'>
					Taketh is Building the Future of Taking. Our mission is to
					transform the way we extract funds from private goods by
					milking users within our C.A.O: Centralized Acquisitive
					Organization. 🐄 Our CAO's vision is to promote degen
					economics through centralized authority and opaqueness.
				</Lead>
				<Arc>
					<QuarterArc color={brandColors.giv[200]} />
				</Arc>
			</InnerWrapper>
		</Wrapper>
	);
};

const Arc = styled.div`
	position: absolute;
	top: 0;
	left: 450px;
	transform: rotate(180deg);
	display: none;
	${mediaQueries.tablet} {
		display: unset;
	}
`;

const InnerWrapper = styled.div`
	padding: 40px 10px;
`;

export default WhatIsTaketh;
