import { brandColors, H4, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import {
	PublicGoodsOuterWrapper,
	PublicGoodsWrapper,
} from '@/components/views/landings/publicGoods/common.styles';
import QuarterCircle from '@/components/particles/QuarterCircle';
import Plus from '@/components/particles/Plus';
import Wave from '@/components/particles/Wave';
import { Absolute } from '@/components/styled-components/Position';

const GivethIsTheOnly = () => {
	return (
		<PublicGoodsOuterWrapper>
			<PublicGoodsWrapper>
				<InnerWrapper>
					<b>Giveth</b>, is the only crypto fundraising platform that
					makes it easy, free and rewarding to support public goods
					and for-good projects.
					<br />
					<br />
					You may have heard the term public goods before, either in
					the web3 space generally, in connection to open source
					software, or simply in relation to clear air and water,
					schools, and even bus services – but what does it actually
					mean?
				</InnerWrapper>
			</PublicGoodsWrapper>
			<PlusWrapper>
				<Plus color={brandColors.mustard[500]} />
			</PlusWrapper>
			<CircleWrapper>
				<QuarterCircle color={brandColors.ocean[600]} />
			</CircleWrapper>
			<WaveWrapper>
				<Wave color={brandColors.pinky[400]} />
			</WaveWrapper>
		</PublicGoodsOuterWrapper>
	);
};

const WaveWrapper = styled(Absolute)`
	right: 0;
	top: 180px;
	display: none;
	${mediaQueries.laptopS} {
		display: block;
	}
`;

const CircleWrapper = styled(Absolute)`
	left: 250px;
	top: 45px;
`;

const PlusWrapper = styled(Absolute)`
	left: 60px;
	bottom: 75px;
`;

const InnerWrapper = styled(H4)`
	padding: 80px 0;
`;

export default GivethIsTheOnly;
