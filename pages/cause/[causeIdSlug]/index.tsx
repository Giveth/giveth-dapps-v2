import { FC } from 'react';
import Head from 'next/head';
import { client } from '@/apollo/apolloClient';

import { useReferral } from '@/hooks/useReferral';
import CauseIndex from '@/components/views/cause/CauseIndex';
import { ICauseBySlug } from '@/apollo/types/gqlTypes';
import { ProjectProvider } from '@/context/project.context';
import { ProjectMeta } from '@/components/Metatag';
import { EProjectType } from '@/apollo/types/gqlEnums';
import { FETCH_CAUSE_BY_SLUG_SINGLE_CAUSE } from '@/apollo/gql/gqlCauses';

const CauseRoute: FC<ICauseBySlug> = ({ cause }) => {
	useReferral();

	return (
		<ProjectProvider project={cause}>
			<Head>
				<title>{cause?.title} | Giveth</title>
				<ProjectMeta project={cause} preTitle='Cause' />
			</Head>
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

		// Perform redirect on server side for projects
		if (data.projectBySlug?.projectType === EProjectType.PROJECT) {
			return {
				redirect: {
					destination: `/project/${data.projectBySlug.slug}`,
					permanent: false,
				},
			};
		}

		return {
			props: {
				cause: data.projectBySlug,
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
