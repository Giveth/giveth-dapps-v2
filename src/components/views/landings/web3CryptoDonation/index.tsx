import styled from 'styled-components';
import Header from '@/components/views/landings/web3CryptoDonation/Header';
import Body from '@/components/views/landings/web3CryptoDonation/Body';

const Web3CryptoDonation = () => {
	return (
		<Wrapper>
			<Header />
			<Body />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin: 0 auto;
	max-width: 1200px;
	width: 100%;
	padding: 40px;
`;

export default Web3CryptoDonation;
