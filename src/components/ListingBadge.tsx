import { FC } from 'react';
import { Badge, EBadgeStatus } from '@/components/Badge';

interface IListingBadge {
	listed?: boolean | null;
	showBullet?: boolean;
}

const ListingBadge: FC<IListingBadge> = ({ listed, showBullet = false }) => {
	let status, label;

	if (listed) {
		status = EBadgeStatus.SUCCESS;
		label = 'Listed';
	} else if (listed === null) {
		status = EBadgeStatus.WARNING;
		label = 'Waiting for review';
	} else {
		status = EBadgeStatus.ERROR;
		label = 'Not Listed';
	}

	return <Badge status={status} label={label} showBullet={showBullet} />;
};

export default ListingBadge;
