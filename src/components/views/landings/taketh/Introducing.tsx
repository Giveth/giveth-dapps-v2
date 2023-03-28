import { Lead, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	H3Styled,
	Wrapper,
} from '@/components/views/landings/taketh/common.styled';
import ArcWithDot from '@/components/particles/ArcWithDot';

const Introducing = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<H3Styled weight={700}>Introducing: Taketh.</H3Styled>
				<Lead size='large'>
					We want to try something a little bit different. Frankly,
					we're getting a little tired of the work Giveth is doing in
					Building the Future of Giving and changing the world for the
					better. Who needs that? That's why we're hard forking Giveth
					into a new project. the Taketh.
				</Lead>
				<Arc>
					<ArcWithDot />
				</Arc>
			</InnerWrapper>
		</Wrapper>
	);
};

const InnerWrapper = styled.div`
	padding: 10px;
`;

const Arc = styled.div`
	position: absolute;
	right: 0;
	top: 40px;
	${mediaQueries.mobileL} {
		top: 80px;
	}
`;

export default Introducing;
