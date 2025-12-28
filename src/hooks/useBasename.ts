import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { isAddress, toCoinType } from 'viem';
import config from '@/configuration';

/**
 * Resolve a Base Basename (ENS-compatible) for an address.
 *
 * Note: We intentionally always resolve on Base (config.BASE_NETWORK_NUMBER),
 * regardless of the currently connected chain.
 *
 * @see https://docs.base.org/base-account/framework-integrations/wagmi/basenames
 */
export function useBasename(address?: string | null, enabled = true) {
	const client = usePublicClient({ chainId: config.BASE_NETWORK_NUMBER });
	const [basename, setBasename] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			if (!enabled || !address || !isAddress(address) || !client) {
				setBasename(null);
				return;
			}

			setIsLoading(true);
			try {
				const name = await client.getEnsName({
					address: address as `0x${string}`,
					coinType: toCoinType(config.BASE_NETWORK_NUMBER),
				});
				if (!cancelled) setBasename(name);
			} catch {
				if (!cancelled) setBasename(null);
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		run();
		return () => {
			cancelled = true;
		};
	}, [enabled, address, client]);

	return { basename, isLoading };
}




