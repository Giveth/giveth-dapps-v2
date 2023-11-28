import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { captureException } from '@sentry/nextjs';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import { IProjectEdition } from '@/apollo/types/types';
import { compareAddresses, isUserRegistered } from '@/lib/helpers';
import CreateProject from '@/components/views/create/CreateProject';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	setShowCompleteProfile,
	setShowSignWithWallet,
} from '@/features/modal/modal.slice';
import { WrappedSpinner } from '@/components/Spinner';
import NotAvailableHandler from '@/components/NotAvailableHandler';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import CompleteProfile from '@/components/CompleteProfile';
import { EProjectStatus } from '@/apollo/types/gqlEnums';

const EditIndex = () => {
	const [project, setProject] = useState<IProjectEdition>();
	const [isLoadingProject, setIsLoadingProject] = useState(true);
	const [isCancelled, setIsCancelled] = useState(false);
	const [ownerAddress, setOwnerAddress] = useState<string>();

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
		setOwnerAddress(undefined);
		setIsCancelled(false);
		if (isLoadingUser) return;
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
			!isLoadingProject && setIsLoadingProject(true);
			client
				.query({
					query: FETCH_PROJECT_BY_ID,
					variables: { id: Number(projectId) },
				})
				.then((res: { data: { projectById: IProjectEdition } }) => {
					const project = res.data.projectById;
					setOwnerAddress(project.adminUser.walletAddress);
					if (project.status.name === EProjectStatus.CANCEL) {
						setIsCancelled(true);
						setProject(undefined);
					} else if (
						!compareAddresses(
							project.adminUser.walletAddress,
							user?.walletAddress,
						)
					) {
						setProject(undefined);
					} else {
						setProject(project);
					}
					setIsLoadingProject(false);
				})
				.catch((error: unknown) => {
					setIsLoadingProject(false);
					console.log(error);
					captureException(error, {
						tags: {
							section: 'EditIndex',
						},
					});
				});
		} else {
			if (!isLoadingUser) {
				setIsLoadingProject(false);
			}
		}
	}, [user, isSignedIn, isLoadingUser]);

	if (isLoadingProject || isLoadingUser) {
		return <WrappedSpinner />;
	} else if (!isEnabled) {
		return <WalletNotConnected />;
	} else if (!isSignedIn) {
		return <UserNotSignedIn />;
	} else if (!isRegistered) {
		return <CompleteProfile />;
	} else if (!project) {
		return (
			<NotAvailableHandler
				ownerAddress={ownerAddress}
				isCancelled={isCancelled}
			/>
		);
	}
	return <CreateProject project={project} />;
};

export default EditIndex;
