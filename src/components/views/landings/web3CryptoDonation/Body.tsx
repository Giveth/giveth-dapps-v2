import {
	brandColors,
	Button,
	D2,
	H3,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';

const Body = () => {
	return (
		<>
			<LeadStyled size='large'>
				Did you know that Giveth is one of the very first platforms to
				accept crypto donations? Founded in 2016, we believe that Giveth
				is the best crypto donation platform in the world.
			</LeadStyled>
			<H3 weight={700}>Why?</H3>
			<br />
			<Lead size='large'>Here are a few reasons:</Lead>
			{numberedList.map(item => (
				<NumberedItem key={item.number} {...item} />
			))}
			<ButtonWrapper>
				<ExternalLink href={Routes.Projects}>
					<Button label='DONATE TO CRYPTO PROJECTS' />
				</ExternalLink>
			</ButtonWrapper>
		</>
	);
};

const numberedList = [
	{
		number: 1,
		title: 'Web3 donations made easy',
		description:
			'We make it super easy to donate to any project completely peer to peer! When you donate to a crypto project, we don’t take any of the fees. We never even hold the donation. 100% of what you donate goes DIRECTLY to the project.',
	},
	{
		number: 2,
		title: 'Ethereum donations (along with Gnosis chain)',
		description:
			'We’re active for donations on Ethereum mainnet and Gnosis chain, making it super easy for you to connect your wallet of choice (MetaMask etc.) and make Ethereum donations directly to any project.',
	},
	{
		number: 3,
		title: 'Official projects donations with cryptocurrency',
		description:
			'All projects on Giveth are verified by our team to make sure any funds donated are being used for what they say. You can be sure when you donate to any project on Giveth, that any cryptocurrency donated will go directly to the projects you donate to.',
	},
	{
		number: 4,
		title: 'Crypto airdrop rewards through donations',
		description: (
			<>
				Another cool feature that sets Giveth apart is that we
				constantly “airdrop” rewards to donors (we call them{' '}
				<ExternalLink
					color={brandColors.giv[500]}
					href={links.GIVBACK_DOC}
					title='GIVbacks'
				/>
				). That means that if you donate to any verified project on
				Giveth with crypto currency, you’ll be eligible to receive an
				airdrop of GIV tokens at a value of up to 80% of the value of
				what you donated! 🤯
			</>
		),
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

const ButtonWrapper = styled.div`
	margin: 50px auto;
	width: fit-content;
`;

const LeadStyled = styled(Lead)`
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

export default Body;
