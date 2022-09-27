import styled from 'styled-components';
import { QuoteText } from '@giveth/ui-design-system';

const NoBoost = () => {
	return (
		<Wrapper size='small'>
			<div>This project hasn't received any boosts yet!</div>
			<div>
				Share this project on social media and ask your friends for a
				boost!
			</div>
		</Wrapper>
	);
};

const Wrapper = styled(QuoteText)`
	margin-top: 200px;
	margin-bottom: 500px;
	text-align: center;
`;

export default NoBoost;
