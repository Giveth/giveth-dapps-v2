import {
	IconArrowBottom,
	IconArrowTop,
	IconSorting16,
} from '@giveth/ui-design-system';
import { EDirection } from '@/apollo/types/gqlEnums';

export interface IOrder {
	by: string;
	direction: EDirection;
}

const SortIcon = (props: { order: IOrder; title: string }) => {
	const { order, title } = props;
	return order.by === title ? (
		order.direction === EDirection.DESC ? (
			<IconArrowBottom size={16} />
		) : (
			<IconArrowTop size={16} />
		)
	) : (
		<IconSorting16 />
	);
};

export default SortIcon;
