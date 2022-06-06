import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IProjectVerification } from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import { getCurrentProjectVerificationFormQuery } from '@/apollo/gql/gqlVerification';
import type { Dispatch, SetStateAction } from 'react';
interface IVerificationContext {
	verificationData?: IProjectVerification;
	step: number;
	setStep: Dispatch<SetStateAction<number>>;
	setVerificationData: Dispatch<
		SetStateAction<IProjectVerification | undefined>
	>;
}

const VerificationContext = createContext<IVerificationContext>({
	verificationData: undefined,
	step: 0,
	setStep: num => {
		console.log('setStep not initialed yet!');
	},
	setVerificationData: pr => {
		console.log('setVerificationData not initialed yet!');
	},
});

VerificationContext.displayName = 'VerificationContext';

export const VerificationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [step, setStep] = useState(1);
	const [verificationData, setVerificationData] =
		useState<IProjectVerification>();
	const router = useRouter();
	const { slug } = router.query;

	useEffect(() => {
		async function getVerificationData() {
			try {
				const verificationRes = await client.query({
					query: getCurrentProjectVerificationFormQuery,
					variables: {
						slug,
					},
				});
				const projectverification: IProjectVerification =
					verificationRes.data.getCurrentProjectVerificationForm;
				setVerificationData(projectverification);
			} catch (error) {}
		}
		if (slug) {
			getVerificationData();
		}
	}, [slug]);

	return (
		<VerificationContext.Provider
			value={{ verificationData, setVerificationData, step, setStep }}
		>
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
