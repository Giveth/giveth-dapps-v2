import { useMemo } from 'react';
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import gql from 'graphql-tag';
import { createUploadLink } from 'apollo-upload-client';
import merge from 'deepmerge';
import isEqual from 'lodash.isequal';
import { getLocalStorageUserLabel } from '@/services/auth';
import { isSSRMode } from '@/lib/helpers';
import links from '@/lib/constants/links';

let apolloClient: any;

const ssrMode = isSSRMode;

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

function createApolloClient() {
	// Declare variable to store authToken
	let token: any;
	const appUser = getLocalStorageUserLabel();

	const httpLink = createUploadLink({
		uri: links.BACKEND,
	}) as unknown as ApolloLink;

	const authLink = setContext((_, { headers }) => {
		// get the authentication token from local storage if it exists
		if (!ssrMode)
			token = localStorage.getItem(getLocalStorageUserLabel() + '_token');

		// return the headers to the context so httpLink can read them
		const mutation: any = {
			Authorization: token ? `Bearer ${token}` : '',
		};
		if (!ssrMode && localStorage.getItem(appUser)) {
			const userFromStorage = localStorage.getItem(appUser) as string;
			const user = JSON.parse(userFromStorage);
			const userAddress = user?.addresses && user.addresses[0];

			if (userAddress) mutation['wallet-address'] = userAddress;
		}

		return {
			headers: {
				...headers,
				...mutation,
			},
		};
	});

	return new ApolloClient({
		ssrMode,
		link: authLink.concat(httpLink),
		cache: new InMemoryCache(),
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
