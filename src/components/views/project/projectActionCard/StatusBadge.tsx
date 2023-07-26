import { FC } from 'react';
import { EProjectStatus } from '@/apollo/types/gqlEnums';
import { EBadgeStatus, Badge } from '@/components/Badge';

interface IStatusBadge {
	status?: EProjectStatus;
}

const StatusBadge: FC<IStatusBadge> = ({ status = EProjectStatus.DRAFT }) => {
	let badgeStatus, label;

	switch (status) {
		case EProjectStatus.ACTIVE:
			badgeStatus = EBadgeStatus.SUCCESS;
			label = 'Active';
			break;
		case EProjectStatus.DEACTIVE:
			badgeStatus = EBadgeStatus.ERROR;
			label = 'Deactivate';
			break;
		case EProjectStatus.DRAFT:
			badgeStatus = EBadgeStatus.DEFAULT;
			label = 'Draft';
			break;
		case EProjectStatus.CANCEL:
			badgeStatus = EBadgeStatus.ERROR;
			label = 'Canceled';
			break;
		default:
			badgeStatus = EBadgeStatus.DEFAULT;
			label = 'Draft';
			break;
	}

	return <Badge status={badgeStatus} label={label} />;
};

export default StatusBadge;
