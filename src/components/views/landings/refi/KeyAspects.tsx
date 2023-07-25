import styled from 'styled-components';
import { H3, H4, neutralColors, Lead, Button } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import KeyAspectsSVG from '@/components/views/landings/refi/KeyAspectsSVG';
import { mediaQueries } from '@/lib/constants/constants';
import Divider from '@/components/Divider';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';
import { TextCenter } from '@/components/styled-components/Text';

const KeyAspects = () => {
	return (
		<Wrapper size='large'>
			<FlexStyled gap='60px'>
				<div>
					<H3Styled weight={700}>
						Key aspects of regenerative finance (ReFi)
					</H3Styled>
					<div>
						Although it has a clear mission of using financial
						incentives for the betterment of the planet,
						Regenerative Finance (ReFi) is a complex topic with many
						different aspects to consider. Below are some of the
						ways in which ReFi is changing the way that we design
						crypto systems on the social layer for web3.
					</div>
				</div>
				<KeyAspectsSVG />
			</FlexStyled>
			<Divider color='white' height='40px' />
			{aspects.map(aspect => (
				<KeyAspectsItem key={aspect.title}>
					<H4 weight={700}>{aspect.title}</H4>
					<div>{aspect.description}</div>
				</KeyAspectsItem>
			))}
			<Divider color='white' height='40px' />
			<TextCenter>
				<ExternalLink href={Routes.ReFiProjects}>
					<Button
						buttonType='primary'
						label='Explore ReFi projects on Giveth'
					/>
				</ExternalLink>
			</TextCenter>
		</Wrapper>
	);
};

const aspects = [
	{
		title: 'Climate Change Mitigation',
		description:
			'ReFi seeks to utilize blockchain to develop innovative financial solutions that support climate change mitigation efforts. This can involve facilitating investments in renewable energy projects, carbon offset initiatives, and sustainable infrastructure development.',
	},
	{
		title: 'Conservation and Biodiversity',
		description:
			'ReFi recognizes the importance of protecting and preserving natural ecosystems and biodiversity. ReFi promotes transparent and traceable supply chains, facilitates investments in conservation projects, and enables the trading of nature-based assets such as carbon credits or ecosystem services.',
	},
	{
		title: 'Equity and Inclusion',
		description:
			"A core principle of ReFi is to build a financial system that is inclusive, accessible, and equitable for all. By leveraging blockchain's decentralized structure, ReFi aims to eliminate barriers and provide financial services to underserved populations, promoting economic empowerment and reducing inequalities.",
	},
	{
		title: 'Sustainable Investments',
		description:
			'ReFi emphasizes the importance of sustainable investments that generate positive environmental and social impacts. Through blockchain-based platforms and decentralized finance (DeFi) mechanisms, ReFi enables individuals and organizations to participate in impact investing, fund projects aligned with sustainability goals, and support regenerative practices.',
	},
	{
		title: 'Transparency and Accountability',
		description:
			"Blockchain's inherent transparency and immutability are leveraged in ReFi to enhance financial accountability and reduce the risk of fraud or corruption. Smart contracts and decentralized governance models are used to ensure transparency in financial transactions, investment processes, and project outcomes.",
	},
	{
		title: 'ReFi versus DeFi',
		description:
			'ReFi in the web3, crypto world is also a play on, or response to, “DeFi” (decentralized finance). While users of DeFi in the crypto world typically focus just on making money at all costs, ReFi users instead look at how financial decisions impact the environment and planet, thereby leading to a holistic approach to finance that favors sustainability and, naturally, regeneration.',
	},
];

const KeyAspectsItem = styled.div`
	padding: 40px 0;
`;

const FlexStyled = styled(Flex)`
	padding: 40px 0;
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const H3Styled = styled(H3)`
	margin-bottom: 31px;
`;

const Wrapper = styled(Lead)`
	max-width: 1180px;
	padding: 40px 30px;
	margin: 0 auto;
    color: ${neutralColors.gray[900]}};
`;

export default KeyAspects;
