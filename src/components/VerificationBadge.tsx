import { FC } from 'react';
import { EVerificationStatus } from '@/apollo/types/types';
import { Badge, EBadgeStatus } from './Badge';

interface IProps {
	isVerified?: boolean;
	verificationStatus?: EVerificationStatus;
}

const VerificationBadge: FC<IProps> = ({ isVerified, verificationStatus }) => {
	const verStatus = isVerified
		? EVerificationStatus.VERIFIED
		: verificationStatus;
	let label, badgeStatus;
	switch (verStatus) {
		case EVerificationStatus.REJECTED:
			label = 'Declined';
			badgeStatus = EBadgeStatus.WARNING;
			break;
		case EVerificationStatus.SUBMITTED:
			label = 'Submitted';
			badgeStatus = EBadgeStatus.GIVETH;
			break;
		case EVerificationStatus.VERIFIED:
			label = 'Verified';
			badgeStatus = EBadgeStatus.SUCCESS;
			break;
		default:
			label = 'Not Verified';
			badgeStatus = EBadgeStatus.DEFAULT;
	}
	return <Badge status={badgeStatus} label={label} />;
};

export default VerificationBadge;
