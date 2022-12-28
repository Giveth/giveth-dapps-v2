import StorageLabel from '@/lib/localStorage';

export function getTokens() {
	const _tokens = localStorage.getItem(StorageLabel.TOKENS);
	return _tokens ? JSON.parse(_tokens) : {};
}
