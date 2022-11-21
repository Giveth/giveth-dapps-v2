import styled from 'styled-components';
import { QuoteText } from '@giveth/ui-design-system';

const NoBoost = ({ isAdmin }: { isAdmin: boolean }) => {
	return (
		<Wrapper size='small'>
			{isAdmin ? (
				<div>
					Your project hasn't received any boosts yet!
					<br />
					Share this project on social media and ask your friends for
					a boost!
				</div>
			) : (
				<div>
					This project doesn't have any GIVpower behind it! Give it a
					boost rocket
				</div>
			)}
		</Wrapper>
	);
};

const Wrapper = styled(QuoteText)`
	margin-top: 200px;
	margin-bottom: 500px;
	text-align: center;
`;

export default NoBoost;
