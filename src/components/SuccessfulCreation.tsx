import React, { useEffect } from 'react';
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
import Image from 'next/image';
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
import NotAvailableHandler from '@/components/NotAvailableHandler';

interface IProps {
	project?: IProject;
	isLoading?: boolean;
}

const SuccessfulCreation = (props: IProps) => {
	const { project, isLoading } = props;

	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	useEffect(() => {
		setTimeout(() => window.scrollTo(0, 0), 200);
		dispatch(setShowFooter(false));
		return () => {
			dispatch(setShowFooter(true));
		};
	}, []);

	if (!project) return <NotAvailableHandler isProjectLoading={isLoading} />;

	const { slug } = project;
	const projectPath = slugToProjectView(slug);

	return (
		<Wrapper>
			<ContainerStyled>
				<BGImg
					src='/images/arc2.svg'
					alt='image project creation'
					width={202}
					height={273}
					style={{
						top: 0,
						right: 20,
					}}
				/>

				<BGImg
					src='/images/arc3.svg'
					alt='image project creation'
					width={274}
					height={256}
					style={{
						bottom: 0,
						left: 20,
					}}
				/>
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
						<GiverH4 id='project-creation'>
							{formatMessage({ id: 'label.high_five' })}
						</GiverH4>
						<SuccessMessage>
							{formatMessage({
								id: 'label.your_project_is_being_reviewed',
							})}
						</SuccessMessage>
						<CopyBox>
							<CopyLink url={fullPath(projectPath)} />
						</CopyBox>
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
const BGImg = styled(Image)`
	position: absolute;
`;
const Wrapper = styled.div`
	background-image: url('/images/creation_success.svg');
`;
const ContainerStyled = styled(Container)`
	text-align: center;
	padding-top: 114px;
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

const CopyBox = styled.div`
	max-height: 100px;
`;

export default SuccessfulCreation;
