import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { captureException } from '@sentry/nextjs';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import { IProjectEdition } from '@/apollo/types/types';
import {
	compareAddresses,
	isUserRegistered,
	showToastError,
} from '@/lib/helpers';
import CreateProject from '@/components/views/create/CreateProject';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowSignWithWallet,
	setShowWelcomeModal,
} from '@/features/modal/modal.slice';
import Spinner from '@/components/Spinner';
import NotAvailableProject from '@/components/views/project/NotAvailableProject';

const EditIndex = () => {
	const [project, setProject] = useState<IProjectEdition>();
	const [isLoading, setIsLoading] = useState(true);

	const dispatch = useAppDispatch();
	const { isSignedIn, userData: user } = useAppSelector(state => state.user);
	const router = useRouter();
	const projectId = router?.query.projectIdSlug as string;

	useEffect(() => {
		if (!isLoading) setIsLoading(true);
		const userAddress = user?.walletAddress;
		if (userAddress) {
			if (project) setProject(undefined);
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
				return;
			}
			if (!isUserRegistered(user)) {
				dispatch(setShowCompleteProfile(true));
				return;
			}
			client
				.query({
					query: FETCH_PROJECT_BY_ID,
					variables: { id: Number(projectId) },
				})
				.then((res: any) => {
					const project = res.data.projectById;
					if (
						!compareAddresses(
							userAddress,
							project.adminUser.walletAddress,
						)
					) {
						showToastError(
							'Only project owner can edit the project',
						);
					} else {
						setIsLoading(false);
						setProject(project);
					}
				})
				.catch((error: unknown) => {
					setIsLoading(false);
					console.log('FETCH_PROJECT_BY_ID error: ', error);
					captureException(error, {
						tags: {
							section: 'EditIndex',
						},
					});
				});
		} else {
			dispatch(setShowWelcomeModal(true));
		}
	}, [user, isSignedIn]);

	if (isLoading) return <Spinner />;
	if (!project) return <NotAvailableProject />;
	return isSignedIn ? <CreateProject project={project} /> : null;
};

export default EditIndex;
