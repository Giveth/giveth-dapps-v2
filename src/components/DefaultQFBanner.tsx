import styled from 'styled-components';
import Image from 'next/image';
import { H1, semanticColors } from '@giveth/ui-design-system';

export const DefaultQFBanner = () => {
	return (
		<BannerContainer>
			<Image
				src={'/images/banners/qf-banner-empty.svg'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
			<StyledH1 weight={700}>Quadratic Funding</StyledH1>
		</BannerContainer>
	);
};

const BannerContainer = styled.div`
	position: relative;
	padding-top: 160px;
	padding-bottom: 160px;
	/* height: 500px; */
	img {
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
	}
`;

const StyledH1 = styled(H1)`
	position: relative;
	/* top: 50%;
	left: 50%;
	transform: translate(-50%, -50%); */
	color: ${semanticColors.golden[500]};
	text-align: center;
`;
