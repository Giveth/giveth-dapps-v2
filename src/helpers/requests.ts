import { isSSRMode } from '@/lib/helpers';
import links from '@/lib/constants/links';
import StorageLabel from '@/lib/localStorage';

export function postRequest(
	url: string,
	body: {} = {},
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	const token = !isSSRMode ? localStorage.getItem(StorageLabel.TOKEN) : null;
	const Authorization = token ? `Bearer ${token}` : undefined;
	const defaultHeaders = {
		'Content-Type': 'application/json',
		...additionalHeaders,
	};
	const headers = Authorization
		? {
				...defaultHeaders,
				Authorization,
		  }
		: { ...defaultHeaders };
	try {
		return fetch(url, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
			...additionalOptions,
		}).then(async response => {
			if (response.ok) {
				return await response.json();
			} else {
				const errorObject = await response.json();
				const errorMessage =
					errorObject?.errors[0]?.message ?? 'An error occurred';
				return Promise.reject(new Error(errorMessage));
			}
		});
	} catch (error) {
		return Promise.reject(error);
	}
}

export function gqlRequest(
	query: string,
	variables: {} = {},
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	return postRequest(
		links.BACKEND,
		{
			query,
			variables,
		},
		additionalHeaders,
		additionalOptions,
	);
}
