import { MutableRefObject, useEffect, useRef } from 'react';

type TOutput = [MutableRefObject<HTMLInputElement | null>, () => void];

const useFocus = (): TOutput => {
	const inputRef = useRef<HTMLInputElement>(null);

	const setFocus = () => {
		inputRef.current && inputRef.current.focus();
	};

	useEffect(() => {
		setFocus();
	}, [inputRef.current]);

	return [inputRef, setFocus];
};

export default useFocus;
