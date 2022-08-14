import useMediaQuery from '@/hooks/useMediaQuery';
import { device, deviceSize } from '@/lib/constants/constants';

export default function useDetectDevice() {
	const isDesktop = useMediaQuery(device.laptopS);
	const isTablet = useMediaQuery(
		`(min-width: ${deviceSize.tablet}px) and (max-width: ${
			deviceSize.laptopS - 1
		}px)`,
	);
	const isLaptopS = useMediaQuery(
		`(min-width: ${deviceSize.laptopS}px) and (max-width: ${
			deviceSize.laptopL - 1
		}px)`,
	);
	const isMobile = !isDesktop && !isTablet;
	return { isDesktop, isLaptopS, isTablet, isMobile };
}
