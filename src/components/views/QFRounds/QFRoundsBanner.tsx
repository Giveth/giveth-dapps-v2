import Image from 'next/image';
import styled from 'styled-components';
import useDetectDevice from '@/hooks/useDetectDevice';

export const QFRoundsBanner = () => {
	const { isMobile, isTablet, isLaptopS, isLaptopL } = useDetectDevice();
	let imageUrl = '/images/qfround/hub/qf-hub-desktop-1080px-new.png';
	if (isMobile) {
		imageUrl = '/images/qfround/hub/qf-hub-mobile-new.png';
	} else if (isTablet) {
		imageUrl = '/images/qfround/hub/qf-hub-tablet-new.png';
	} else if (isLaptopS) {
		imageUrl = '/images/qfround/hub/qf-hub-desktop-1080px-new.png';
	} else if (isLaptopL) {
		imageUrl = '/images/qfround/hub/qf-hub-desktop-1200px-new.png';
	} else {
		imageUrl = '/images/qfround/hub/qf-hub-desktop-1200px-new.png';
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
