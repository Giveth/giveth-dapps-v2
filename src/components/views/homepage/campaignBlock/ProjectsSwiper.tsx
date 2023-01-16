import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProjectCard from '@/components/project-card/ProjectCard';
import { IProject } from '@/apollo/types/types';
import 'swiper/css';
import 'swiper/css/navigation';

const ProjectsSwiper = (props: { projects: IProject[] }) => {
	const { projects } = props;
	console.log('projects', projects);
	return (
		<Wrapper>
			<Swiper slidesPerView={3} spaceBetween={24}>
				{projects.map(project => (
					<SwiperSlide key={project.id}>
						<ProjectCard project={project} />
					</SwiperSlide>
				))}
			</Swiper>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 20px 0;
	width: 100%;
	overflow: hidden;
`;

export default ProjectsSwiper;
