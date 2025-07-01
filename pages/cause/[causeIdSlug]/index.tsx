import { FC } from 'react';
import { client } from '@/apollo/apolloClient';
import { FETCH_CAUSE_BY_SLUG_SINGLE_CAUSE } from '@/apollo/gql/gqlCauses';

import { useReferral } from '@/hooks/useReferral';
import CauseIndex from '@/components/views/cause/CauseIndex';
import { ICauseBySlug } from '@/apollo/types/gqlTypes';
import { ProjectProvider } from '@/context/project.context';

const CauseRoute: FC<ICauseBySlug> = ({ cause }) => {
	useReferral();

	return (
		<ProjectProvider project={cause}>
			<CauseIndex />
		</ProjectProvider>
	);
};

export async function getServerSideProps(props: {
	query: { causeIdSlug: string };
}) {
	try {
		const { query } = props;
		const slug = decodeURI(query.causeIdSlug).replace(/\s/g, '');

		const { data } = await client.query({
			query: FETCH_CAUSE_BY_SLUG_SINGLE_CAUSE,
			variables: { slug },
			fetchPolicy: 'no-cache',
		});

		console.log('🧪 data', data);

		return {
			props: {
				cause: data.causeBySlug,
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
