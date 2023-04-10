import { Badge, EBadgeStatus } from '@/components/Badge';

const ListingBadge = (props: { listed: boolean | null }) => {
	const { listed } = props;

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

	return <Badge status={status} label={label} />;
};

export default ListingBadge;
