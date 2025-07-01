import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { FETCH_PROJECT_BY_SLUG_SUCCESS } from '@/apollo/gql/gqlProjects';
import SuccessfulCauseCreation from '@/components/views/causes/create/SuccessfulCauseCreation';

export default function CauseSuccessPage() {
	const { query } = useRouter();
	const slug = query.slug as string;

	console.log('🧪 slug', slug);

	const { data, loading } = useQuery(FETCH_PROJECT_BY_SLUG_SUCCESS, {
		variables: { slug },
		skip: !slug,
	});

	console.log('🧪 data', data);

	return (
		<SuccessfulCauseCreation
			cause={data?.projectBySlug}
			isLoading={loading}
		/>
	);
}
