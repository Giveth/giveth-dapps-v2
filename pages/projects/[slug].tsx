import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { IMainCategory } from '@/apollo/types/types';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import StorageLabel, { setWithExpiry } from '@/lib/localStorage';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { initializeApollo } from '@/apollo/apolloClient';
import { OPTIONS_HOME_PROJECTS } from '@/apollo/gql/gqlOptions';
import {
	FETCH_ALL_PROJECTS,
	FETCH_MAIN_CATEGORIES,
} from '@/apollo/gql/gqlProjects';
import { GeneralMetatags } from '@/components/Metatag';
import { countReferralClick } from '@/features/user/user.thunks';
import ProjectsIndex from '@/components/views/projects/ProjectsIndex';
import { projectsMetatags } from '@/content/metatags';
import { ProjectsProvider } from '@/context/projects.context';
import type { IProjectsRouteProps } from '.';

interface IProjectsCategoriesRouteProps extends IProjectsRouteProps {
	selectedMainCategory: IMainCategory;
}

const ProjectsCategoriesRoute = (props: IProjectsCategoriesRouteProps) => {
	const dispatch = useAppDispatch();
	const { userData, isLoading, isSignedIn } = useAppSelector(
		state => state.user,
	);
	const {
		projects,
		mainCategories,
		selectedMainCategory,
		totalCount,
		categories,
	} = props;

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
		<ProjectsProvider
			mainCategories={mainCategories}
			selectedMainCategory={selectedMainCategory}
		>
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
	const apolloClient = initializeApollo();
	const { variables, notifyOnNetworkStatusChange } = OPTIONS_HOME_PROJECTS;
	try {
		const { query } = context;
		const slug = query.slug;
		if (!slug)
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
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

		const updatedMainCategory = [allCategoriesItem, ...mainCategories];
		const selectedMainCategory = updatedMainCategory.find(mainCategory => {
			return mainCategory.slug === slug;
		});

		if (selectedMainCategory) {
			const updatedSelectedMainCategory = {
				...selectedMainCategory,
				selected: true,
			};
			const apolloClient = initializeApollo();
			const { data } = await apolloClient.query({
				query: FETCH_ALL_PROJECTS,
				variables: {
					...variables,
					mainCategory: updatedSelectedMainCategory.slug,
					notifyOnNetworkStatusChange,
				},
				fetchPolicy: 'network-only',
			});
			const { projects, totalCount, categories } = data.allProjects;
			return {
				props: {
					projects,
					mainCategories: updatedMainCategory,
					selectedMainCategory: updatedSelectedMainCategory,
					totalCount,
					categories,
				},
			};
		}
		return {
			notFound: true,
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
};

export default ProjectsCategoriesRoute;
