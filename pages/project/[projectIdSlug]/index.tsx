import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlProjects';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import StorageLabel, { setWithExpiry } from '@/lib/localStorage';
import { countReferralClick } from '@/features/user/user.thunks';
import ProjectIndex from '@/components/views/project/ProjectIndex';
import { IProjectBySlug } from '@/apollo/types/gqlTypes';
import { ProjectProvider } from '@/context/project.context';

const ProjectRoute: FC<IProjectBySlug> = ({ project }) => {
	const dispatch = useAppDispatch();
	const { userData, isLoading, isSignedIn } = useAppSelector(
		state => state.user,
	);

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
		<ProjectProvider project={project}>
			<ProjectIndex />
		</ProjectProvider>
	);
};

export async function getServerSideProps(props: {
	query: { projectIdSlug: string };
}) {
	try {
		const { query } = props;
		const slug = decodeURI(query.projectIdSlug).replace(/\s/g, '');

		const { data } = await client.query({
			query: FETCH_PROJECT_BY_SLUG,
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
