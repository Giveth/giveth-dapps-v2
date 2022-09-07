import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { captureException } from '@sentry/nextjs';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import { IProjectEdition } from '@/apollo/types/types';
import { isUserRegistered, showToastError } from '@/lib/helpers';
import CreateProject from '@/components/views/create/CreateProject';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowSignWithWallet,
	setShowWelcomeModal,
} from '@/features/modal/modal.slice';
import Spinner from '@/components/Spinner';
import NotAvailableProject from '@/components/NotAvailableProject';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import CompleteProfile from '@/components/CompleteProfile';

const EditIndex = () => {
	const [project, setProject] = useState<IProjectEdition>();
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useAppDispatch();
	const {
		isLoading: isLoadingUser,
		isEnabled,
		isSignedIn,
		userData: user,
	} = useAppSelector(state => state.user);

	const router = useRouter();
	const projectId = router?.query.projectIdSlug as string;
	const isRegistered = isUserRegistered(user);

	useEffect(() => {
		if (isEnabled) {
			if (project) setProject(undefined);
			if (!isSignedIn) {
				dispatch(setShowSignWithWallet(true));
				return;
			}
			if (!isRegistered) {
				dispatch(setShowCompleteProfile(true));
				return;
			}
			if (!isLoading) setIsLoading(true);
			client
				.query({
					query: FETCH_PROJECT_BY_ID,
					variables: { id: Number(projectId) },
				})
				.then((res: { data: { projectById: IProjectEdition } }) => {
					const project = res.data.projectById;
					setIsLoading(false);
					setProject(project);
				})
				.catch((error: unknown) => {
					setIsLoading(false);
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

	if (isLoading || isLoadingUser) {
		return <Spinner />;
	} else if (!isEnabled) {
		return <WalletNotConnected />;
	} else if (!isSignedIn) {
		return <UserNotSignedIn />;
	} else if (!isRegistered) {
		return <CompleteProfile />;
	} else if (!project) {
		return <NotAvailableProject />;
	}
	return <CreateProject project={project} />;
};

export default EditIndex;
