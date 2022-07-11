import { useEffect, useState } from 'react';

// This custom hook handles fade out animation when modals close
const useModal = () => {
	const [showModal, setShowModal] = useState(false);
	const [showModalWithDelay, setShowModalWithDelay] = useState(false);

	const handleShowModal = (value: boolean) => {
		if (value) {
			setShowModalWithDelay(value);
			setShowModal(value);
		} else {
			setShowModal(value);
		}
	};

	useEffect(() => {
		if (!showModal && showModalWithDelay) {
			setTimeout(() => {
				setShowModalWithDelay(false);
			}, 270);
		}
	}, [showModal]);

	return {
		showModal,
		setShowModal: handleShowModal,
		showModalWithDelay,
	};
};

export default useModal;
