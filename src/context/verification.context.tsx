import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IProject } from '@/apollo/types/types';
import { backendGQLRequest } from '@/helpers/requests';
import { FETCH_PROJECT_BY_SLUG } from '@/apollo/gql/gqlVerification';

interface IVerificationContext {
	projectData?: IProject;
}

const VerificationContext = createContext<IVerificationContext>({
	projectData: undefined,
});

VerificationContext.displayName = 'VerificationContext';

export const VerificationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [projectData, setProjectData] = useState<IProject>();
	const router = useRouter();
	const { slug } = router.query;
	console.log('Slug', slug);
	useEffect(() => {
		async function getProjectData() {
			if (slug) {
				try {
					const projectData: { data: { projectBySlug: IProject } } =
						await backendGQLRequest(FETCH_PROJECT_BY_SLUG, {
							slug,
						});
					console.log('Dattaaa', projectData.data.projectBySlug);
					setProjectData(projectData.data.projectBySlug);
				} catch (error) {
					console.log('error', error);
				}
			}
		}
		getProjectData();
	}, [slug]);

	return (
		<VerificationContext.Provider value={{ projectData }}>
			{children}
		</VerificationContext.Provider>
	);
};

export const useVerificationData = () => {
	const context = useContext(VerificationContext);
	if (context === undefined) {
		throw new Error(
			'useVerificationData must be used within a VerificationProvider',
		);
	}
	return context;
};
