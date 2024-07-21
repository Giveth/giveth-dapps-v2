import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

const checkGnosisSafe = () => {
	try {
		if (typeof window !== 'undefined' && window.self !== window.top) {
			const parentUrl = window.location.ancestorOrigins[0];
			if (parentUrl) {
				const parsedUrl = new URL(parentUrl);
				const isSafe = parsedUrl.hostname.includes('safe');
				return isSafe;
			} else {
				return false;
			}
		}
	} catch (error) {
		console.error('Error checking Gnosis Safe:', error);
		return false;
	}
};
function useSafeAutoConnect() {
	const { address } = useAccount();
	const { connect, connectors } = useConnect();

	useEffect(() => {
		const autoConnect = async () => {
			const safeConnector = connectors.find(
				connector => connector.id === 'safe',
			);
			const isGnosisSafeIframe = checkGnosisSafe();

			if (safeConnector && isGnosisSafeIframe) {
				try {
					await connect({ connector: safeConnector });
				} catch (error) {
					console.error('Failed to connect with Gnosis Safe:', error);
				}
			}
		};

		autoConnect();
	}, [address, connectors]);
}

function useIsSafeEnvironment() {
	const isGnosisSafeIframe = checkGnosisSafe();
	return !!isGnosisSafeIframe;
}

export { useSafeAutoConnect, useIsSafeEnvironment };
