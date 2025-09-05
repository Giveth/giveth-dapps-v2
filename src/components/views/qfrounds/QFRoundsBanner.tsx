// src/components/views/qfrounds/QFRoundsBanner.tsx

import Image from 'next/image';
import styled from 'styled-components';
import useDetectDevice from '@/hooks/useDetectDevice';

export const QFRoundsBanner = () => {
	const { isMobile, isTablet, isDesktop, isLaptopS, isLaptopL } =
		useDetectDevice();
	let imageUrl = '/images/qfround/hub/qf-hub-desktop-1080px.png';
	if (isMobile) {
		imageUrl = '/images/qfround/hub/qf-hub-mobile.png';
	} else if (isTablet) {
		imageUrl = '/images/qfround/hub/qf-hub-tablet.png';
	} else if (isLaptopS) {
		imageUrl = '/images/qfround/hub/qf-hub-desktop-1080px.png';
	} else if (isLaptopL) {
		imageUrl = '/images/qfround/hub/qf-hub-desktop-1200px.png';
	} else {
		imageUrl = '/images/qfround/hub/qf-hub-desktop-1200px.png';
	}

	return (
		<ContainerWrapper>
			<Image
				src={imageUrl}
				alt='QF Hub Banner'
				width={1200} // intrinsic width (from your file)
				height={400} // intrinsic height
				style={{ width: '100%', height: 'auto', borderRadius: '16px' }}
			/>
		</ContainerWrapper>
	);
};

const ContainerWrapper = styled.div`
	width: 100%;
`;
