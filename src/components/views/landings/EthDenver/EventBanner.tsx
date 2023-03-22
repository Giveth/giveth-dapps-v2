import { brandColors, H1, H5 } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ETHDenverIcon from '/public/images/ETHDenver_2023.png';
import SporkWhaleIcon from '/public/images/ETHDenver-spork-whale.png';
import GoldSporkIcon from '/public/images/ETHDenver-gold-sporke.png';
import Image from 'next/image';
import { Container } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';

const EventBanner = () => {
	return (
		<Wrapper>
			<Container>
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
			</Container>
		</Wrapper>
	);
};

const TextBox = styled.div`
	max-width: 701px;
`;

const GoldSpork = styled.div`
	position: absolute;
	bottom: 0;
	display: none;
	overflow: hidden;
	${mediaQueries.laptopS} {
		margin-top: 160px;
		right: -50px;
		display: inline-block;
	}
	${mediaQueries.desktop} {
		right: 155px;
		display: inline-block;
	}
`;

const SporkWhale = styled.div`
	position: absolute;
	top: 0;
	left: 30%;
`;

const H1Styled = styled(H1)`
	color: white;
	margin: 16px 0;
`;

const Wrapper = styled.div`
	position: relative;
	padding: 224px 0px;
	background-image: url('/images/ETHDenver-banner.png');
	background-repeat: no-repeat;
	background-size: cover;
	color: ${brandColors.mustard[500]};
`;

export default EventBanner;
