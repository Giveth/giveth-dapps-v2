import StorageLabel from '@/lib/localStorage';
import { getLocalStorageData } from './localstorage';

export function getPassports() {
	return getLocalStorageData(StorageLabel.PASSPORT);
}
