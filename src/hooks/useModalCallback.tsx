import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowSignWithWallet,
	setShowWalletModal,
} from '@/features/modal/modal.slice';
import { useEvent } from './useEvent';

export enum EModalEvents {
	SIGNEDIN = 'signedin',
	CONNECTED = 'connected',
}

const stateObj: Record<EModalEvents, 'showSignWithWallet' | 'showWalletModal'> =
	{
		[EModalEvents.SIGNEDIN]: 'showSignWithWallet',
		[EModalEvents.CONNECTED]: 'showWalletModal',
	};

const actionObj: Record<
	EModalEvents,
	typeof setShowSignWithWallet | typeof setShowWalletModal
> = {
	[EModalEvents.SIGNEDIN]: setShowSignWithWallet,
	[EModalEvents.CONNECTED]: setShowWalletModal,
};

export const useModalCallback = (
	callback: () => void,
	event: EModalEvents = EModalEvents.SIGNEDIN,
) => {
	const dispatch = useAppDispatch();
	const cbRef = useEvent(callback);
	const showModal = useAppSelector(state => state.modal[stateObj[event]]);
	const modalCallback = () => {
		if (typeof window === 'undefined') return;
		window.addEventListener(event, cbRef, {
			once: true,
		});
		dispatch(actionObj[event](true));
	};

	useEffect(() => {
		if (showModal === false) {
			window.removeEventListener(event, cbRef);
		}
	}, [showModal]);
	return { modalCallback };
};
