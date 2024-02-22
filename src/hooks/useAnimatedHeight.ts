import { useRef, useState, useEffect, useCallback } from 'react';

const useAnimatedHeight = () => {
	const [isOpen, setIsOpen] = useState(false);
	// Explicitly type the ref as a HTMLDivElement
	const contentRef = useRef<HTMLDivElement>(null);
	const [maxHeight, setMaxHeight] = useState('0px');

	const calculateMaxHeight = useCallback(() => {
		if (contentRef.current) {
			return `${contentRef.current.scrollHeight}px`;
		}
		return '0px';
	}, []);

	useEffect(() => {
		if (isOpen) {
			setMaxHeight(calculateMaxHeight());
		}
	}, [isOpen, calculateMaxHeight]);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	return { isOpen, toggleOpen, maxHeight, contentRef };
};

export default useAnimatedHeight;
