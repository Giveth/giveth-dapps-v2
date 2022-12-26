import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { useEvent } from './useEvent';

export enum EModalEvents {
	SIGNEDIN = 'signedin',
	CONNECTED = 'conneced',
}

const obj: Record<EModalEvents, 'showSignWithWallet' | 'showWalletModal'> = {
	[EModalEvents.SIGNEDIN]: 'showSignWithWallet',
	[EModalEvents.CONNECTED]: 'showWalletModal',
};

export const useModalCallback = (
	callback: () => void,
	event: EModalEvents = EModalEvents.SIGNEDIN,
) => {
	const dispatch = useAppDispatch();
	const cbRef = useEvent(callback);
	const showModal = useAppSelector(state => state.modal[obj[event]]);
	const signInThenDoSomething = () => {
		if (typeof window === 'undefined') return;
		window.addEventListener(event, cbRef, {
			once: true,
		});
		dispatch(setShowSignWithWallet(true));
	};

	useEffect(() => {
		if (showModal === false) {
			window.removeEventListener(event, cbRef);
		}
	}, [showModal]);
	return { signInThenDoSomething };
};
