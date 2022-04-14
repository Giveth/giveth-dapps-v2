import styled from 'styled-components';
import {
	brandColors,
	neutralColors,
	P,
	SublineBold,
} from '@giveth/ui-design-system';

interface IFormProgress {
	progress: number;
	steps: string[];
}

const FormProgress = ({ progress, steps }: IFormProgress) => (
	<ProgressContainer>
		{steps.map((step, index) => (
			<ProgressIcon
				key={`form-progress-${index}`}
				done={progress > index - 1}
			>
				<ProgressLabel>{step}</ProgressLabel>
				<ProgressDot>{index + 1}</ProgressDot>
			</ProgressIcon>
		))}
		<ProgressLine />
	</ProgressContainer>
);

const ProgressContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	justify-content: space-around;
	align-items: center;
	margin: 24px 0 8px;
`;

const ProgressIcon = styled.div<{ done: boolean }>`
	opacity: ${props => (props.done ? '1' : '0.5')};
`;

const ProgressLabel = styled(P)`
	color: ${brandColors.giv[500]};
	margin-bottom: 4px;
`;

const ProgressDot = styled(SublineBold)`
	height: 21px;
	width: 21px;
	background-color: ${brandColors.giv[500]};
	border: 3px solid ${brandColors.giv[100]};
	border-radius: 50%;
	color: ${neutralColors.gray[100]};
	line-height: 16px;
	margin: auto;
`;

const ProgressLine = styled.hr`
	position: relative;
	bottom: 18px;
	border: 1px solid ${brandColors.giv[100]}50;
	width: 100%;
	grid-column: 1/4;
	z-index: -1;
`;

export default FormProgress;
