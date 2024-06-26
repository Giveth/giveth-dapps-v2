import { useConnect } from 'wagmi';
import { useEffect, useState } from 'react';

async function hasSafeConnector(connectors: any) {
	return connectors.some((connector: any) => connector.id === 'safe');
}

function useSafeAutoConnect() {
	const { connect, connectors } = useConnect();
	const isSafeEnv = useIsSafeEnvironment();

	useEffect(() => {
		const autoConnect = async () => {
			if (!isSafeEnv) return;

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
	}, [connect, connectors, isSafeEnv]);
}

function useIsSafeEnvironment() {
	const { connectors } = useConnect();
	const [isSafe, setIsSafe] = useState(false);

	useEffect(() => {
		const checkForSafeConnector = async () => {
			const safeExists = await hasSafeConnector(connectors);
			setIsSafe(safeExists);
		};

		checkForSafeConnector();
	}, [connectors]);

	return isSafe;
}

export { useSafeAutoConnect, useIsSafeEnvironment };
