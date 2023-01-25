import styled from 'styled-components';
import { H3, neutralColors, Subline } from '@giveth/ui-design-system';

const StatsCard = (props: { title: string; value?: string }) => {
	const { title, value } = props;
	return (
		<div>
			<Title>{title}</Title>
			<Value weight={700}>{value}</Value>
		</div>
	);
};

const Title = styled(Subline)`
	color: ${neutralColors.gray[900]};
`;

const Value = styled(H3)`
	color: ${neutralColors.gray[900]};
`;

export default StatsCard;
