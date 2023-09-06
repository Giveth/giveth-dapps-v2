import { useState, useEffect } from 'react';

export const useDelayedState = () => {
	const [state, setState] = useState(false);
	const [delayedState, setDelayedState] = useState(false);

	useEffect(() => {
		if (state) return;
		// we should do this here instead of close function to check the state after timeout
		// and only if it is false, set delayedState false
		const temp = setTimeout(() => {
			setDelayedState(false);
		}, 300);

		return () => {
			clearTimeout(temp);
		};
	}, [state]);

	const close = () => {
		setState(false);
	};

	const setStates = () => {
		setDelayedState(true);
		setTimeout(() => {
			setState(true);
		}, 0);
	};

	return [state, delayedState, setStates, close] as const;
};
