import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
	brandColors,
	Button,
	Col,
	Container,
	H2,
	Lead,
	P,
	Row,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import ProjectCard from '@/components/project-card/ProjectCardAlt';
import { IProject } from '@/apollo/types/types';
import { slugToProjectView } from '@/lib/routeCreators';
import SocialBox from '@/components/SocialBox';
import CopyLink from '@/components/CopyLink';
import { mediaQueries } from '@/lib/constants/constants';
import { fullPath } from '@/lib/helpers';
import { setShowFooter } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import CongratsAnimation from '@/animations/congrats.json';
import LottieControl from '@/components/LottieControl';
import { EContentType } from '@/lib/constants/shareContent';

const SuccessfulCreation = (props: {
	project: IProject;
	showSuccess?: Dispatch<SetStateAction<boolean>>;
}) => {
	const { project, showSuccess } = props;
	const { slug } = project;
	const projectPath = slugToProjectView(slug);
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	useEffect(() => {
		setTimeout(() => window.scrollTo(0, 0), 200);
		dispatch(setShowFooter(false));
		return () => {
			dispatch(setShowFooter(true));
		};
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
							<LottieControl
								size={400}
								animationData={CongratsAnimation}
							/>
						</ConfettiContainer>
						<GiverH4>
							{formatMessage({ id: 'label.high_five' })}
						</GiverH4>
						<SuccessMessage>
							{formatMessage({
								id: 'label.your_project_is_being_reviewed',
							})}
						</SuccessMessage>
						<CopyLink url={fullPath(projectPath)} />
						<br />
						<br />
						<br />
						<SocialBox
							project={project}
							contentType={EContentType.ourProject}
						/>
						<br />
						<P>
							{formatMessage({
								id: 'label.you_can_still_access',
							})}
						</P>
						<Link href={projectPath}>
							<ProjectsButton
								onClick={() =>
									showSuccess && showSuccess(false)
								}
								label={formatMessage({
									id: 'label.view_project',
								})}
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
	position: relative;
	z-index: 1;
	padding: 0 32px 32px;
	margin-top: 30px;
	text-align: center;
	color: ${brandColors.deep[900]};
	${mediaQueries.laptopS} {
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
