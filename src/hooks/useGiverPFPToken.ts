import { useState, useEffect } from 'react';
import { IGiverPFPToken } from '@/apollo/types/types';
import { useAppSelector, useAppDispatch } from '@/features/hooks';
import { addAccountToPfpPending } from '@/features/pfp/pfp.slice';

export const useGiverPFPToken = (walletAddress?: string, avatar?: string) => {
	const [pfpToken, setPfpToken] = useState<IGiverPFPToken | null>(null);
	const { List } = useAppSelector(state => state.pfp);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!walletAddress || !avatar) return;
		const _pfpToken = List[walletAddress.toLowerCase()];
		if (_pfpToken === undefined) {
			dispatch(
				addAccountToPfpPending({
					address: walletAddress,
					avatar: avatar,
				}),
			);
		} else {
			if (_pfpToken !== false) {
				setPfpToken(_pfpToken);
			}
		}
	}, [List, walletAddress, avatar, dispatch]);
	return pfpToken;
};
