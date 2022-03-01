import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useUser from '@/context/UserProvider';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_BY_ID } from '@/apollo/gql/gqlProjects';
import { IProjectEdition } from '@/apollo/types/types';
import CreateIndex from '@/components/views/create/CreateIndex';
import { showToastError } from '@/lib/helpers';
import SignInModal from '@/components/modals/SignInModal';

const EditIndex = () => {
	const [project, setProject] = useState<IProjectEdition>();
	const [showSigninModal, setShowSigninModal] = useState(false);

	const {
		state: { user },
	} = useUser();

	const router = useRouter();
	const projectId = router?.query.projectIdSlug as string;

	useEffect(() => {
		const userAddress = user?.walletAddress;
		if (userAddress && projectId) {
			setShowSigninModal(false);
			client
				.query({
					query: FETCH_PROJECT_BY_ID,
					variables: { id: Number(projectId) },
				})
				.then((res: any) => setProject(res.data.projectById))
				.catch(showToastError);
		} else {
			setShowSigninModal(true);
		}
	}, [user]);

	return (
		<>
			{showSigninModal && (
				<SignInModal
					showModal={showSigninModal}
					closeModal={() => setShowSigninModal(false)}
				/>
			)}
			{project && <CreateIndex project={project} />}
		</>
	);
};

export default EditIndex;
