import styled from 'styled-components';
import { brandColors, neutralColors, H1, H3 } from '@giveth/ui-design-system';
import Wave from '@/components/particles/Wave';
import { mediaQueries } from '@/lib/constants/constants';

const GIVBacksHeader = () => {
	return (
		<OuterWrapper>
			<Wrapper>
				<Title>
					<H1 weight={700}>Get Rewarded for Donating</H1>
					<H3>When you give, you get GIV back!</H3>
				</Title>
				<WaveWrapper>
					<Wave color={brandColors.pinky[400]} />
				</WaveWrapper>
			</Wrapper>
		</OuterWrapper>
	);
};

const WaveWrapper = styled.div`
	position: absolute;
	left: 0;
	top: 254px;
`;

const Title = styled.div`
	padding: 40px;
	background: white;
	margin: 20px;
	color: ${brandColors.giv[700]};
	border-radius: 16px;
	max-width: 910px;
	z-index: 1;
	> h3:last-child {
		margin-top: 25px;
	}
	${mediaQueries.tablet} {
		margin: 50px;
	}
`;

const OuterWrapper = styled.div`
	background: ${neutralColors.gray[200]};
	padding: 40px 10px;
	${mediaQueries.tablet} {
		padding: 40px;
	}
`;

const Wrapper = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	border-radius: 16px;
	background-image: url('/images/banners/categories/all.png');
	background-size: cover;
	height: 630px;
	width: 100%;
	color: white;
	display: flex;
	position: relative;
	align-items: flex-end;
	> h1 {
		margin: 0 50px;
	}
`;

export default GIVBacksHeader;
