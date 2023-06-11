import styled from 'styled-components';
import { H1 } from '@giveth/ui-design-system';

const ReFiHeader = () => {
	return (
		<OuterWrapper>
			<Wrapper>
				<H1 weight={700}>
					ReFi: Regenerative Finance, Our Hope for the Planet
				</H1>
			</Wrapper>
		</OuterWrapper>
	);
};

const OuterWrapper = styled.div`
	padding: 0 40px;
`;

const Wrapper = styled.div`
	max-width: 1200px;
	margin: 80px auto;
	border-radius: 16px;
	background-image: url('/images/banners/categories/all.png');
	background-size: cover;
	height: 530px;
	width: 100%;
	color: white;
	display: flex;
	align-items: center;
	> h1 {
		margin: 0 50px;
	}
`;

export default ReFiHeader;
