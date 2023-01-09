import { useRef, useLayoutEffect, useCallback } from 'react';

export function useEvent(handler: any) {
	const handlerRef = useRef(null);

	// In a real implementation, this would run before layout effects
	useLayoutEffect(() => {
		handlerRef.current = handler;
	});

	return useCallback((...args: any[]) => {
		// In a real implementation, this would throw if called during render
		if (handlerRef.current) {
			const fn: any = handlerRef.current;
			return fn(...args);
		} else {
			return () => console.log('Not Implemented!!!');
		}
	}, []);
}
