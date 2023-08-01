import styled from 'styled-components';
import { H4 } from '@giveth/ui-design-system';

const GivethIsTheOnly = () => {
	return (
		<OuterWrapper>
			<Wrapper>
				<H4>
					<b>Giveth</b>, is the only crypto fundraising platform that
					makes it easy, free and rewarding to support public goods
					and for-good projects.
					<br />
					<br />
					You may have heard the term public goods before, either in
					the web3 space generally, in connection to open source
					software, or simply in relation to clear air and water,
					schools, and even bus services – but what does it actually
					mean?
				</H4>
			</Wrapper>
		</OuterWrapper>
	);
};

const OuterWrapper = styled.div`
	background: white;
	position: relative;
`;

const Wrapper = styled.div`
	max-width: 1200px;
	padding: 40px;
	margin: 0 auto;
`;

export default GivethIsTheOnly;
