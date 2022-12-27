import {
	IconArrowDown16,
	IconArrowUp16,
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
			<IconArrowDown16 />
		) : (
			<IconArrowUp16 />
		)
	) : (
		<IconSorting16 />
	);
};

export default SortIcon;
