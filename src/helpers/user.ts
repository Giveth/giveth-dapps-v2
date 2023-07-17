import StorageLabel from '@/lib/localStorage';
import { getLocalStorageData } from './localstorage';

export function getTokens() {
	return getLocalStorageData(StorageLabel.TOKENS);
}
