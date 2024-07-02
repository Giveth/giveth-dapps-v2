import { useAccount, useConnect } from 'wagmi';
import { useEffect, useState } from 'react';

function useSafeAutoConnect() {
	const { address } = useAccount();
	const { connect, connectors } = useConnect();

	useEffect(() => {
		const autoConnect = async () => {
			const safeConnector = connectors.find(
				connector => connector.id === 'safe',
			);
			if (safeConnector) {
				try {
					await connect({ connector: safeConnector });
				} catch (error) {
					console.error('Failed to connect with Gnosis Safe:', error);
				}
			}
		};

		autoConnect();
	}, [address]);
}

function useIsSafeEnvironment() {
	const { connect, connectors } = useConnect();
	const [isSafe, setIsSafe] = useState(false);

	useEffect(() => {
		const checkForSafeConnector = async () => {
			const safeConnector = connectors.find(
				connector => connector.id === 'safe',
			);
			if (safeConnector) {
				try {
					const connection: any = await connect({
						connector: safeConnector,
					});
					setIsSafe(!!connection);
				} catch (error) {
					console.error('Failed to connect with Gnosis Safe:', error);
					setIsSafe(false);
				}
			}
		};

		checkForSafeConnector();
	}, [connectors]);

	return isSafe;
}

export { useSafeAutoConnect, useIsSafeEnvironment };
