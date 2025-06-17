import { FC } from 'react';
import { client } from '@/apollo/apolloClient';
import { FETCH_CAUSE_BY_SLUG_SINGLE_CAUSE } from '@/apollo/gql/gqlCauses';

import { useReferral } from '@/hooks/useReferral';
import { CauseProvider } from '@/context/cause.context';
import CauseIndex from '@/components/views/cause/CauseIndex';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';

const ProjectRoute: FC<IProjectBySlug> = ({ project }) => {
	useReferral();

	return (
		<CauseProvider project={project}>
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

		const { data } = await client.query({
			query: FETCH_CAUSE_BY_SLUG_SINGLE_CAUSE,
			variables: { slug },
			fetchPolicy: 'no-cache',
		});

		return {
			props: {
				project: data.projectBySlug,
			},
		};
	} catch (error) {
		// TODO: Handle 502 error
		return {
			props: {},
		};
	}
}

export default ProjectRoute;
