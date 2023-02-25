import { brandColors, H1, H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ETHDenverIcon from '/public/images/ETHDenver_2023.png';
import SporkWhaleIcon from '/public/images/ETHDenver-spork-whale.png';
import GoldSporkIcon from '/public/images/ETHDenver-gold-sporke.png';

import Image from 'next/image';

const EventBanner = () => {
	return (
		<Wrapper>
			<InnerWrapper>
				<TextBox>
					<H5>Learn What We’re Up To and How to Get Involved!</H5>
					<H1Styled weight={700}>Giveth at ETHDenver 2023</H1Styled>
					<Image src={ETHDenverIcon} alt='ETHDenver 2023' />
				</TextBox>
				<SporkWhale>
					<Image src={SporkWhaleIcon} alt='Spork Whale' />
				</SporkWhale>
				<GoldSpork>
					<Image src={GoldSporkIcon} alt='Gold Spork' />
				</GoldSpork>
			</InnerWrapper>
		</Wrapper>
	);
};

const InnerWrapper = styled.div`
	max-width: 1200px;
	margin: 0 auto;
`;

const TextBox = styled.div`
	max-width: 701px;
`;

const GoldSpork = styled.div`
	position: absolute;
	bottom: 0;
	right: 155px;
`;

const SporkWhale = styled.div`
	position: absolute;
	top: 0;
	left: 520px;
`;

const H1Styled = styled(H1)`
	color: white;
	margin: 16px 0;
`;

const Wrapper = styled.div`
	position: relative;
	padding: 224px 86px 177px;
	background-image: url('/images/ETHDenver-banner.png');
	background-repeat: no-repeat;
	background-size: cover;
	color: ${brandColors.mustard[500]};
`;

export default EventBanner;
