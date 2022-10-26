import styled from 'styled-components';
import { QuoteText } from '@giveth/ui-design-system';
import { FC } from 'react';

interface IProps {
	isAdmin: boolean;
}

const NoBoost: FC<IProps> = ({ isAdmin }) => {
	return (
		<Wrapper size='small'>
			<div>
				{isAdmin
					? 'Your project has not yet been boosted!'
					: "This project hasn't been boosted yet!"}
			</div>
			<div>
				{isAdmin
					? 'Share your project on social media and ask your friends to use GIVpower to give you a boost!'
					: 'Be the first to boost this project with GIVpower.'}
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
