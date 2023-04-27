import styled from 'styled-components';
import { H1 } from '@giveth/ui-design-system';

const Header = () => {
	return (
		<Wrapper>
			<H1 weight={700}>Giveth - Web3 Crypto Donation Platform</H1>
		</Wrapper>
	);
};

const Wrapper = styled.div`
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

export default Header;
