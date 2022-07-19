import { useState, useEffect } from 'react';

export const useModalAnimation = (setShowModal: (value: boolean) => void) => {
	const [isAnimating, setIsAnimating] = useState(true);

	const closeModal = () => {
		setIsAnimating(true);
		setTimeout(() => {
			setShowModal(false);
		}, 300);
	};

	useEffect(() => {
		setIsAnimating(false);
	}, []);

	return { isAnimating, closeModal };
};
