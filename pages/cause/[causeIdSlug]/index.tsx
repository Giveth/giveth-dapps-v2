import { FC } from 'react';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_CAUSE_BY_SLUG_SINGLE_CAUSE, // TODO: Remove this after testing
	FETCH_CAUSE_BY_ID_SINGLE_CAUSE,
} from '@/apollo/gql/gqlCauses';

import { useReferral } from '@/hooks/useReferral';
import { CauseProvider } from '@/context/cause.context';
import CauseIndex from '@/components/views/cause/CauseIndex';
import { ICauseBySlug } from '@/apollo/types/gqlTypes';

const CauseRoute: FC<ICauseBySlug> = ({ cause }) => {
	useReferral();

	return (
		<CauseProvider cause={cause}>
			<CauseIndex />
		</CauseProvider>
	);
};

export async function getServerSideProps(props: {
	query: { causeIdSlug: string };
}) {
	try {
		const { query } = props;
		const slug = decodeURI(query.causeIdSlug).replace(/\s/g, '');

		console.log('🧪 slug', slug);

		const { data } = await client.query({
			// query: FETCH_CAUSE_BY_SLUG_SINGLE_CAUSE,
			query: FETCH_CAUSE_BY_ID_SINGLE_CAUSE,
			// variables: { slug },
			variables: { id: 4 },
			fetchPolicy: 'no-cache',
		});

		console.log('🧪 data', data);

		return {
			props: {
				cause: data.cause,
			},
		};
	} catch (error) {
		// TODO: Handle 502 error
		return {
			props: {},
		};
	}
}

export default CauseRoute;
