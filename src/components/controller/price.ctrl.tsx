import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useAppDispatch } from '@/features/hooks';
import {
	fetchGIVPriceAsync,
	fetchGnosisThirdPartyTokensPriceAsync,
	fetchMainnetThirdPartyTokensPriceAsync,
} from '@/features/price/price.thunks';

const PriceController = () => {
	const dispatch = useAppDispatch();
	const { chainId } = useWeb3React();

	useEffect(() => {
		const _chainId = chainId ?? 0;
		dispatch(fetchGIVPriceAsync(_chainId));
		dispatch(fetchMainnetThirdPartyTokensPriceAsync());
		dispatch(fetchGnosisThirdPartyTokensPriceAsync());
	}, [chainId]);
	return null;
};

export default PriceController;
