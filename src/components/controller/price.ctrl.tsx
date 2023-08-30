import { useEffect } from 'react';
import { useChainId } from 'wagmi';
import { useAppDispatch } from '@/features/hooks';
import {
	fetchGIVPriceAsync,
	fetchGnosisThirdPartyTokensPriceAsync,
	fetchMainnetThirdPartyTokensPriceAsync,
} from '@/features/price/price.thunks';

const PriceController = () => {
	const dispatch = useAppDispatch();
	const chainId = useChainId();

	useEffect(() => {
		const _chainId = chainId ?? 0;
		dispatch(fetchGIVPriceAsync(_chainId));
		dispatch(fetchMainnetThirdPartyTokensPriceAsync());
		dispatch(fetchGnosisThirdPartyTokensPriceAsync());
	}, [chainId]);
	return null;
};

export default PriceController;
