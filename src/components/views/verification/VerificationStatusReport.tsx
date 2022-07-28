import { useVerificationData } from '@/context/verification.context';
import LoadingVerification from './Loading';
import { EVerificationStatus } from '@/apollo/types/types';
import { VerificationCard } from './common.sc';

export const VerificationStatusReport = () => {
	const { verificationData } = useVerificationData();
	const { status } = verificationData || {};

	return (
		<VerificationCard background=''>
			{!status && <LoadingVerification />}
			{status === EVerificationStatus.SUBMITTED && <div>Submitted</div>}
		</VerificationCard>
	);
};
