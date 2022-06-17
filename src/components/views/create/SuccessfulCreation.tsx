import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { brandColors, Button, H2, Lead, P } from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';

import ProjectCard from '@/components/project-card/ProjectCardAlt';
import { IProject } from '@/apollo/types/types';
import ConfettiAnimation from '../../animations/confetti';
import { slugToProjectView } from '@/lib/routeCreators';
import SocialBox from '@/components/views/donate/SocialBox';
import CopyLink from '@/components/CopyLink';
import { Col, Row, Container } from '@/components/Grid';
import { mediaQueries } from '@/lib/constants/constants';
import { fullPath } from '@/lib/helpers';
import { useGeneral } from '@/context/general.context';

const SuccessfulCreation = (props: {
	project: IProject;
	showSuccess?: Dispatch<SetStateAction<boolean>>;
}) => {
	const { project, showSuccess } = props;
	const { slug } = project;
	const projectPath = slugToProjectView(slug);

	const { setShowFooter } = useGeneral();

	useEffect(() => {
		setTimeout(() => window.scrollTo(0, 0), 200);
		setShowFooter(false);
	}, []);

	return (
		<Wrapper>
			<ContainerStyled>
				<BGImg src='/images/arc2.svg' />
				<BGImg src='/images/arc3.svg' />
				<Row>
					<Left xs={12} md={6}>
						<ProjectCard project={project} isNew />
					</Left>
					<Right xs={12} md={6}>
						<ConfettiContainer>
							<ConfettiAnimation size={300} />
						</ConfettiContainer>
						<GiverH4>High five!</GiverH4>
						<SuccessMessage>
							Your project is being reviewed by our team.
							You&apos;ll receive an email from us once your
							project is listed.
						</SuccessMessage>
						<CopyLink url={fullPath(projectPath)} />
						<br />
						<br />
						<br />
						<SocialBox project={project} isSuccess />
						<br />
						<P>
							You can still access your project from your account
							and share it with your friends.
						</P>
						<Link passHref href={projectPath}>
							<ProjectsButton
								onClick={() =>
									showSuccess && showSuccess(false)
								}
								label='VIEW PROJECT'
							/>
						</Link>
					</Right>
				</Row>
			</ContainerStyled>
		</Wrapper>
	);
};

const ConfettiContainer = styled.div`
	position: absolute;
	top: 200px;
	z-index: -1;
`;
const GiverH4 = styled(H2)`
	color: ${brandColors.deep[700]};
	font-weight: 700;
	margin-bottom: 24px;
`;
const BGImg = styled.img`
	position: absolute;
`;
const Wrapper = styled.div`
	background-image: url('/images/creation_success.svg');
`;
const ContainerStyled = styled(Container)`
	text-align: center;
	padding-top: 214px;
	> img:first-child {
		top: 0;
		right: 20px;
	}
	> img:nth-child(2) {
		bottom: 0;
		left: 20px;
	}
`;
const Left = styled(Col)`
	z-index: 1;
	> * {
		margin: 0 auto;
	}
`;
const Right = styled(Col)`
	z-index: 1;
	padding: 0 32px 32px;
	margin-top: 30px;
	text-align: center;
	color: ${brandColors.deep[900]};
	${mediaQueries.laptop} {
		margin-top: 0;
	}
`;
const SuccessMessage = styled(Lead)`
	color: ${brandColors.deep[900]};
	margin-bottom: 24px;
`;
const ProjectsButton = styled(Button)`
	width: 242px;
	height: 48px;
	font-size: 12px;
	margin: 20px auto;
`;

export default SuccessfulCreation;
