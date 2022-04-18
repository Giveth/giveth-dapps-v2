import {
	IconArrowBottom,
	IconArrowTop,
	IconSort16,
} from '@giveth/ui-design-system';
import { EDirection } from '@/apollo/types/gqlEnums';
import {
	EOrderBy,
	IOrder,
} from '@/components/views/userPublicProfile/UserPublicProfile.view';

const SortIcon = (props: { order: IOrder; title: EOrderBy }) => {
	const { order, title } = props;
	return order.by === title ? (
		order.direction === EDirection.DESC ? (
			<IconArrowBottom size={16} />
		) : (
			<IconArrowTop size={16} />
		)
	) : (
		<IconSort16 />
	);
};

export default SortIcon;
