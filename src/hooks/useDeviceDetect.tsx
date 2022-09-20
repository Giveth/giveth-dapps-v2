import React from 'react';
import { deviceSize } from '@/lib/constants/constants';

export const checkUserAgentIsMobile = () => {
	const userAgent =
		typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
	return Boolean(
		userAgent.match(/Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i),
	);
};

export default function useDeviceDetect() {
	// Based on useMediaQuery hook
	const query = `(max-width:${deviceSize.mobileL}px)`;
	const getMatches = () => {
		// Prevents SSR issues
		if (typeof window !== 'undefined') {
			return window.matchMedia(query).matches;
		}
		return false;
	};

	const [matches, setMatches] = React.useState<boolean>(getMatches());

	function handleChange() {
		setMatches(getMatches());
	}

	React.useEffect(() => {
		const matchMedia = window.matchMedia(query);
		// Triggered at the first client-side load and if query changes
		handleChange();
		// Listen matchMedia
		matchMedia.addEventListener('change', handleChange);
		return () => {
			matchMedia.removeEventListener('change', handleChange);
		};
	}, [query]);

	return { isMobile: matches };
}
