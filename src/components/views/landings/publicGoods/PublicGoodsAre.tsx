import { H4 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	PublicGoodsOuterWrapper,
	PublicGoodsWrapper,
} from '@/components/views/landings/publicGoods/common.styles';

const PublicGoodsAre = () => {
	return (
		<PublicGoodsOuterWrapper>
			<PublicGoodsWrapper>
				<InnerWrapper>
					<H4 weight={700}>
						Public goods are non-rivalrous and non-excludable:
					</H4>
					<div>
						Non-rivalrous means they can be used by anyone anytime
						without reducing their supply and availability. For
						example, the air we breathe is in abundance for everyone
						all the time. Public goods are also non-excludable:
						everyone has access, meaning they often do not have to
						pay for that access. There are of course quasi public
						goods such as public transportation, postal service
						systems and, in some countries, healthcare, which are
						public goods that have associated access costs. The
						opposite of public goods are private goods. They are
						available in limited supply and only to those who can
						afford them, such as food, clothing, electronics and
						most goods we consume or use in our everyday lives. 
					</div>
				</InnerWrapper>
			</PublicGoodsWrapper>
		</PublicGoodsOuterWrapper>
	);
};

const InnerWrapper = styled(H4)`
	padding: 40px 0;
	> h4 {
		margin-bottom: 16px;
	}
`;

export default PublicGoodsAre;
