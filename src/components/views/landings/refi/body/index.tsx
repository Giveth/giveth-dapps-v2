import {
	Button,
	H3,
	H4,
	IconDiscord,
	IconInstagram,
	IconLinkedin,
	IconTwitter,
	IconYoutube,
	Lead,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import KeyAspectsSVG from '@/components/views/landings/refi/body/KeyAspectsSVG';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';

const ReFiBody = () => {
	return (
		<Wrapper>
			<Body size='large'>
				Giveth, the revolutionary crypto fundraising platform, embodies
				ReFi by leveraging blockchain technology to empower changemakers
				to contribute to a more equitable and sustainable financial
				system.
				<br />
				<br />
				First of all, what is ReFi?
				<br />
				<br />
				Regenerative Finance, or ReFi, is a movement that recognizes the
				potential of blockchain, or crypto technology, and web3 to drive
				positive change in addressing climate change, supporting
				conservation efforts, promoting biodiversity and more. It aims
				to leverage the transformative capabilities of decentralized
				technologies to foster regenerative practices in the financial
				sector.
			</Body>
			<H3Styled weight={700}>
				Key aspects of regenerative finance (ReFi)
			</H3Styled>
			<KeyAspectsSVG />
			<AspectsWrapper>
				<H4Styled weight={700}>Climate Change Mitigation</H4Styled>
				<LeadStyled>
					ReFi seeks to utilize blockchain to develop innovative
					financial solutions that support climate change mitigation
					efforts. This can involve facilitating investments in
					renewable energy projects, carbon offset initiatives, and
					sustainable infrastructure development.
				</LeadStyled>
				<H4Styled weight={700}>Conservation and Biodiversity</H4Styled>
				<LeadStyled>
					ReFi recognizes the importance of protecting and preserving
					natural ecosystems and biodiversity. ReFi promotes
					transparent and traceable supply chains, facilitates
					investments in conservation projects, and enables the
					trading of nature-based assets such as carbon credits or
					ecosystem services.
				</LeadStyled>
				<H4Styled weight={700}>Equity and Inclusion</H4Styled>
				<LeadStyled>
					A core principle of ReFi is to build a financial system that
					is inclusive, accessible, and equitable for all. By
					leveraging blockchain's decentralized structure, ReFi aims
					to eliminate barriers and provide financial services to
					underserved populations, promoting economic empowerment and
					reducing inequalities.
				</LeadStyled>
				<H4Styled weight={700}>Sustainable Investments</H4Styled>
				<LeadStyled>
					ReFi emphasizes the importance of sustainable investments
					that generate positive environmental and social impacts.
					Through blockchain-based platforms and decentralized finance
					(DeFi) mechanisms, ReFi enables individuals and
					organizations to participate in impact investing, fund
					projects aligned with sustainability goals, and support
					regenerative practices.
				</LeadStyled>
				<H4Styled weight={700}>
					Transparency and Accountability
				</H4Styled>
				<LeadStyled>
					Blockchain's inherent transparency and immutability are
					leveraged in ReFi to enhance financial accountability and
					reduce the risk of fraud or corruption. Smart contracts and
					decentralized governance models are used to ensure
					transparency in financial transactions, investment
					processes, and project outcomes.
				</LeadStyled>
				<H4Styled weight={700}>ReFi versus DeFi</H4Styled>
				<LeadStyled>
					ReFi in the web3, crypto world is also a play on, or
					response to, “DeFi” (decentralized finance). While users of
					DeFi in the crypto world typically focus just on making
					money at all costs, ReFi users instead look at how financial
					decisions impact the environment and planet, thereby leading
					to a holistic approach to finance that favors sustainability
					and, naturally, regeneration.
				</LeadStyled>
			</AspectsWrapper>
			<Body size='large'>
				ReFi represents a growing movement where technology is seen as a
				powerful tool to address urgent global challenges while
				fostering an evolved financial ecosystem.
				<br />
				<br />
				Giveth strengthens the ReFi movement by providing a platform
				that empowers individuals to support regenerative finance
				initiatives, through its innovative approach to fundraising and
				commitment to fostering positive change. With ReFi at its heart,
				Giveth is driving the transformation of the financial sector
				towards a more equitable, sustainable, and regenerative future.
			</Body>
			<AspectsWrapper>
				<H4Styled weight={700}>
					Fundraising for Regenerative Initiatives
				</H4Styled>
				<LeadStyled>
					Giveth's platform enables individuals, nonprofits, and
					social enterprises to raise funds specifically for
					regenerative projects. Through Giveth, these projects gain
					access to a global network of donors who are passionate
					about supporting initiatives related to climate change
					mitigation, conservation, biodiversity, and other
					sustainable efforts.
				</LeadStyled>
				<H4Styled weight={700}>
					Transparent and Accountable Giving
				</H4Styled>
				<LeadStyled>
					Giveth utilizes blockchain's transparency and immutability
					to ensure that every donation is traceable and accounted
					for. This fosters trust and confidence among donors, as they
					can see how their contributions are being utilized and the
					impact they are making in the ReFi ecosystem.
				</LeadStyled>
				<H4Styled weight={700}>Engaging the Community</H4Styled>
				<LeadStyled>
					Giveth actively cultivates a community-driven approach by
					encouraging collaboration and participation from its users
					by rewarding them with governance tokens. By connecting
					individuals and organizations through its platform, Giveth
					facilitates the sharing of ideas, resources, and expertise,
					amplifying the collective impact of the ReFi movement.
				</LeadStyled>
				<H4Styled weight={700}>Working with ReFi Partners</H4Styled>
				<LeadStyled>
					At Giveth, we work with several projects in the ReFi space.
					Most notably, we are integrated with the Ethereum, Optimism
					and Celo blockchains. Users can donate to any of Giveth
					projects on any of those chains and using over 30 tokens.
					One of Celo’s missions, for example, is to make their
					protocol an engine that drives the future of regenerative
					economics. Other notable projects that are raising funds on
					Giveth in the ReFi space are ReFi Spring and ReFi DAO.
				</LeadStyled>
				<H4Styled weight={700}>Regenerative Economies</H4Styled>
				<LeadStyled>
					Giveth’s long term goal is to put the for-good projects from
					its platform on the path to becoming their own regenerative
					economies. ReFi at the core, they will become circular or
					“micro” economies, where their project-specific tokens
					circulate and have market demand, and investors can engage
					competitively in supporting the regenerative goals of the
					projects.
				</LeadStyled>
				<H4Styled weight={700}>
					Supporting Sustainability and Regeneration
				</H4Styled>
				<LeadStyled>
					Giveth's platform provides an avenue for individuals to
					engage in real impact by supporting regenerative projects
					aligned with ReFi's goals. By leveraging blockchain-based
					mechanisms, Giveth enables transparent and efficient
					investment processes that direct capital towards sustainable
					initiatives, contributing to the growth and development of
					the ReFi ecosystem.
				</LeadStyled>
			</AspectsWrapper>
			<ButtonWrapper>
				<ExternalLink href={Routes.Projects}>
					<Button
						buttonType='primary'
						label='Explore ReFi projects on Giveth'
					></Button>
				</ExternalLink>
			</ButtonWrapper>
			<H3Styled weight={700}>Join our community</H3Styled>
			<IconContainer>
				<ExternalLink href={links.TWITTER}>
					<IconTwitter color='#1DA1F2' size={64} />
				</ExternalLink>
				<ExternalLink href={links.DISCORD}>
					<IconDiscord size={64} color='#7289DA' />
				</ExternalLink>
				<ExternalLink href={links.YOUTUBE}>
					<IconYoutube size={64} color='#FF0000' />
				</ExternalLink>
				<ExternalLink href={links.INSTAGRAM}>
					<IconInstagram size={64} color='rgb(217, 58, 92)' />
				</ExternalLink>
				<ExternalLink href={links.LINKEDIN}>
					<IconLinkedin size={64} color='#0077B5' />
				</ExternalLink>
			</IconContainer>
		</Wrapper>
	);
};

const ButtonWrapper = styled(FlexCenter)`
	margin: 80px 0;
`;

const IconContainer = styled(Flex)`
	align-items: center;
	gap: 40px;
`;

const Body = styled(Lead)`
	margin-bottom: 80px;
`;

const AspectsWrapper = styled.div`
	margin-left: 50px;
`;

const Wrapper = styled.div`
	max-width: 1280px;
	margin: 80px auto;
	padding: 0 40px;
`;

const H3Styled = styled(H3)`
	margin-bottom: 20px;
`;

const H4Styled = styled(H4)`
	margin-bottom: 15px;
`;

const LeadStyled = styled(Lead)`
	margin-bottom: 40px;
`;

export default ReFiBody;
