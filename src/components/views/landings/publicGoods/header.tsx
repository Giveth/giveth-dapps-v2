import styled from 'styled-components';
import { neutralColors } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';

const PublicGoodsHeader = () => {
	return (
		<OuterWrapper>
			<Wrapper></Wrapper>
		</OuterWrapper>
	);
};

const OuterWrapper = styled.div`
	background: ${neutralColors.gray[200]};
	padding: 40px 10px;
	${mediaQueries.tablet} {
		padding: 40px;
	}
`;

const Wrapper = styled.div`
	max-width: 1200px;
	margin: 40px auto;
	border-radius: 16px;
	background-image: url('/images/banners/categories/all.png');
	background-size: cover;
	height: 630px;
	width: 100%;
	display: flex;
	position: relative;
	align-items: flex-end;
	> h1 {
		margin: 0 50px;
	}
`;

export default PublicGoodsHeader;
