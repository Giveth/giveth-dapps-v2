import {
	brandColors,
	D2,
	H3,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

const ReadyToGive = () => {
	return (
		<Wrapper>
			<H3 weight={700}>Ready to give Giveth a whirl?</H3>
			<br />
			<Lead size='large'>
				Follow the steps below to get started and experience the Future
				of Giving for yourself.
			</Lead>
			{numberedList.map(item => (
				<NumberedItem key={item.number} {...item} />
			))}
		</Wrapper>
	);
};

const numberedList = [
	{
		number: 1,
		title: 'Create a wallet',
		description:
			'This will be how you interact with the Giveth platform and transfer funds.',
	},
	{
		number: 2,
		title: 'Create your account on Giveth',
		description:
			'Once you have a wallet on your browser, click the “SIGN IN” button on the upper right of the Giveth site and choose “Sign in with Ethereum”.',
	},
	{
		number: 3,
		title: 'Fund your wallet with crypto',
		description:
			'Once you create an account on Giveth and sign in with your browser wallet, the next step is to fund your wallet with some crypto currency.',
	},
];

const NumberedItem = (props: {
	number: number;
	title: string;
	description: string | JSX.Element;
}) => {
	const { number, title, description } = props;
	return (
		<NumberedItemWrapper>
			<Number>{number}</Number>
			<Text size='large'>
				<div>{title}</div>
				{description}
			</Text>
		</NumberedItemWrapper>
	);
};

const Wrapper = styled.div`
	margin: 80px 0;
`;

const Number = styled(D2)`
	color: ${brandColors.giv[500]};
	align-self: flex-start;
`;

const Text = styled(Lead)`
	color: ${neutralColors.gray[900]};
	> div {
		font-weight: 700;
		margin-bottom: 8px;
	}
`;

const NumberedItemWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 32px;
	padding: 40px 0;
	position: relative;
`;

export default ReadyToGive;
