import styled from 'styled-components';
import { Lead, neutralColors, H4 } from '@giveth/ui-design-system';

const FundraisingForRegenerativeInitiatives = () => {
	return (
		<Wrapper size='large'>
			{items.map(item => (
				<ItemWrapper key={item.title}>
					<H4 weight={700}>{item.title}</H4>
					<div>{item.description}</div>
				</ItemWrapper>
			))}
		</Wrapper>
	);
};

const items = [
	{
		title: 'Fundraising for Regenerative Initiatives',
		description:
			"Giveth's platform enables individuals, nonprofits, and social enterprises to raise funds specifically for regenerative projects. Through Giveth, these projects gain access to a global network of donors who are passionate about supporting initiatives related to climate change mitigation, conservation, biodiversity, and other sustainable efforts.",
	},
	{
		title: 'Transparent and Accountable Giving',
		description:
			"Giveth utilizes blockchain's transparency and immutability to ensure that every donation is traceable and accounted for. This fosters trust and confidence among donors, as they can see how their contributions are being utilized and the impact they are making in the ReFi ecosystem.",
	},
	{
		title: 'Engaging the Community',
		description:
			'Giveth actively cultivates a community-driven approach by encouraging collaboration and participation from its users by rewarding them with governance tokens. By connecting individuals and organizations through its platform, Giveth facilitates the sharing of ideas, resources, and expertise, amplifying the collective impact of the ReFi movement.',
	},
	{
		title: 'Working with ReFi Partners',
		description:
			'At Giveth, we work with several projects in the ReFi space. Most notably, we are integrated with the Ethereum, Optimism and Celo blockchains. Users can donate to any of Giveth projects on any of those chains and using over 30 tokens. One of Celo’s missions, for example, is to make their protocol an engine that drives the future of regenerative economics. Other notable projects that are raising funds on Giveth in the ReFi space are ReFi Spring and ReFi DAO.',
	},
	{
		title: 'Regenerative Economies',
		description:
			'Giveth’s long term goal is to put the for-good projects from its platform on the path to becoming their own regenerative economies. ReFi at the core, they will become circular or “micro” economies, where their project-specific tokens circulate and have market demand, and investors can engage competitively in supporting the regenerative goals of the projects.',
	},
	{
		title: 'Supporting Sustainability and Regeneration',
		description:
			"Giveth's platform provides an avenue for individuals to engage in real impact by supporting regenerative projects aligned with ReFi's goals. By leveraging blockchain-based mechanisms, Giveth enables transparent and efficient investment processes that direct capital towards sustainable initiatives, contributing to the growth and development of the ReFi ecosystem.",
	},
];

const ItemWrapper = styled.div`
	padding: 60px 0;
	> *:first-child {
		margin-bottom: 16px;
	}
`;

const Wrapper = styled(Lead)`
	max-width: 1180px;
	padding: 20px 30px 40px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
`;

export default FundraisingForRegenerativeInitiatives;
