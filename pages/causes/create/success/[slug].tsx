import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_CAUSE_BY_SLUG } from '@/apollo/gql/gqlCauses';
import SuccessfulCauseCreation from '@/components/views/causes/create/SuccessfulCauseCreation';

export default function CauseSuccessPage() {
	const { query } = useRouter();
	const slug = query.slug as string;

	const { data, loading } = useQuery(GET_CAUSE_BY_SLUG, {
		variables: { slug },
		skip: !slug,
	});

	return <SuccessfulCauseCreation cause={data?.cause} isLoading={loading} />;
}
