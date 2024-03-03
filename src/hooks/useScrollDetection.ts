import { useState, useEffect } from 'react';

export enum EScrollDir {
	None = 'none',
	Up = 'up',
	Down = 'down',
}

export const useScrollDetection = () => {
	const [dir, setDir] = useState(EScrollDir.None);

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
			const up = scrollY <= lastScrollY;
			setDir(up ? EScrollDir.Up : EScrollDir.Down);
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
	}, []);

	return dir;
};
