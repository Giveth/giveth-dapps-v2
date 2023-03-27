import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import config from '@/configuration';
import { gqlRequest } from '@/helpers/requests';
import { buildUsersPfpInfoQuery } from '@/lib/subgraph/pfpQueryBuilder';
import {
	clearPfpPendingList,
	IPfpList,
	updatePfpList,
} from '@/features/pfp/pfp.slice';
import { IUsersPFPTokens } from '@/apollo/types/types';

const PfpController = () => {
	const dispatch = useAppDispatch();
	const { pendingList } = useAppSelector(state => state.pfp);

	useEffect(() => {
		const _pendingList = Object.keys(pendingList);
		const interval: NodeJS.Timer = setInterval(async () => {
			try {
				if (_pendingList && _pendingList.length > 0) {
					const query = buildUsersPfpInfoQuery(_pendingList);
					const res = await gqlRequest(
						config.MAINNET_CONFIG.subgraphAddress,
						false,
						query,
					);
					const data: IUsersPFPTokens = res.data;
					const pfpList: IPfpList = {};
					for (const key in data) {
						if (Object.prototype.hasOwnProperty.call(data, key)) {
							const userPFPTokens = data[key];
							const address = key.slice(5);
							if (userPFPTokens && userPFPTokens.length > 0) {
								const userPFPToken = userPFPTokens.find(
									_userPFPTokens => {
										const avatarHash =
											pendingList[address].slice(21);
										const imageIpfsHash =
											_userPFPTokens.imageIpfs.slice(7);
										return avatarHash === imageIpfsHash;
									},
								);
								if (userPFPToken) {
									pfpList[address] = userPFPToken;
									continue;
								}
							}
							pfpList[address] = false;
						}
					}
					dispatch(updatePfpList(pfpList));
					dispatch(clearPfpPendingList());
				}
			} catch (error) {
				console.error('error', error);
			}
		}, config.PFP_POLLING_INTERVAL);
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [dispatch, pendingList]);
	return null;
};

export default PfpController;
