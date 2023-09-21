import Image from 'next/image';
import styled from 'styled-components';
import { Button, H4, Lead, semanticColors } from '@giveth/ui-design-system';
import {
	PublicGoodsOuterWrapper,
	PublicGoodsWrapper,
} from '@/components/views/landings/publicGoods/common.styles';
import QFImg from 'public/images/public-goods-in-crypto-and-web3/QF.png';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '@/components/styled-components/Flex';

const PublicGoodsFunding = () => {
	return (
		<PublicGoodsOuterWrapper>
			<PublicGoodsWrapper>
				<Funding>
					<H4 weight={700}>Public goods funding</H4>
					<Lead size='large'>
						Historically, public goods funding comes from taxes as
						explained above. In blockchain, there are four obvious
						methods: individual donations, corporate donations,
						one-time pre-mints/pre-sales, and ongoing issuance. None
						of these are adequately scalable. Therefore public goods
						funding in blockchain turns to apps and protocols for
						innovative solutions such as layer 2 protocols including
						Optimism and Uniswap DAO, which operate retractive
						funding rounds in Ethereum. Layer 2 protocols have more
						flexibility than Layer 1 itself, but the Ethereum
						Foundation Grants program also distributes widely.
						<br />
						<br />
						The manner in which recipients are chosen is also
						evolving, such as with quadratic funding, popularized by
						Gitcoin where the amount distributed to a project is
						proportional to the number of donations received as
						opposed to simply to the total amounts received. In
						other words, in addition to the total amounts gained,
						projects also benefit from “matching” funds that
						reflect, via a mathematical formula, the popularity of
						the project according to the donors. It is a form of
						funding that optimally reflects a democratic approach to
						the process.
						<br />
						<br />
						See the example below.
					</Lead>
					<ImageWrapper>
						<Image src={QFImg} alt='Quadratic Funding' />
						<Lead size='large'>
							Source:{' '}
							<ExternalLink
								href='https://wtfisqf.com/'
								title='https://wtfisqf.com/'
								color={semanticColors.blueSky[600]}
							/>
						</Lead>
						<Lead size='large'>
							Giveth recently launched our own{' '}
							<ExternalLink
								href={Routes.QFProjects}
								title='Quadratic Funding'
								color={semanticColors.blueSky[600]}
							/>{' '}
							program as well!
						</Lead>
					</ImageWrapper>
				</Funding>
				<Section>
					<H4 weight={700}>
						Giveth: Micro-economies, circular economies, regen
						economies
					</H4>
					<Lead size='large'>
						At Giveth we want to transform how public goods are
						developed and managed.
						<br />
						<br />
						Governments typically control public goods. The problem
						in such a model is that while we pay taxes for their
						maintenance, public goods are usually poorly funded
						because they are non rivalrous and do not provide any
						incentive for development or innovation. Here nonprofits
						step in to try and cover the gap, but they are also
						poorly funded as they rely on principles of sacrifice
						(charitable donations). Progress is difficult without
						incentives.
						<br />
						<br />
						We see a new way forward where public goods can also be
						incentivized through regenerative economies. This way
						not only do public goods have the opportunity to
						flourish, but the projects creating that value benefit
						directly as well.
						<br />
						<br />
						See our co-founder Griff Green’s in-depth explanation in{' '}
						<ExternalLink
							href='https://blog.giveth.io/evolving-nonprofits-into-regen-economies-f8282f97f8d3?gi=07e16c50cfb9'
							title='Evolving Nonprofits into Regen Economies'
							color={semanticColors.blueSky[600]}
						/>
						.
						<br />
						<br />
						At Giveth, we believe that giving shouldn’t be about
						sacrifice but rather rewarded participation in value
						creation. One way we actualize that is through the{' '}
						<ExternalLink
							href={Routes.GIVbacks}
							title='GIVbacks Program'
							color={semanticColors.blueSky[600]}
						/>
						, where donors on Giveth are rewarded for their
						contribution with GIV tokens. We have also incorporated
						this into our{' '}
						<ExternalLink
							href={Routes.Referral}
							title='Referral Program'
							color={semanticColors.blueSky[600]}
						/>
						.
						<br />
						<br />
						Giveth isn't just about donating and earning rewards.
						It's also about fostering decentralized, democratic,
						global communities passionate about creating positive
						change in the world through regeneration and public
						goods.
						<br />
						<br />
						When you create a project or donate on Giveth, you'll
						open the door to connecting with other like-minded
						donors, projects, and the community at large. As part of
						the Giveth Galaxy of DAOs (decentralized autonomous
						organizations), you'll be supporting Giveth’s own long
						term goal of developing regenerative economies out of
						value-creating projects to include the circulation of
						their own currencies.
						<br />
						<br />
						Giveth wants to enact real change and be part of a
						movement promoting regenerative economics that rewards
						value and rewards giving so that communities and
						ecosystems can benefit and flourish instead of the
						current model of extraction and the taking advantage of
						depleting resources.
					</Lead>
				</Section>
				<Section>
					<H4 weight={700}>
						Giveth versus other crowdfunding platforms
					</H4>
					<Lead size='large'>
						Giveth is different from other crowdfunding platforms,
						like GoFundMe, Indiegogo, Bonfire, Classy, Kickstarter,
						Patreon and more, in countless ways, not least of which
						being the attributes described above. On a technical
						level, because Giveth is built on blockchain technology,
						it also means that every donation is secure,
						transparent, and tamper-proof. There are no fees, no
						intermediaries, and every transaction is direct:
						wallet-to-wallet and instantaneous.
						<br />
						<br />
						We support donations on multiple chains including
						Ethereum Mainnet, Gnosis Chain, Optimism, Celo, and
						Polygon. More are always being added. Donating to a
						verified project on Giveth means receiving GIV tokens in
						return, with the potential for up to 80% of the actual
						donation. These tokens can be used for a variety of
						purposes, including earning rewards through staking in
						the GIVgarden and participating in governance. They can
						also easily be converted to other cryptocurrencies or
						fiat currencies.
					</Lead>
				</Section>
				<Section>
					<H4 weight={700}>Giveth projects</H4>
					<Lead size='large'>
						What kind of projects can you support on Giveth? Anyone
						can create a project on Giveth and raise funds for their
						cause, provided it does not violate our covenant. We
						focus on public goods projects that benefit communities
						collectively, such as arts and education centers, clean
						air and water initiatives, reforestation, and so much
						more. We also support for-good projects that are working
						to create other types of positive change in the world,
						such as environmental conservation, DeSci, social
						justice, and humanitarian aid.
						<br />
						<br />
						Giveth offers a unique and rewarding way to support
						public goods and for-good projects while participating
						in novel decentralized efforts in human coordination for
						proactive change across networks and against the real
						and diverse body of threats of the metacrisis of our
						times.
						<br />
						<br />
						Contribute today and start making a positive impact on
						the world, and help us Build the Future of Giving.
					</Lead>
				</Section>
				<ButtonWrapper>
					<ExternalLink href={Routes.ReFiProjects}>
						<Button
							buttonType='primary'
							label='Explore ReFi projects on Giveth'
						/>
					</ExternalLink>
				</ButtonWrapper>
			</PublicGoodsWrapper>
		</PublicGoodsOuterWrapper>
	);
};

const ButtonWrapper = styled(FlexCenter)`
	margin: 0 auto;
`;

const Section = styled.div`
	margin: 120px 0;
	> *:first-child {
		margin-bottom: 16px;
	}
`;

const ImageWrapper = styled.div`
	max-width: 900px;
	margin: 80px auto -40px;
	> img {
		max-width: 900px;
		max-height: 418px;
		width: 100%;
		height: 100%;
	}
`;

const Funding = styled.div`
	padding: 40px 0 0;
	*:first-child {
		margin-bottom: 16px;
	}
`;

export default PublicGoodsFunding;
