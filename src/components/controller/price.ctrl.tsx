import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppSelector, useAppDispatch } from '@/features/hooks';
import { useLiquidityPositions } from '@/hooks/useLiquidityPositions';
import {
	getEthPrice,
	getGivXDaiPrice,
	getGivMainnetPrice,
	getThirdPartiesMainnetTokenPrices,
	getThirdPartiesXDaiTokenPrices,
} from '@/features/price/price.thunks';
import { setGivPrice } from '@/features/price/price.slice';
import config from '@/configuration';

const PriceController = () => {
	const dispatch = useAppDispatch();
	const { chainId } = useWeb3React();
	const { pool } = useLiquidityPositions();
	const xDaiValues = useAppSelector(state => state.subgraph.xDaiValues);

	const { ethPrice, mainnetPrice, xDaiPrice } = useAppSelector(
		state => state.price,
	);

	useEffect(() => {
		dispatch(getGivXDaiPrice({ xDaiValues, ethPrice }));
	}, [xDaiValues, ethPrice]);

	useEffect(() => {
		if (pool) {
			dispatch(getGivMainnetPrice({ pool, ethPrice }));
		}
	}, [pool, ethPrice]);

	useEffect(() => {
		const getPrices = async () => {
			await dispatch(getEthPrice());
			await dispatch(getThirdPartiesMainnetTokenPrices());
			await dispatch(getThirdPartiesXDaiTokenPrices());
		};
		getPrices();
	}, []);

	useEffect(() => {
		switch (chainId) {
			case config.XDAI_NETWORK_NUMBER:
				xDaiPrice && dispatch(setGivPrice(xDaiPrice));
				break;

			case config.MAINNET_NETWORK_NUMBER:
			default:
				mainnetPrice && dispatch(setGivPrice(mainnetPrice));
				break;
		}
	}, [chainId, xDaiPrice, mainnetPrice]);

	return null;
};

export default PriceController;
