import { RefObject, useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
	delay?: number;
}

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
	onVisible: () => void,
	options: UseIntersectionObserverOptions = {},
): RefObject<T> => {
	const { root, rootMargin, threshold, delay = 0 } = options;
	const ref = useRef<T>(null);

	useEffect(() => {
		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					onVisible();
				}
			});
		};

		const observerOptions: IntersectionObserverInit = {
			root: root || null,
			rootMargin: rootMargin || '0px',
			threshold: threshold || 0.25,
		};

		const observer = new IntersectionObserver(
			observerCallback,
			observerOptions,
		);

		const observerSetupTimeout = setTimeout(() => {
			if (ref.current) {
				observer.observe(ref.current);
			}
		}, delay);

		return () => {
			clearTimeout(observerSetupTimeout);
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, [onVisible, root, rootMargin, threshold, delay]);

	return ref;
};
