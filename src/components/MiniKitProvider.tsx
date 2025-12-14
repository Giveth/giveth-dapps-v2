import { useEffect, useRef } from 'react';

interface MiniKitProviderProps {
	children: React.ReactNode;
}

export const MiniKitProvider: React.FC<MiniKitProviderProps> = ({
	children,
}) => {
	const initialized = useRef(false);

	useEffect(() => {
		// Prevent double initialization in React Strict Mode
		if (initialized.current) return;
		initialized.current = true;

		// Only run on client side
		if (typeof window === 'undefined') return;

		console.log('[MiniKit] useEffect triggered, calling ready()...');

		// Import and call ready() immediately
		import('@farcaster/miniapp-sdk')
			.then(({ sdk }) => {
				console.log('[MiniKit] SDK imported, calling ready()...');
				return sdk.actions.ready();
			})
			.then(() => {
				console.log('[MiniKit] ready() called successfully!');
			})
			.catch(err => {
				console.log('[MiniKit] Error:', err);
			});
	}, []);

	return <>{children}</>;
};

export default MiniKitProvider;
