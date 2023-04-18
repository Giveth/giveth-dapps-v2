import { FC } from 'react';
import { EVerificationStatus } from '@/apollo/types/types';
import { Badge, EBadgeStatus } from './Badge';

interface IProps {
	status?: EVerificationStatus;
	simplified?: boolean;
}

const VerificationBadge: FC<IProps> = ({ status, simplified }) => {
	if (!status || status === EVerificationStatus.DRAFT) return null;
	let label, badgeStatus;
	switch (status) {
		case EVerificationStatus.REJECTED:
			label = simplified ? 'Rejected' : 'Verification rejected';
			badgeStatus = EBadgeStatus.ERROR;
			break;
		case EVerificationStatus.SUBMITTED:
			label = simplified ? 'Request sent' : 'Verification request sent';
			badgeStatus = EBadgeStatus.WARNING;
			break;
		case EVerificationStatus.VERIFIED:
			label = 'Verified';
			badgeStatus = EBadgeStatus.SUCCESS;
			break;
	}

	return <Badge status={badgeStatus} label={label} />;
};

export default VerificationBadge;
