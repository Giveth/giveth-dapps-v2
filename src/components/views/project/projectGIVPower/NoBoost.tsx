import styled from 'styled-components';
import { QuoteText } from '@giveth/ui-design-system';

const NoBoost = ({ isAdmin }: { isAdmin: boolean }) => {
	return (
		<Wrapper size='small'>
			<div>
				{isAdmin
					? `Your project hasn't received any boosts yet!
				`
					: `This project hasn't received any boosts yet!`}
			</div>
			<div>
				{isAdmin
					? `Share this project on social media and ask your friends
				for a boost!`
					: `Be the first one to boost this project.`}
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
