import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

export const useIsIFrameLoaded = (iframeRef: RefObject<HTMLIFrameElement>) => {
	const [isIFrameLoaded, setIsIFrameLoaded] = useState(false);
	const iframeCurrent = iframeRef.current;

	useEffect(() => {
		iframeCurrent?.addEventListener('load', () => setIsIFrameLoaded(true));
		return () => {
			iframeCurrent?.removeEventListener('load', () =>
				setIsIFrameLoaded(true),
			);
		};
	}, [iframeCurrent]);

	return isIFrameLoaded;
};
