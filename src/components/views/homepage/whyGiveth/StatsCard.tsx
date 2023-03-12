import { H3, P } from '@giveth/ui-design-system';

const StatsCard = (props: { title: string; value?: string }) => {
	const { title, value } = props;
	return (
		<div>
			<P>{title}</P>
			<H3 weight={700}>{value}</H3>
		</div>
	);
};

export default StatsCard;
