import styled from 'styled-components';
import { brandColors, neutralColors } from '@giveth/ui-design-system';

const ProgressBar = (props: { percentage: number }) => {
	return (
		<Container>
			<Bar width={props.percentage / 100} />
		</Container>
	);
};

const Container = styled.div`
	background: ${neutralColors.gray[300]};
	height: 3px;
	border-radius: 5px;
`;

const Bar = styled.div<{ width: number }>`
	background: ${brandColors.giv[500]};
	border-radius: 5px;
	width: ${props => props.width * 100}%;
	height: 100%;
	transition: width 0.3s ease-in-out;
`;

export default ProgressBar;
