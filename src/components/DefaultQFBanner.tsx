import styled from 'styled-components';
import Image from 'next/image';
import { Container, H1, semanticColors } from '@giveth/ui-design-system';

export const DefaultQFBanner = () => {
	return (
		<BannerWrapper>
			<BannerContainer>
				<Image
					src={'/images/banners/qf-banner-empty.svg'}
					style={{ objectFit: 'cover' }}
					fill
					alt='QF Banner'
				/>
				<StyledH1 weight={700}>Quadratic Funding</StyledH1>
			</BannerContainer>
		</BannerWrapper>
	);
};

const BannerWrapper = styled(Container)`
	position: relative;
`;

const BannerContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 40px;
	padding-top: 100px;
	padding-bottom: 100px;
	border-radius: 16px;
	img {
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
		border-radius: 16px;
	}
`;

const StyledH1 = styled(H1)`
	position: relative;
	font-size: 36px;
	color: ${semanticColors.golden[500]};
	text-align: center;
`;
