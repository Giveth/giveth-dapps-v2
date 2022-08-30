import styled from 'styled-components';
import { QuoteText } from '@giveth/ui-design-system';

const NoBoost = () => {
	return (
		<Wrapper size='small'>
			<div>Your project didn’t receive any boost yet!</div>
			<div>
				You can share this project with your friends and ask them to
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
