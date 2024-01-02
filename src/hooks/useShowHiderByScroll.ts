import { useState, useEffect } from 'react';

export const useShowHiderByScroll = () => {
	const [showHeader, setShowHeader] = useState(true);

	useEffect(() => {
		const threshold = 0;
		let lastScrollY = window.pageYOffset;
		let ticking = false;

		const updateScrollDir = () => {
			const scrollY = window.pageYOffset;

			if (Math.abs(scrollY - lastScrollY) < threshold) {
				ticking = false;
				return;
			}
			const show = scrollY <= lastScrollY;
			setShowHeader(show);
			lastScrollY = scrollY > 0 ? scrollY : 0;
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(updateScrollDir);
				ticking = true;
			}
		};

		window.addEventListener('scroll', onScroll);

		return () => window.removeEventListener('scroll', onScroll);
	}, [showHeader]);

	return showHeader;
};
