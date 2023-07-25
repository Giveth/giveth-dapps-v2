import styled from 'styled-components';
import { H4, neutralColors } from '@giveth/ui-design-system';

const GivethTheRevolutionary = () => {
	return (
		<Wrapper>
			<H4 weight={700}>First of all, what is ReFi?</H4>
			<H4>
				Regenerative Finance, or ReFi, is a movement that recognizes the
				potential of blockchain, or crypto technology, and web3 to drive
				positive change in addressing climate change, supporting
				conservation efforts, promoting biodiversity and more. It aims
				to leverage the transformative capabilities of decentralized
				technologies to foster regenerative practices in the financial
				sector.
			</H4>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	max-width: 1180px;
	padding: 120px 30px 120px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
	> *:first-child {
		margin-bottom: 16px;
	}
`;

export default GivethTheRevolutionary;
