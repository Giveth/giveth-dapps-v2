import styled from 'styled-components';
import { brandColors, D2, Lead, neutralColors } from '@giveth/ui-design-system';

const NumberedItem = (props: {
	number: number;
	title: string;
	description: string | JSX.Element;
}) => {
	const { number, title, description } = props;
	return (
		<NumberedItemWrapper>
			<Number>{number}</Number>
			<Text size='large'>
				<div>{title}</div>
				{description}
			</Text>
		</NumberedItemWrapper>
	);
};

const Number = styled(D2)`
	color: ${brandColors.giv[500]};
	align-self: flex-start;
`;

const Text = styled(Lead)`
	color: ${neutralColors.gray[900]};
	> div {
		font-weight: 700;
		margin-bottom: 8px;
	}
`;

const NumberedItemWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 32px;
	padding: 40px 0;
	position: relative;
`;

export default NumberedItem;
