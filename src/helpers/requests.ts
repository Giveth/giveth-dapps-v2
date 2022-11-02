import { isSSRMode } from '@/lib/helpers';
import StorageLabel from '@/lib/localStorage';
import config from '@/configuration';
import type { GraphQLErrors } from '@apollo/client/errors';

export function sendRequest(
	url: string,
	method: 'POST' | 'GET' | 'PUT',
	authorization: boolean = false,
	body?: {},
	query?: {},
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
		return fetch(url + '?' + new URLSearchParams(query), {
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
					(errorObject.message || errorObject?.errors[0]?.message) ??
					'An error occurred';
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
	query: {} = {},
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	return sendRequest(
		url,
		'GET',
		authorization,
		undefined,
		query,
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
		undefined,
		additionalHeaders,
		additionalOptions,
	);
}

export function putRequest(
	url: string,
	authorization: boolean = false,
	body: {} = {},
	additionalHeaders: HeadersInit = {},
	additionalOptions: RequestInit = {},
) {
	return sendRequest(
		url,
		'PUT',
		authorization,
		body,
		undefined,
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
		config.BACKEND_LINK,
		true,
		{
			query,
			variables,
		},
		additionalHeaders,
		additionalOptions,
	);
}

export const transformGraphQLErrorsToStatusCode = (
	graphQLErrors: GraphQLErrors,
) => {
	if (!graphQLErrors || graphQLErrors.length < 1) return 500;
	const { message } = graphQLErrors[0];
	if (message.includes('not found')) return 404;
	return 500;
};
