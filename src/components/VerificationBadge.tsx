import { FC } from 'react';
import { useIntl } from 'react-intl';
import { EVerificationStatus } from '@/apollo/types/types';
import { Badge, EBadgeStatus } from './Badge';
interface IProps {
	isGivbackEligible?: boolean;
	verificationStatus?: EVerificationStatus;
}

const VerificationBadge: FC<IProps> = ({
	isGivbackEligible,
	verificationStatus,
}) => {
	const { formatMessage } = useIntl();
	const verStatus = isGivbackEligible
		? EVerificationStatus.VERIFIED
		: verificationStatus;

	let label, badgeStatus;
	switch (verStatus) {
		case EVerificationStatus.REJECTED:
			label = formatMessage({
				id: 'label.verification_status_backs.declined',
			});
			badgeStatus = EBadgeStatus.ERROR;
			break;
		case EVerificationStatus.SUBMITTED:
			label = formatMessage({
				id: 'label.verification_status_backs.submitted',
			});
			badgeStatus = EBadgeStatus.GIVETH;
			break;
		case EVerificationStatus.VERIFIED:
			label = formatMessage({
				id: 'label.verification_status_backs.eligible',
			});
			badgeStatus = EBadgeStatus.SUCCESS;
			break;
		case EVerificationStatus.DRAFT:
			label = formatMessage({
				id: 'label.verification_status_backs.incomplete',
			});
			badgeStatus = EBadgeStatus.WARNING;
			break;
		default:
			label = formatMessage({
				id: 'label.verification_status_backs.ineligible',
			});
			badgeStatus = EBadgeStatus.ERROR;
	}
	return <Badge status={badgeStatus} label={label} />;
};

export default VerificationBadge;
