import { useState, useEffect, useRef } from 'react';
import { isSSRMode } from '@/lib/helpers';
import { deviceSize } from '@/lib/constants/constants';

function getWidth(): number {
	if (isSSRMode) {
		return 2000;
	}
	const { innerWidth: width } = window;
	return width;
}

function detectDevice() {
	const width = getWidth();
	if (width < deviceSize.mobileM) {
		return { isMobileS: true, isMobile: true };
	} else if (width < deviceSize.mobileL) {
		return { isMobileM: true, isMobile: true };
	} else if (width < deviceSize.tablet) {
		return { isMobileL: true, isMobile: true };
	} else if (width < deviceSize.laptopS) {
		return { isTablet: true };
	} else if (width < deviceSize.laptopL) {
		return { isLaptopS: true, isLaptop: true };
	} else if (width < deviceSize.desktop) {
		return { isLaptopL: true, isLaptop: true };
	} else {
		return { isDesktop: true, isLaptop: true };
	}
}

export default function useDetectDevice() {
	const [device, setDevice] = useState(detectDevice());

	const oldDevice = useRef(device);

	useEffect(() => {
		if (isSSRMode) return;

		function handleResize() {
			const newDevice = detectDevice();
			if (
				JSON.stringify(newDevice) !== JSON.stringify(oldDevice.current)
			) {
				oldDevice.current = newDevice;
				setDevice(newDevice);
			}
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return device;
}
