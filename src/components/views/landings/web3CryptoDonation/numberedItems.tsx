import { brandColors } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const numberedList = [
	{
		number: 1,
		title: 'Web3 donations made easy',
		description:
			'We make it super easy to donate to any project completely peer to peer! When you donate to a crypto project, we don’t take any of the fees. We never even hold the donation. 100% of what you donate goes DIRECTLY to the project.',
	},
	{
		number: 2,
		title: 'Ethereum donations (also on Gnosis chain, Optimism, Polygon and Celo):',
		description:
			'Nonprofits and other projects can fundraise and accept donations on multiple chains including Ethereum mainnet, Gnosis chain, Optimism, Polygon and Celo, making it super easy for you to connect your wallet of choice (MetaMask etc.) and make Ethereum donations directly to any project.',
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

export default numberedList;
