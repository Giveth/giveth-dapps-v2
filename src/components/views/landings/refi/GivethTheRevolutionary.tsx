import styled from 'styled-components';
import { H4, neutralColors } from '@giveth/ui-design-system';

const GivethTheRevolutionary = () => {
	return (
		<Wrapper>
			<H4>
				<b>Giveth</b>, the revolutionary crypto fundraising platform,
				embodies
				<b> ReFi</b> by leveraging blockchain technology to empower
				changemakers to contribute to a more equitable and sustainable
				financial system.
			</H4>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	max-width: 1180px;
	padding: 120px 30px 80px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
`;

export default GivethTheRevolutionary;
