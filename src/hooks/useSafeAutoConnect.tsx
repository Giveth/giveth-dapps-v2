import { useConnect } from 'wagmi';
import { useEffect } from 'react';

const AUTOCONNECTED_CONNECTOR_IDS = ['safe'];

function useSafeAutoConnect() {
	const { connect, connectors } = useConnect();

	useEffect(() => {
		AUTOCONNECTED_CONNECTOR_IDS.forEach(connector => {
			const connectorInstance = connectors.find(
				c => c.id === connector && c.ready,
			);

			if (connectorInstance) {
				connect({ connector: connectorInstance });
			}
		});
	}, [connect, connectors]);
}

export { useSafeAutoConnect };
