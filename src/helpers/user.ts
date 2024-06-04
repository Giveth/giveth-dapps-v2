import StorageLabel from '@/lib/localStorage';
import { getLocalStorageData } from './localstorage';
import { IUser } from '@/apollo/types/types';

export function getTokens() {
	return getLocalStorageData(StorageLabel.TOKENS);
}

export function getUserName(user?: IUser, short = false) {
	if (!user) return 'Unknown';
	return user.name ||
		`${user.firstName || ''} ${user.lastName || ''}`.trim() ||
		short
		? user.walletAddress?.substring(0, 8) + '...'
		: user.walletAddress;
}
