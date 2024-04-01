import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ITokenStreams } from '@/context/donate.context';
import { fetchUserStreams } from '@/services/donation';

export const useUserStreams = () => {
	const [tokenStreams, setTokenStreams] = useState<ITokenStreams>({});
	const { address } = useAccount();

	const fetchUserStreamsData = useCallback(async () => {
		if (!address) return;
		const _tokenStreams = await fetchUserStreams(address);
		setTokenStreams(_tokenStreams);
	}, [address]); // `address` is a dependency here

	// Call the fetch logic on initial render and when address changes
	useEffect(() => {
		fetchUserStreamsData();
	}, [fetchUserStreamsData]); // `fetchUserStreamsData` is stable thanks to `useCallback`

	return { tokenStreams, refetch: fetchUserStreamsData };
};
