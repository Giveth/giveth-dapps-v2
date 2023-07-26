import styled from 'styled-components';
import {
	brandColors,
	H4,
	mediaQueries,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import Plus from '@/components/particles/Plus';
import ArcWithDot from '@/components/particles/ArcWithDot';

const FirstOfAll = () => {
	return (
		<OuterWrapper>
			<Wrapper>
				<H4 weight={700}>First of all, what is ReFi?</H4>
				<H4>
					Regenerative Finance, or ReFi, is a movement that recognizes
					the potential of blockchain, or crypto technology, and web3
					to drive positive change in addressing climate change,
					supporting conservation efforts, promoting biodiversity and
					more. It aims to leverage the transformative capabilities of
					decentralized technologies to foster regenerative practices
					in the financial sector.
				</H4>
			</Wrapper>
			<PlusWrapper>
				<Plus color={semanticColors.jade[400]} />
			</PlusWrapper>
			<ArcWrapper>
				<ArcWithDot color={brandColors.mustard[500]} />
			</ArcWrapper>
		</OuterWrapper>
	);
};

const ArcWrapper = styled.div`
	position: absolute;
	top: 122px;
	left: -20px;
	transform: rotate(200deg);
`;

const OuterWrapper = styled.div`
	position: relative;
`;

const PlusWrapper = styled.div`
	position: absolute;
	right: 53px;
	bottom: 226px;
	display: none;
	${mediaQueries.laptopL} {
		display: block;
	}
`;

const Wrapper = styled.div`
	max-width: 1180px;
	padding: 120px 30px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
	> *:first-child {
		margin-bottom: 16px;
	}
`;

export default FirstOfAll;
