import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { FETCH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import EditCauseIndex from '@/components/views/causes/edit/EditCauseIndex';

export default function CauseEditPage() {
	const { query } = useRouter();
	const id = query.id as string;

	const { data, loading } = useQuery(FETCH_PROJECT_BY_ID, {
		variables: { id: Number(id) },
		fetchPolicy: 'no-cache',
	});

	return <EditCauseIndex cause={data?.projectById} isLoadingPage={loading} />;
}
