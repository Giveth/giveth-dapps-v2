import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useUser from '@/context/UserProvider';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import { IProjectEdition } from '@/apollo/types/types';
import {
	compareAddresses,
	isUserRegistered,
	showToastError,
} from '@/lib/helpers';
import SignInModal from '@/components/modals/SignInModal';
import CreateProject from '@/components/views/create/CreateProject';

const EditIndex = () => {
	const [project, setProject] = useState<IProjectEdition>();
	const [showSigninModal, setShowSigninModal] = useState(false);

	const {
		state: { user, isSignedIn },
		actions: { showCompleteProfile, showSignModal },
	} = useUser();

	const router = useRouter();
	const projectId = router?.query.projectIdSlug as string;

	useEffect(() => {
		const userAddress = user?.walletAddress;
		if (userAddress) {
			setShowSigninModal(false);
			if (project) setProject(undefined);
			if (!isUserRegistered(user)) {
				showCompleteProfile();
				return;
			}
			if (!isSignedIn) {
				showSignModal();
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
				.catch(showToastError);
		} else {
			setShowSigninModal(true);
		}
	}, [user, isSignedIn]);

	return (
		<>
			{showSigninModal && (
				<SignInModal
					showModal={showSigninModal}
					closeModal={() => setShowSigninModal(false)}
				/>
			)}
			{isSignedIn && project && <CreateProject project={project} />}
		</>
	);
};

export default EditIndex;
