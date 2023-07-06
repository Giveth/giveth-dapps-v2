export function getLocalStorageData(label: string) {
	const _data = localStorage.getItem(label);
	return _data ? JSON.parse(_data) : {};
}
