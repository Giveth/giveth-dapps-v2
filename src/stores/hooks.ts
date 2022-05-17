import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import config from '@/configuration';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const currentValuesHelper = (chainId?: number) =>
	chainId === config.MAINNET_NETWORK_NUMBER ? 'mainnetValues' : 'xDaiValues';
