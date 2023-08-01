import styled from 'styled-components';
import { brandColors, H1, neutralColors } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';

const PublicGoodsHeader = () => {
	return (
		<OuterWrapper>
			<Wrapper>
				<Title weight={700}>
					Public Goods in Crypto and Web3 : Funding the Future
				</Title>
			</Wrapper>
		</OuterWrapper>
	);
};

const Title = styled(H1)`
	color: ${brandColors.giv[700]};
	padding: 40px;
	background: white;
	border-radius: 16px;
	max-width: 940px;
`;

const OuterWrapper = styled.div`
	background: ${neutralColors.gray[200]};
	padding: 0 10px 40px;
	${mediaQueries.tablet} {
		padding: 0 40px 40px;
	}
`;

const Wrapper = styled.div`
	max-width: 1200px;
	padding: 50px;
	margin: 40px auto;
	border-radius: 16px;
	background-image: url('/images/banners/GIVGIVGIV-purple.png');
	background-size: cover;
	height: 630px;
	width: 100%;
	display: flex;
	position: relative;
	align-items: flex-end;
`;

export default PublicGoodsHeader;
