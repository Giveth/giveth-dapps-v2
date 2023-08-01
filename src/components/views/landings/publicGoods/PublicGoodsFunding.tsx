import styled from 'styled-components';
import { H4, Lead } from '@giveth/ui-design-system';
import {
	PublicGoodsOuterWrapper,
	PublicGoodsWrapper,
} from '@/components/views/landings/publicGoods/common.styles';

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
				</Funding>
			</PublicGoodsWrapper>
		</PublicGoodsOuterWrapper>
	);
};

const Funding = styled.div`
	padding: 40px 0;
	*:first-child {
		margin-bottom: 16px;
	}
`;

export default PublicGoodsFunding;
