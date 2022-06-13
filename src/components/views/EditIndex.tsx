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

const EditIndex = () => {
	const [project, setProject] = useState<IProjectEdition>();

	const dispatch = useAppDispatch();
	const { isSignedIn, userData: user } = useAppSelector(state => state.user);
	const router = useRouter();
	const projectId = router?.query.projectIdSlug as string;

	useEffect(() => {
		const userAddress = user?.walletAddress;
		if (userAddress) {
			if (project) setProject(undefined);
			if (!isUserRegistered(user)) {
				dispatch(setShowCompleteProfile(true));
				return;
			}
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
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
					} else setProject(project);
				})
				.catch((error: unknown) => {
					showToastError(error);
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

	return isSignedIn && project ? <CreateProject project={project} /> : null;
};

export default EditIndex;
