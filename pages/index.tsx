import { useEffect, useState } from 'react';

import HomeIndex from '@/components/views/homepage/HomeIndex';
import { client } from '@/apollo/apolloClient';
import {
	FETCH_ALL_PROJECTS,
	FETCH_PROJECTS_BY_SLUG,
} from '@/apollo/gql/gqlProjects';
import { ESortbyAllProjects } from '@/apollo/types/gqlEnums';
import { IProject } from '@/apollo/types/types';
import { useAppSelector } from '@/features/hooks';
import { homeMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';

interface IHomeRoute {
	projects: IProject[];
	totalCount: number;
	reliefTurkeyProjects?: IProject[];
}

const fetchProjects = async (userId: string | undefined = undefined) => {
	const variables: any = {
		limit: 12,
		sortingBy: ESortbyAllProjects.GIVPOWER,
	};

	if (userId) {
		variables.connectedWalletUserId = Number(userId);
	}
	const { data } = await client.query({
		query: FETCH_ALL_PROJECTS,
		variables,
		fetchPolicy: 'network-only',
	});

	return data.allProjects;
};

const fetchTurkeyReliefProjects = async () => {
	const variables: any = {
		skip: 0,
		slugs: [
			'gnosisdao-earthquake-relief',
			'banklessdao-turkey-disaster-relief-fund',
			'graceaid-earthquake-relief',
			'anka-relief',
			'earthquake-relief-qf-matching-pool',
		],
	};
	try {
		const { data } = await client.query({
			query: FETCH_PROJECTS_BY_SLUG,
			variables,
			fetchPolicy: 'network-only',
		});
		return data.projectsBySlugs;
	} catch (error) {
		console.log({ error });
	}
};

const HomeRoute = (props: IHomeRoute) => {
	const user = useAppSelector(state => state.user.userData);
	const [projects, setProjects] = useState(props.projects);
	const [reliefTurkeyProjects, setReliefTurkeyProjects] = useState(
		props.reliefTurkeyProjects,
	);
	const [totalCount, setTotalCount] = useState(props.totalCount);
	useEffect(() => {
		fetchTurkeyReliefProjects().then(({ projects }) => {
			setReliefTurkeyProjects(projects);
		});
		if (!user) return;
		fetchProjects(user?.id).then(({ projects, totalCount }) => {
			setProjects(projects);
			setTotalCount(totalCount);
		});
	}, [user]);

	return (
		<>
			<GeneralMetatags info={homeMetatags} />
			<HomeIndex
				projects={projects}
				totalCount={totalCount}
				reliefTurkeyProjects={reliefTurkeyProjects}
			/>
		</>
	);
};

export async function getServerSideProps({ res }: any) {
	res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59',
	);
	try {
		const { projects, totalCount } = await fetchProjects();
		const { projects: reliefTurkeyProjects } =
			await fetchTurkeyReliefProjects();

		return {
			props: {
				projects,
				reliefTurkeyProjects,
				totalCount,
			},
		};
	} catch (error: any) {
		const statusCode = transformGraphQLErrorsToStatusCode(
			error?.graphQLErrors,
		);
		return {
			props: {
				errorStatus: statusCode,
			},
		};
	}
}

export default HomeRoute;
