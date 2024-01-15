import useMediaQuery from '@/hooks/useMediaQuery';
import { device, deviceSize } from '@/lib/constants/constants';

export default function useDetectDevice() {
	const isDesktop = useMediaQuery(device.desktop);
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
	const isLaptopL = useMediaQuery(
		`(min-width: ${deviceSize.laptopL}px) and (max-width: ${
			deviceSize.desktop - 1
		}px)`,
	);
	const isMobile = useMediaQuery(`(max-width: ${deviceSize.tablet - 1}px)`);
	return { isDesktop, isLaptopS, isTablet, isMobile, isLaptopL };
}
