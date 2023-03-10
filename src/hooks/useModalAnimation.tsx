import { useState, useEffect, useCallback } from 'react';

export const useModalAnimation = (setShowModal: (value: boolean) => void) => {
	const [isAnimating, setIsAnimating] = useState(true);

	const closeModal = useCallback(() => {
		setIsAnimating(true);
		setTimeout(() => {
			setShowModal(false);
			setIsAnimating(false);
		}, 300);
	}, []);

	useEffect(() => {
		setIsAnimating(false);
	}, []);

	return { isAnimating, closeModal };
};
