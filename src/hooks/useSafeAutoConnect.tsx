import { useConnect } from 'wagmi';
import { useEffect, useState } from 'react';

const AUTOCONNECTED_CONNECTOR_IDS = ['safe'];

function checkForSafeConnector(connectors: any) {
	return AUTOCONNECTED_CONNECTOR_IDS.some(connector => {
		return connectors.find((c: any) => c.id === connector && c.ready);
	});
}

function useSafeAutoConnect() {
	const { connect, connectors } = useConnect();
	const isSafeEnv = useIsSafeEnvironment();

	useEffect(() => {
		if (checkForSafeConnector(connectors)) {
			const connectorInstance = connectors.find(
				c => c.id === AUTOCONNECTED_CONNECTOR_IDS[0] && c.ready,
			);
			connect({ connector: connectorInstance });
		}
	}, [connect, connectors, isSafeEnv]);
}

function useIsSafeEnvironment() {
	const { connectors } = useConnect();
	const [isSafe, setIsSafe] = useState<null | Boolean>(null);

	useEffect(() => {
		setIsSafe(checkForSafeConnector(connectors));
	}, [connectors]);

	return !!isSafe;
}

export { useSafeAutoConnect, useIsSafeEnvironment };
