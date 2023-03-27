import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import { gqlRequest } from '@/helpers/requests';
import { buildUsersPfpInfoQuery } from '@/lib/subgraph/pfpQueryBuilder';
import { clearPfpPendingList } from '@/features/pfp/pfp.slice';

const PfpController = () => {
	const dispatch = useAppDispatch();
	const { pendingList } = useAppSelector(state => state.pfp);

	useEffect(() => {
		let interval: NodeJS.Timer;
		if (pendingList && pendingList.length > 0) {
			interval = setInterval(async () => {
				console.log('pendingList', pendingList);
				try {
					const query = buildUsersPfpInfoQuery(pendingList);
					console.log('query', query);
					const { data } = await gqlRequest(
						config.MAINNET_CONFIG.subgraphAddress,
						false,
						query,
					);
					console.log('data', data);
					dispatch(clearPfpPendingList());
					// if (data[`user_${walletAddress}`]) {
					// 	console.log(
					// 		'data[`user_${walletAddress}`]',
					// 		data[`user_${walletAddress}`],
					// 		user,
					// 	);
					// }
				} catch (error) {
					console.error('error', error);
				}
			}, config.PFP_POLLING_INTERVAL);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [pendingList]);
	return null;
};

export default PfpController;
