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

const WhatAreGIVbacks = () => {
	return (
		<OuterWrapper>
			<Wrapper>
				<H4 weight={700}>What are GIVbacks?</H4>
				<H4>
					Ever wondered if there could be more to giving than just a
					heartfelt thank-you? Enter GIVbacks!
					<br />
					<br />
					GIVbacks are GIV tokens that you receive every time you
					donate to a verified project on Giveth. Think of them like a
					tax deduction on your donation, but instead of needing to
					fill a form or get a government rebate, you are given GIV
					tokens directly to your wallet!
					<br />
					<br />
					Let’s give an example of how this works. Let’s say you
					donate $100 to a verified project on Giveth. Based on a
					project's real-time ranking, you could receive up to $70
					back in GIV token rewards just for donating! Some of this
					amount would be given to you right away (within a 2 week
					period), and some of it would be streamed to you over the
					next few years.
					<br />
					<br />
					You can then use those GIV rewards to either take part in
					the governance of the Giveth DAO, earn yield in our GIVfarm,
					donate to other projects, or cash out your GIV rewards.
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
	display: none;
	${mediaQueries.laptopL} {
		display: block;
	}
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

export default WhatAreGIVbacks;
