import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { H4, brandColors, P, Button } from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';

import ProjectCard from '@/components/project-card/ProjectCardAlt';
import { IProject } from '@/apollo/types/types';
import SocialBox from '../donate/SocialBox';
import ConfettiAnimation from '../../animations/confetti';
import { slugToProjectView } from '@/lib/routeCreators';

const SuccessfulCreation = (props: {
	project: IProject;
	showSuccess?: Dispatch<SetStateAction<boolean>>;
}) => {
	const { project, showSuccess } = props;

	useEffect(() => {
		setTimeout(() => window.scrollTo(0, 0), 200);
	}, []);

	const SuccessView = () => {
		return (
			<SucceessContainer>
				<ConfettiContainer>
					<ConfettiAnimation size={300} />
				</ConfettiContainer>
				<GiverH4>High five!</GiverH4>
				{/* <Image src='/images/motivation.svg' alt='motivation' width='121px' height='121px' /> */}
				<SuccessMessage>
					Your project is being reviewed by our team. You&apos;ll
					receive an email from us once your project is listed.
				</SuccessMessage>
				<SocialBox project={project} isSuccess />
				<SuccessMessage>
					You can still access your project from your account and
					share it with your friends.
				</SuccessMessage>
				<Link passHref href={slugToProjectView(project.slug)}>
					<ProjectsButton
						onClick={() => showSuccess && showSuccess(false)}
						label='VIEW PROJECT'
					/>
				</Link>
			</SucceessContainer>
		);
	};

	return (
		<Container>
			<Wrapper>
				<BGImg src='/images/arc2.svg' />
				<BGImg src='/images/arc3.svg' />
				<Sections>
					<Left>
						<ProjectCard project={project} isNew />
					</Left>
					<Right>
						<SuccessView />
					</Right>
				</Sections>
			</Wrapper>
		</Container>
	);
};

const ConfettiContainer = styled.div`
	position: absolute;
	top: 200px;
`;
const GiverH4 = styled(H4)`
	color: ${brandColors.deep[700]};
`;
const BGImg = styled.img`
	position: absolute;
`;
const Container = styled.div`
	background-image: url('/images/creation_success.svg');
`;
const Wrapper = styled.div`
	text-align: center;
	margin: 0 194px;
	padding: 137px 0;
	align-items: center;

	img:first-child {
		top: 0;
		right: 20px;
	}
	img:nth-child(2) {
		bottom: 0;
		left: 20px;
	}
`;
const Sections = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(500px, 1fr));
	grid-auto-rows: minmax(100px, auto);
`;
const Left = styled.div`
	display: grid;
	justify-content: center;
	grid-auto-flow: column;
	z-index: 1;
	grid-column: 1 / 2;
	grid-row: 1;
	padding: 29px 0;
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
`;
const Right = styled.div`
	z-index: 1;
	grid-row: 1;
	text-align: left;
	padding: 65px 32px 32px;
	border-top-right-radius: 16px;
	border-bottom-right-radius: 16px;
	height: 620px;
	h4 {
		color: ${brandColors.deep[700]};
		font-weight: bold;
	}
`;
const SucceessContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	text-align: center;
	padding: 0 39px;
	color: ${brandColors.deep[900]};
	height: 100%;
`;
const SuccessMessage = styled(P)`
	margin: -19px 0 16px 0;
	color: ${brandColors.deep[900]};
`;
const ProjectsButton = styled(Button)`
	width: 242px;
	height: 48px;
	font-size: 12px;
`;

export default SuccessfulCreation;
