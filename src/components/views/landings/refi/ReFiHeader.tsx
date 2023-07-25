import styled from 'styled-components';
import { H1 } from '@giveth/ui-design-system';
import { brandColors } from '@giveth/ui-design-system/lib/esm/common/colors';
import Wave from '@/components/particles/Wave';
import { mediaQueries } from '@/lib/constants/constants';

const ReFiHeader = () => {
	return (
		<OuterWrapper>
			<Wrapper>
				<Title>
					<H1 weight={700}>
						ReFi: Regenerative Finance, Our Hope for the Planet
					</H1>
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
	${mediaQueries.tablet} {
		margin: 50px;
	}
`;

const OuterWrapper = styled.div`
	padding: 0 10px;
	${mediaQueries.tablet} {
		padding: 0 40px;
	}
`;

const Wrapper = styled.div`
	max-width: 1200px;
	margin: 80px auto;
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

export default ReFiHeader;
