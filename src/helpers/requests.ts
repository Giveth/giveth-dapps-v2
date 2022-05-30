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
	body: {} = {},
	authorization: boolean = false,
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

interface IGraphQLBody {
	query?: string;
	mutation?: string;
	variables?: {};
}

export function gqlRequest(
	url: string,
	body: IGraphQLBody,
	authorization: boolean = false,
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	return postRequest(
		url,
		body,
		authorization,
		additionalHeaders,
		additionalOptions,
	);
}

export function backendGQLRequest(
	body: IGraphQLBody,
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	return postRequest(
		links.BACKEND,
		body,
		true,
		additionalHeaders,
		additionalOptions,
	);
}
