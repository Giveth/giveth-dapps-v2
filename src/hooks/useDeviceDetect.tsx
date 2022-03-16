import React from 'react';
import { deviceSize } from '@/utils/constants';

// TODO: fix this so it relates the change of width
// export function _useDeviceDetect() {
// 	const [size, setSize] = React.useState([0, 0]);
// 	React.useLayoutEffect(() => {
// 		function updateSize() {
// 			setSize([window.innerWidth, window.innerHeight]);
// 		}
// 		window.addEventListener('resize', updateSize);
// 		updateSize();
// 		return () => window.removeEventListener('resize', updateSize);
// 	}, []);
// 	return { isMobile: size[0] <= deviceSize.mobileL };
// }

export default function useDeviceDetect() {
	const [isMobile, setMobile] = React.useState(false);

	React.useEffect(() => {
		const userAgent =
			typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
		let mobile = Boolean(
			userAgent.match(
				/Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile/i,
			),
		);
		// check width if device not found
		if (!mobile && typeof window !== 'undefined') {
			mobile = window.innerWidth <= deviceSize.mobileL;
		}
		setMobile(mobile);
	}, []);

	return { isMobile };
}
