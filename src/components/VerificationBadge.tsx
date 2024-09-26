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
		: verificationStatus !== EVerificationStatus.VERIFIED
			? verificationStatus
			: '';

	let label, badgeStatus;
	switch (verStatus) {
		case EVerificationStatus.REJECTED:
			label = 'Declined';
			badgeStatus = EBadgeStatus.ERROR;
			break;
		case EVerificationStatus.SUBMITTED:
			label = 'Submitted';
			badgeStatus = EBadgeStatus.GIVETH;
			break;
		case EVerificationStatus.VERIFIED:
			label = 'Eligible';
			badgeStatus = EBadgeStatus.SUCCESS;
			break;
		case EVerificationStatus.DRAFT:
			label = 'Incomplete';
			badgeStatus = EBadgeStatus.WARNING;
			break;
		default:
			label = 'Ineligible';
			badgeStatus = EBadgeStatus.ERROR;
	}
	return <Badge status={badgeStatus} label={label} />;
};

export default VerificationBadge;
