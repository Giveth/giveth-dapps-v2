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
import NotAvailableProject from '@/components/NotAvailableProject';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import CompleteProfile from '@/components/CompleteProfile';

const EditIndex = () => {
	const [project, setProject] = useState<IProjectEdition>();
	const [isLoadingProject, setIsLoadingProject] = useState(true);

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
				setIsLoadingProject(false);
				dispatch(setShowSignWithWallet(true));
				return;
			}
			if (!isRegistered) {
				setIsLoadingProject(false);
				dispatch(setShowCompleteProfile(true));
				return;
			}
			client
				.query({
					query: FETCH_PROJECT_BY_ID,
					variables: { id: Number(projectId) },
				})
				.then((res: { data: { projectById: IProjectEdition } }) => {
					const project = res.data.projectById;
					if (
						!compareAddresses(
							user?.walletAddress,
							project.adminUser.walletAddress,
						)
					) {
						showToastError(
							'Only project owner can edit the project',
						);
					} else {
						setProject(project);
					}
					setIsLoadingProject(false);
				})
				.catch((error: unknown) => {
					setIsLoadingProject(false);
					showToastError(error);
					captureException(error, {
						tags: {
							section: 'EditIndex',
						},
					});
				});
		} else {
			if (!isLoadingUser) {
				dispatch(setShowWelcomeModal(true));
				setIsLoadingProject(false);
			}
		}
	}, [user, isSignedIn, isLoadingUser]);

	if (isLoadingProject || isLoadingUser) {
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
