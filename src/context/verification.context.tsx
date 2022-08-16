import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useRouter } from 'next/router';
import { captureException } from '@sentry/nextjs';
import {
	EVerificationStatus,
	IProjectVerification,
} from '@/apollo/types/types';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_VERIFICATION } from '@/apollo/gql/gqlVerification';
import { showToastError } from '@/lib/helpers';
import { findStepByName } from '@/lib/verification';
import type { Dispatch, SetStateAction } from 'react';

interface IVerificationContext {
	verificationData?: IProjectVerification;
	step: number;
	setStep: Dispatch<SetStateAction<number>>;
	setVerificationData: Dispatch<
		SetStateAction<IProjectVerification | undefined>
	>;
	isDraft: boolean;
}

const VerificationContext = createContext<IVerificationContext>({
	verificationData: undefined,
	step: -1,
	setStep: () => {
		console.log('setStep not initialed yet!');
	},
	setVerificationData: () => {
		console.log('setVerificationData not initialed yet!');
	},
	isDraft: true,
});

VerificationContext.displayName = 'VerificationContext';

export const VerificationProvider = ({ children }: { children: ReactNode }) => {
	const [step, setStep] = useState(-1);
	const [verificationData, setVerificationData] =
		useState<IProjectVerification>();
	const router = useRouter();
	const { slug } = router.query;
	const isDraft = verificationData?.status === EVerificationStatus.DRAFT;

	useEffect(() => {
		async function getVerificationData() {
			try {
				const verificationRes = await client.query({
					query: FETCH_PROJECT_VERIFICATION,
					variables: { slug },
				});
				const projectVerification: IProjectVerification =
					verificationRes.data.getCurrentProjectVerificationForm;
				setVerificationData(projectVerification);
				if (!projectVerification.emailConfirmed) {
					setStep(1);
				} else {
					setStep(findStepByName(projectVerification.lastStep) + 1);
				}
			} catch (error: any) {
				switch (error?.message) {
					case 'There is not any project verification form for this project':
						setStep(0);
						break;

					default:
						showToastError(error);
						captureException(error, {
							tags: {
								section: 'getVerificationData',
							},
						});
						break;
				}
			}
		}
		if (slug) {
			getVerificationData().then();
		}
	}, [slug]);

	return (
		<VerificationContext.Provider
			value={{
				verificationData,
				setVerificationData,
				step,
				setStep,
				isDraft,
			}}
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
