const getLocalTokenLabel = (): string => {
	return getLocalUserLabel() + '_token';
};

const getLocalUserLabel = (): string => {
	return process.env.NEXT_PUBLIC_LOCAL_USER_LABEL
		? process.env.NEXT_PUBLIC_LOCAL_USER_LABEL +
				'_' +
				process.env.NEXT_PUBLIC_ENV
		: 'nextUser' + '_' + process.env.NEXT_PUBLIC_ENV;
};

const StorageLabel = {
	WALLET: 'selectedWallet',
	USER: getLocalUserLabel(),
	TOKEN: getLocalTokenLabel(),
	TOKENS: 'tokens',
	FIRSTMODALSHOWED: 'FIRSTMODALSHOWED',
	LOCALE: 'locale',
	CHAINVINEREFERRED: 'chainvineReferred',
	PASSPORT: 'passport',
};

export const setWithExpiry = (key: string, value: any, ttl: number) => {
	const now = new Date();
	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	};
	localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key: string) => {
	const itemStr = localStorage.getItem(key);
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null;
	}
	const item = JSON.parse(itemStr);
	const now = new Date();
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key);
		return null;
	}
	return item.value;
};

export default StorageLabel;
