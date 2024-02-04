import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ITokenStreams } from '@/context/donate.context';
import { fetchUserStreams } from '@/services/donation';

export const useUserStreams = () => {
	const [tokenStreams, setTokenStreams] = useState<ITokenStreams>({});
	const { address } = useAccount();
	useEffect(() => {
		if (!address) return;
		// fetch user's streams
		const fetchData = async () => {
			const _tokenStreams = await fetchUserStreams(address);
			setTokenStreams(_tokenStreams);
		};
		fetchData();
	}, [address]);
	return tokenStreams;
};
