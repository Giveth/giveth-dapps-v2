import { brandColors, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	H3Styled,
	Wrapper,
} from '@/components/views/landings/taketh/common.styled';
import QuarterArc from '@/components/particles/QuarterArc';

const WantIn = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<H3Styled weight={700}>Want in?</H3Styled>
				<Lead size='large'>
					Simply DM us your private keys or seed phrase for a chance
					to enter our airdrop. (which also may or may not happen)
				</Lead>
				<ArcWrapper>
					<QuarterArc color={brandColors.mustard[500]} />
				</ArcWrapper>
			</InnerWrapper>
		</Wrapper>
	);
};

const ArcWrapper = styled.div`
	position: absolute;
	left: -15px;
	top: -5px;
`;

const InnerWrapper = styled.div`
	position: relative;
	padding: 10px;
`;

export default WantIn;
