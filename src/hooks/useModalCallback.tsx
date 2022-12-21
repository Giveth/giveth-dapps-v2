import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';

export const useModalCallback = (callback: () => void) => {
	const dispatch = useAppDispatch();
	const showSignWithWallet = useAppSelector(
		state => state.modal.showSignWithWallet,
	);
	const signInThenDoSomething = () => {
		if (typeof window === 'undefined') return;
		window.addEventListener('signin', callback, {
			once: true,
		});
		dispatch(setShowSignWithWallet(true));
	};

	useEffect(() => {
		if (showSignWithWallet === false) {
			window.removeEventListener('signin', callback);
		}
	}, [showSignWithWallet]);
	return { signInThenDoSomething };
};
