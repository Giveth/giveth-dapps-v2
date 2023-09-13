import styled from 'styled-components';
import { Col, Row, mediaQueries } from '@giveth/ui-design-system';
import { useState } from 'react';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import { QfRoundSelector } from './QfRoundSelector';
import { IQFRound } from '@/apollo/types/types';
import { IconContainer } from '@/components/views/projects/common.styled';

const ProjectDonationsIndex = () => {
	const [selectedQF, setSelectedQF] = useState<IQFRound | null>(null);

	return (
		<>
			<Container className='fadeIn'>
				<PrevIcon id='prevIcon'>
					<img src={'/images/caret_right.svg'} alt='caret right' />
				</PrevIcon>
				<QfRoundSelector
					selectedQF={selectedQF}
					setSelectedQF={setSelectedQF}
				/>
				<NextIcon id='nextIcon'>
					<img src={'/images/caret_right.svg'} alt='caret right' />
				</NextIcon>
			</Container>
			<StyledRow>
				<Col lg={4}>
					<ProjectTotalFundCard selectedQF={selectedQF} />
				</Col>
				<Col lg={8}>
					<ProjectDonationTable selectedQF={selectedQF} />
				</Col>
			</StyledRow>
		</>
	);
};

const StyledRow = styled(Row)`
	margin-bottom: 100px;
	${mediaQueries.laptopL} {
		align-items: flex-start;
		flex-direction: row-reverse;
	}
`;

const NextIcon = styled(IconContainer)`
	z-index: 1;
	display: none;
	:disabled {
		opacity: 0.5;
		cursor: default;
	}
	${mediaQueries.tablet} {
		display: inline-block;
	}
	${mediaQueries.laptopS} {
		width: 50px;
		height: 50px;
		position: absolute;
		top: calc(50% - 25px);
		right: 0;
		:disabled {
			display: none;
		}
	}
`;

const PrevIcon = styled(NextIcon)<{ disabled?: boolean }>`
	-ms-transform: rotate(180deg);
	transform: rotate(180deg);
	left: 0;
	z-index: 2;
	${mediaQueries.laptopS} {
		:disabled {
			display: none;
		}
	}
`;

const Container = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	gap: 16px;
`;

export default ProjectDonationsIndex;
