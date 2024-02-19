import styled from 'styled-components';
import ProjectsMainCategories from '@/components/views/projects/filter/ProjectsMainCategories';
import { mediaQueries } from '@/lib/constants/constants';
import { IconContainer } from '@/components/views/projects/common.styled';

const ProjectsFiltersSwiper = () => {
	return (
		<Container className='fadeIn'>
			<PrevIcon id='prevIcon'>
				<img src={'/images/caret_right.svg'} alt='caret right' />
			</PrevIcon>
			<ProjectsMainCategories />
			<NextIcon id='nextIcon'>
				<img src={'/images/caret_right.svg'} alt='caret right' />
			</NextIcon>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	gap: 16px;
	width: 100%;
	${mediaQueries.tablet} {
		max-width: 90%;
	}
	${mediaQueries.laptopS} {
		padding-right: 60px;
		width: 70%;
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
		display: block;
		min-width: 50px;
		min-height: 50px;
		right: 0;
	}
`;

const PrevIcon = styled(NextIcon)<{ disabled?: boolean }>`
	-ms-transform: rotate(180deg);
	transform: rotate(180deg);
	left: 0;
	z-index: 2;
	${mediaQueries.laptopS} {
	}
`;

export default ProjectsFiltersSwiper;
