import { useEffect, RefObject } from 'react';

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
	handler: (e: MouseEvent | TouchEvent) => void,
	active: boolean = true,
	ref: RefObject<T>,
	ref2?: RefObject<T>,
) {
	useEffect(() => {
		if (!active) return;

		const listener = (event: MouseEvent | TouchEvent) => {
			event.stopPropagation();
			event.preventDefault();
			// Do nothing if clicking ref's element or descendent elements
			if (
				!ref.current ||
				ref.current.contains(event.target as Node) ||
				ref2?.current?.contains(event.target as Node)
			) {
				return;
			}
			handler(event);
		};
		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);
		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};
	}, [ref, handler, active]);
}
