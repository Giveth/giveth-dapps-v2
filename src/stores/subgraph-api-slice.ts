import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ISubgraphValue } from '@/context/subgraph.context';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';

interface props {
	chain?: number;
	userAddress?: string | null;
}

export const subgraphApiSlice = createApi({
	reducerPath: 'subgraph',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://api.thegraph.com/subgraphs/name/mohammadranjbarz',
	}),
	endpoints(builder) {
		return {
			getSubgraphValues: builder.query<ISubgraphValue | {}, props>({
				query(props) {
					const reqBody = {
						query: SubgraphQueryBuilder.getXDaiQuery(
							props.userAddress ?? '',
						),
					};
					// throw new Error('boroooo');
					return {
						url: `/giv-economy-xdai-develop`,
						body: JSON.stringify(reqBody),
						method: 'POST',
					};
				},
				transformResponse: (
					response: { data: ISubgraphValue },
					meta,
					arg,
				) => {
					console.log('meta', meta);
					return transformSubgraphData(response.data);
				},
			}),
		};
	},
});

export const { useGetSubgraphValuesQuery } = subgraphApiSlice;
