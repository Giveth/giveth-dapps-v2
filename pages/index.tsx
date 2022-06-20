import { useEffect, useState } from 'react';

import HomeIndex from '@/components/views/homepage/HomeIndex';
import { client } from '@/apollo/apolloClient';
import { FETCH_HOME_PROJECTS } from '@/apollo/gql/gqlProjects';
import { EDirection, gqlEnums } from '@/apollo/types/gqlEnums';
import { IProject } from '@/apollo/types/types';
import { useAppSelector } from '@/features/hooks';
import { homeMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

const projectsToFetch = 12;

interface IHomeRoute {
	projects: IProject[];
	totalCount: number;
}

const fetchProjects = async (userId: string | undefined = undefined) => {
	const variables: any = {
		limit: projectsToFetch,
		orderBy: { field: gqlEnums.QUALITYSCORE, direction: EDirection.DESC },
	};

	if (userId) {
		variables.connectedWalletUserId = Number(userId);
	}
	const { data } = await client.query({
		query: FETCH_HOME_PROJECTS,
		variables,
		fetchPolicy: 'network-only',
	});

	return data.projects;
};

const HomeRoute = (props: IHomeRoute) => {
	const user = useAppSelector(state => state.user.userData);
	const [projects, setProjects] = useState(props.projects);
	const [totalCount, setTotalCount] = useState(props.totalCount);

	useEffect(() => {
		fetchProjects(user?.id).then(({ projects, totalCount }) => {
			setProjects(projects);
			setTotalCount(totalCount);
		});
	}, [user]);

	return (
		<>
			<GeneralMetatags info={homeMetatags} />
			<HomeIndex projects={projects} totalCount={totalCount} />
		</>
	);
};

export async function getServerSideProps({ res }: any) {
	res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59',
	);

	const { projects, totalCount } = await fetchProjects();

	return {
		props: {
			projects,
			totalCount,
		},
	};
}

export default HomeRoute;
