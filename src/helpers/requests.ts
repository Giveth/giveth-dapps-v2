import { isSSRMode } from '@/lib/helpers';
import links from '@/lib/constants/links';
import StorageLabel from '@/lib/localStorage';

export function sendRequest(
	url: string,
	method: 'POST' | 'GET',
	authorization: boolean = false,
	body?: {},
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	const token = !isSSRMode ? localStorage.getItem(StorageLabel.TOKEN) : null;
	const Authorization =
		authorization && token ? `Bearer ${token}` : undefined;
	const defaultHeaders = {
		'Content-Type': 'application/json',
		...additionalHeaders,
	};
	const headers = Authorization
		? {
				...defaultHeaders,
				Authorization,
				authVersion: '2',
		  }
		: { ...defaultHeaders };
	try {
		return fetch(url, {
			method,
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

export function getRequest(
	url: string,
	authorization: boolean = false,
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	return sendRequest(
		url,
		'GET',
		authorization,
		undefined,
		additionalHeaders,
		additionalOptions,
	);
}

export function postRequest(
	url: string,
	authorization: boolean = false,
	body: {} = {},
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	return sendRequest(
		url,
		'POST',
		authorization,
		body,
		additionalHeaders,
		additionalOptions,
	);
}

export function gqlRequest(
	url: string,
	authorization: boolean = false,
	query: string,
	variables: {} = {},
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	return postRequest(
		url,
		authorization,
		{
			query,
			variables,
		},
		additionalHeaders,
		additionalOptions,
	);
}

export function backendGQLRequest(
	query: string,
	variables: {} = {},
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	return postRequest(
		links.BACKEND,
		true,
		{
			query,
			variables,
		},
		additionalHeaders,
		additionalOptions,
	);
}
