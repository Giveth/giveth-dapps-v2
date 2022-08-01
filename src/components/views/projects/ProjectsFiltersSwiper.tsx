import styled from 'styled-components';
import { useRef } from 'react';
import ProjectsMainCategories from '@/components/views/projects/ProjectsMainCategories';
import { mediaQueries } from '@/lib/constants/constants';
import { useProjectsContext } from '@/context/projects.context';
import { IconContainer } from '@/components/views/projects/common.styled';

const ProjectsFiltersSwiper = () => {
	const { mainCategories } = useProjectsContext();
	const navigationPrevRef = useRef<HTMLButtonElement>(null);
	const navigationNextRef = useRef<HTMLButtonElement>(null);

	return (
		<Container className='fadeIn'>
			<PrevIcon ref={navigationPrevRef}>
				<img src={'/images/caret_right.svg'} alt='caret right' />
			</PrevIcon>
			<ProjectsMainCategories
				mainCategories={mainCategories}
				navigationNextRef={navigationNextRef}
				navigationPrevRef={navigationPrevRef}
			/>
			<NextIcon ref={navigationNextRef}>
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

export default ProjectsFiltersSwiper;
