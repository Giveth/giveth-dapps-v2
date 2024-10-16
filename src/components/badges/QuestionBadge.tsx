import styled from 'styled-components';
import { FlexCenter } from '@giveth/ui-design-system';

const QuestionBadge = () => {
	return (
		<div>
			<Circle>?</Circle>
		</div>
	);
};

const Circle = styled(FlexCenter)`
	border-radius: 50%;
	border: 1px solid;
	width: 16px;
	text-align: center;
	height: 16px;
	font-size: 10px;
	color: inherit;
	font-weight: 500;
`;

export default QuestionBadge;
