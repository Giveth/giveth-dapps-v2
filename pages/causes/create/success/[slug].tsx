import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { FETCH_PROJECT_BY_SLUG_SUCCESS } from '@/apollo/gql/gqlProjects';
import SuccessfulCauseCreation from '@/components/views/causes/create/SuccessfulCauseCreation';

export default function CauseSuccessPage() {
	const { query } = useRouter();
	const slug = query.slug as string;

	const { data, loading } = useQuery(FETCH_PROJECT_BY_SLUG_SUCCESS, {
		variables: { slug },
		skip: !slug,
	});

	return (
		<SuccessfulCauseCreation cause={data?.project} isLoading={loading} />
	);
}
