import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import gql from 'graphql-tag';
import { createUploadLink } from 'apollo-upload-client';
import merge from 'deepmerge';
import isEqual from 'lodash.isequal';
import { isSSRMode } from '@/lib/helpers';
import StorageLabel from '@/lib/localStorage';
import { store } from '@/features/store';
import { signOut } from '@/features/user/user.thunks';
import config from '@/configuration';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';

let apolloClient: any;

const ssrMode = isSSRMode;

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

const parseHeaders = (rawHeaders: any) => {
	const headers = new Headers();
	// Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	// https://tools.ietf.org/html/rfc7230#section-3.2
	const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	preProcessedHeaders.split(/\r?\n/).forEach((line: any) => {
		const parts = line.split(':');
		const key = parts.shift().trim();
		if (key) {
			const value = parts.join(':').trim();
			headers.append(key, value);
		}
	});
	return headers;
};

const uploadFetch = (url: string, options: any) =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = () => {
			const opts: any = {
				status: xhr.status,
				statusText: xhr.statusText,
				headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
			};
			opts.url =
				'responseURL' in xhr
					? xhr.responseURL
					: opts.headers.get('X-Request-URL');
			const body =
				'response' in xhr ? xhr.response : (xhr as any).responseText;
			resolve(new Response(body, opts));
		};
		xhr.onerror = () => {
			reject(new TypeError('Network request failed'));
		};
		xhr.ontimeout = () => {
			reject(new TypeError('Network request failed'));
		};
		xhr.open(options.method, url, true);

		Object.keys(options.headers).forEach(key => {
			xhr.setRequestHeader(key, options.headers[key]);
		});

		if (xhr.upload) {
			xhr.upload.onprogress = options.onProgress;
		}

		options.onAbortPossible(() => {
			xhr.abort();
		});

		xhr.send(options.body);
	});

const customFetch = (uri: any, options: any) => {
	if (options.useUpload) {
		return uploadFetch(uri, options);
	}
	return fetch(uri, options);
};

function createApolloClient() {
	let userWalletAddress: string | null;
	if (!ssrMode) {
		userWalletAddress = localStorage.getItem(StorageLabel.USER);
	}

	const httpLink = createUploadLink({
		uri: config.BACKEND_LINK,
		fetch: customFetch as any,
	}) as unknown as ApolloLink;

	const authLink = setContext((_, { headers }) => {
		let locale: string | null = !ssrMode
			? localStorage.getItem(StorageLabel.LOCALE)
			: 'en';
		const currentToken: string | null = !ssrMode
			? localStorage.getItem(StorageLabel.TOKEN)
			: null;
		const mutation: any = {
			Authorization: currentToken ? `Bearer ${currentToken}` : '',
			authVersion: '2',
			'Accept-Language': locale,
		};
		if (userWalletAddress) mutation['wallet-address'] = userWalletAddress;
		return {
			headers: {
				...headers,
				...mutation,
			},
		};
	});

	const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
		if (graphQLErrors)
			graphQLErrors.forEach(({ message, locations, path }) => {
				console.log(`[GraphQL error]: ${message}`, { locations, path });
				if (message.toLowerCase().includes('authentication required')) {
					console.log(Date.now(), 'sign out from graphQL');
					//   removes token and user from store
					store.dispatch(signOut()).finally(() => {
						//show signin modal
						store.dispatch(setShowSignWithWallet(true));
					});
				}
			});
		if (networkError) console.log(`[Network error]: ${networkError}`);
		const { response } = operation.getContext();

		if (
			response?.status === 401 ||
			response?.data?.errors[0]?.message === 'unAuthorized'
		) {
			//   removes token and user from store
			const currentToken: string | null = !ssrMode
				? localStorage.getItem(StorageLabel.TOKEN)
				: null;
			store.dispatch(signOut(currentToken));
		}
	});

	return new ApolloClient({
		ssrMode,
		link: errorLink.concat(authLink.concat(httpLink)),
		cache: new InMemoryCache({
			addTypename: false,
		}),
		defaultOptions: {
			watchQuery: {
				fetchPolicy: 'cache-and-network',
			},
			query: {
				fetchPolicy: 'network-only',
				// nextFetchPolicy: 'network-only',
			},
		},
		typeDefs: gql`
			enum OrderField {
				CreationDate
				Balance
				QualityScore
				Verified
				Hearts
				Donations
				RecentlyAdded
				OldProjects
			}

			enum OrderDirection {
				ASC
				DESC
			}

			type OrderBy {
				field: OrderField!
				direction: OrderDirection!
			}
		`,
	});
}

export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();

	// If your page has Next.js data fetching methods that use Apollo Client, the initial state
	// gets hydrated here
	if (initialState) {
		// Get existing cache, loaded during client side data fetching
		const existingCache = _apolloClient.extract();

		// Merge the existing cache into data passed from getStaticProps/getServerSideProps
		const data = merge(initialState, existingCache, {
			// combine arrays using object equality (like in sets)
			arrayMerge: (destinationArray, sourceArray) => [
				...sourceArray,
				...destinationArray.filter(d =>
					sourceArray.every(s => !isEqual(d, s)),
				),
			],
		});

		// Restore the cache with the merged data
		_apolloClient.cache.restore(data);
	}
	// For SSG and SSR always create a new Apollo Client
	if (ssrMode) return _apolloClient;
	// Create the Apollo Client once in the client
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function addApolloState(client: any, pageProps: any) {
	if (pageProps?.props) {
		pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
	}

	return pageProps;
}

export function useApollo(pageProps: any) {
	const state = pageProps[APOLLO_STATE_PROP_NAME];

	return useMemo(() => initializeApollo(state), [state]);
}

export const client = initializeApollo();
