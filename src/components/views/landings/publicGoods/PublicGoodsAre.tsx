import { H4, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import {
	PublicGoodsOuterWrapper,
	PublicGoodsWrapper,
} from '@/components/views/landings/publicGoods/common.styles';
import publicGoodsImg from 'public/images/public-goods-in-crypto-and-web3/img.png';

const PublicGoodsAre = () => {
	return (
		<PublicGoodsOuterWrapper>
			<PublicGoodsWrapper>
				<InnerWrapper>
					<H4 weight={700}>
						Public goods are non-rivalrous and non-excludable:
					</H4>
					<Lead size='large'>
						<ul>
							<li>
								Non-rivalrous means they can be used by anyone
								anytime without reducing their supply and
								availability. For example, the air we breathe is
								in abundance for everyone all the time.{' '}
							</li>
							<li>
								Public goods are also non-excludable: everyone
								has access, meaning they often do not have to
								pay for that access.{' '}
							</li>
						</ul>
						There are of course quasi public goods such as public
						transportation, postal service systems and, in some
						countries, healthcare, which are public goods that have
						associated access costs. The opposite of public goods
						are private goods. They are available in limited supply
						and only to those who can afford them, such as food,
						clothing, electronics and most goods we consume or use
						in our everyday lives.
						<ImageWrapper>
							<Image src={publicGoodsImg} alt='public goods' />
						</ImageWrapper>
					</Lead>
					<H4 weight={700}>Public goods and web3</H4>
					<Lead size='large'>
						Examples of public goods in web3 are open source
						software, infrastructure, and tooling that makes the
						crypto world more accessible for all. There are more
						public goods than private goods in blockchain
						communities because blockchain requires a trustlessness
						that can only come through fully open source material
						and transparent community building.
						<br />
						<br />
						Vitalik Buterin, Ethereum inventor and co-founder,
						promotes the importance of public goods in blockchain
						because they foster collaboration and creative issue
						resolution, which underpin solid infrastructure.
					</Lead>
					<Space />
					<H4 weight={700}>Public goods versus the commons</H4>
					<Lead size='large'>
						While public goods are non-excludable and non-rivalrous
						and are provided for and managed by governments, the
						commons refers to shared resources, either natural
						(e.g., forests, fisheries, rivers) or human created
						(e.g., open source software, creative commons-licensed
						material) that have varying degrees of access and are
						controlled and regulated in different ways by the
						commons itself, to use, manage and maintain the shared
						resource. That management can take on various forms
						including informal, cooperative, or legal frameworks.
						<br />
						<br />
						Historically, commons have existed for millennia and
						have proven to be far more successful than
						government-controlled resources,* widely researched in
						the late 20th Century and early 21st by political
						scientist and economist Elinor Ostrom, who won the Nobel
						Prize in 2009 for her analysis of economic governance,
						particularly of the commons. Ostrom’s research dispelled
						the myth of the “tragedy of the commons”, a concept
						popularized by Garrett Hardin in 1968 that received
						widespread use while not necessarily being grounded in
						actual data. Indeed, Garrett Hardin revised his concept
						in 1991 to “the tragedy of the (unmanaged) commons” in
						light of such research developments.
					</Lead>
				</InnerWrapper>
			</PublicGoodsWrapper>
		</PublicGoodsOuterWrapper>
	);
};

const Space = styled.div`
	height: 120px;
`;

const ImageWrapper = styled.div`
	max-width: 644px;
	margin: 80px auto;
	> img {
		max-width: 644px;
		max-height: 352px;
		width: 100%;
		height: 100%;
	}
`;

const InnerWrapper = styled(H4)`
	padding: 40px 0;
	> h4 {
		margin-bottom: 16px;
	}
`;

export default PublicGoodsAre;
