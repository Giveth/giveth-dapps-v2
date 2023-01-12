import { useState } from 'react';

export const useDelayedState = () => {
	const [state, setState] = useState(false);
	const [delayedState, setDelayedState] = useState(false);

	const close = () => {
		setState(false);
		setTimeout(() => {
			setDelayedState(false);
		}, 300);
	};

	const setStates = () => {
		setDelayedState(true);
		setTimeout(() => {
			setState(true);
		}, 0);
	};

	return [state, delayedState, setStates, close] as const;
};
