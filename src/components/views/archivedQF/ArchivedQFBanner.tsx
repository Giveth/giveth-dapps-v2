import styled from 'styled-components';
import Image from 'next/image';

export const ArchivedQFBanner = () => {
	return (
		<BannerContainer>
			<Image
				src={'/images/banners/qfBanner.svg'}
				style={{ objectFit: 'cover' }}
				fill
				alt='QF Banner'
			/>
		</BannerContainer>
	);
};

const BannerContainer = styled.div`
	position: relative;
	/* padding-top: 160px;
	padding-bottom: 160px; */
	height: 500px;
	img {
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
	}
`;
