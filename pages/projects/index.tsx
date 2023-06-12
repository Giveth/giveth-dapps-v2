import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { addApolloState, initializeApollo } from '@/apollo/apolloClient';
import {
	FETCH_ALL_PROJECTS,
	FETCH_MAIN_CATEGORIES,
} from '@/apollo/gql/gqlProjects';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import StorageLabel, { setWithExpiry } from '@/lib/localStorage';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { projectsMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';
import { countReferralClick } from '@/features/user/user.thunks';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { ICategory, IMainCategory, IProject } from '@/apollo/types/types';
import { ProjectsProvider } from '@/context/projects.context';

export interface IProjectsRouteProps {
	projects: IProject[];
	totalCount: number;
	categories: ICategory[];
	mainCategories: IMainCategory[];
}

const ProjectsRoute = (props: IProjectsRouteProps) => {
	const dispatch = useAppDispatch();
	const { userData, isLoading, isSignedIn } = useAppSelector(
		state => state.user,
	);
	const { projects, mainCategories, totalCount, categories } = props;

	const router = useRouter();
	const referrerId = router?.query?.referrer_id;

	useEffect(() => {
		if (referrerId && !isLoading) {
			if (!isSignedIn) {
				// forces user to login grab the wallet
				dispatch(setShowSignWithWallet(true));
			} else {
				if (!userData?.wasReferred && !userData?.isReferrer) {
					// this sets the cookie saying this session comes from a referal
					setWithExpiry(
						StorageLabel.CHAINVINEREFERRED,
						referrerId,
						1 * 24 * 60 * 60,
					);
					// sends click counter for chainvine only if I am not a referrer
					// or haven't being referre
					dispatch(
						countReferralClick({
							referrerId: referrerId.toString(),
							walletAddress: userData?.walletAddress!,
						}),
					);
				}
			}
		}
	}, [referrerId, isSignedIn]);

	return (
		<ProjectsProvider mainCategories={mainCategories}>
			<GeneralMetatags info={projectsMetatags} />
			<ProjectsIndex
				projects={projects}
				totalCount={totalCount}
				categories={categories}
			/>
		</ProjectsProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	try {
		const apolloClient = initializeApollo();
		const { data } = await apolloClient.query({
			query: FETCH_ALL_PROJECTS,
			...OPTIONS_HOME_PROJECTS,
			fetchPolicy: 'network-only',
		});

		const {
			data: { mainCategories },
		}: {
			data: { mainCategories: IMainCategory[] };
		} = await apolloClient.query({
			query: FETCH_MAIN_CATEGORIES,
			fetchPolicy: 'network-only',
		});
		const allCategoriesItem = {
			title: 'All',
			description: '',
			banner: '',
			slug: 'all',
			categories: [],
			selected: false,
		};
		const updatedMaincategory = [allCategoriesItem, ...mainCategories];

		const { projects, totalCount, categories } = data.allProjects;
		return addApolloState(apolloClient, {
			props: {
				projects,
				mainCategories: updatedMaincategory,
				totalCount,
				categories,
			},
		});
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
};

export default ProjectsRoute;
