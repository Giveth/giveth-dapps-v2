import { H3, P } from '@giveth/ui-design-system';
import styled from 'styled-components';

const StatsCard = (props: { title: string; value?: string }) => {
	const { title, value } = props;
	return (
		<div>
			<CenteredP>{title}</CenteredP>
			<CenteredH3 weight={700}>{value}</CenteredH3>
		</div>
	);
};

const CenteredP = styled(P)`
	text-align: center;
`;

const CenteredH3 = styled(H3)`
	text-align: center;
`;

export default StatsCard;
