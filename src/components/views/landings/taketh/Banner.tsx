import styled from 'styled-components';
import { H3, mediaQueries } from '@giveth/ui-design-system';
import Image from 'next/image';
import TakethHandImage from 'public/images/taketh-hand.png';

const Banner = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<H3>Taketh</H3>
				<H3 weight={700}>Building the Future of Taking</H3>
				<HandIcon>
					<Image
						src={TakethHandImage}
						alt='Taketh Hand'
						width={249}
						height={360}
					/>
				</HandIcon>
			</InnerWrapper>
		</Wrapper>
	);
};

const HandIcon = styled.div`
	position: absolute;
	right: 0;
	bottom: -10px;
	display: none;
	${mediaQueries.laptopS} {
		display: unset;
	}
`;

const InnerWrapper = styled.div`
	overflow: hidden;
	position: relative;
	border-radius: 16px;
	height: 385px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	color: white;
	max-width: 1200px;
	padding-left: 34px;
	background-image: url('/images/taketh-banner.jpg');
	${mediaQueries.tablet} {
		padding-left: 84px;
	}
	${mediaQueries.laptopL} {
		padding-left: 144px;
	}
`;

const Wrapper = styled.div`
	margin: 40px auto 0;
	padding: 0 24px;
	${mediaQueries.tablet} {
		max-width: 1280px;
		padding: 0 40px;
	}
`;

export default Banner;
