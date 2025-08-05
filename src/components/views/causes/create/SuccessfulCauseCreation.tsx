import React, { useEffect } from 'react';
import {
	brandColors,
	Button,
	Col,
	Container,
	H2,
	Lead,
	neutralColors,
	P,
	Row,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { ICause } from '@/apollo/types/types';
import { slugToCauseView } from '@/lib/routeCreators';
import SocialBox from '@/components/SocialBox';
import CopyLink from '@/components/CopyLink';
import { mediaQueries } from '@/lib/constants/constants';
import { fullPath } from '@/lib/helpers';
import { setShowFooter } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';
import CongratsAnimation from '@/animations/congrats.json';
import LottieControl from '@/components/LottieControl';
import { EContentTypeCause } from '@/lib/constants/shareContent';
import NotAvailableHandler from '@/components/NotAvailableHandler';
import ProjectCard from '@/components/project-card/ProjectCardAlt';

interface IProps {
	cause?: ICause;
	isLoading?: boolean;
}

const SuccessfulCauseCreation = ({ cause, isLoading }: IProps) => {
	const dispatch = useAppDispatch();
	const { formatMessage } = useIntl();

	useEffect(() => {
		window.scrollTo(0, 0);
		dispatch(setShowFooter(false));
		return () => {
			dispatch(setShowFooter(true));
		};
	}, []);

	if (!cause) return <NotAvailableHandler isProjectLoading={isLoading} />;

	const causePath = slugToCauseView(cause.slug!);

	return (
		<Wrapper>
			<ContainerStyled>
				<BGImg
					src='/images/arc2.svg'
					alt='bg-arc-top'
					width={202}
					height={273}
					style={{ top: 0, right: 20 }}
				/>
				<BGImg
					src='/images/arc3.svg'
					alt='bg-arc-bottom'
					width={274}
					height={256}
					style={{ bottom: 0, left: 20 }}
				/>

				<Row>
					<Left xs={12} md={6}>
						<CardWrapper>
							<ProjectCard
								project={cause}
								isNew={true}
								projectsCount={cause.activeProjectsCount || 0}
							/>
						</CardWrapper>
					</Left>

					<Right xs={12} md={6}>
						<ConfettiContainer>
							<LottieControl
								size={400}
								animationData={CongratsAnimation}
							/>
						</ConfettiContainer>
						<GiverH4>
							{formatMessage({ id: 'label.congratulations' })}
						</GiverH4>
						<SuccessMessage>
							{formatMessage({
								id: 'label.cause.your_cause_has_been_published',
							})}
						</SuccessMessage>
						<CopyBox>
							<CopyLink url={fullPath(causePath)} />
						</CopyBox>
						<SocialBox
							cause={cause}
							contentType={EContentTypeCause.creationSuccess}
							numberOfProjects={cause.activeProjectsCount ?? 0}
						/>

						<br />
						<P
							style={{
								fontSize: 14,
								marginTop: 24,
								color: neutralColors.gray[700],
							}}
						>
							Provide us feedback on your experience with Causes
							by filling out{' '}
							<Link
								href='https://giveth.typeform.com/to/e68DoSqk'
								target='_blank'
								rel='noopener noreferrer'
								passHref
							>
								<StyledSurveyLink>
									this 2 minute survey
								</StyledSurveyLink>
							</Link>
							. Your feedback helps us make Giveth better!
						</P>

						<P>
							{formatMessage({ id: 'label.you_can_now_view_it' })}
						</P>
						<Link href={causePath}>
							<ProjectsButton
								label={formatMessage({
									id: 'label.view_cause',
								})}
							/>
						</Link>

						<P style={{ marginTop: 16, fontSize: 14 }}>
							Want to learn more about Causes?{' '}
							<Link
								href='https://docs.giveth.io/donation-agents'
								target='_blank'
								rel='noopener noreferrer'
								passHref
							>
								<StyledDocLink>
									Visit our documentation
								</StyledDocLink>
							</Link>
						</P>
					</Right>
				</Row>
			</ContainerStyled>
		</Wrapper>
	);
};

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

const BGImg = styled(Image)`
	position: absolute;
`;

const GiverH4 = styled(H2)`
	color: ${brandColors.deep[700]};
	font-weight: 700;
	margin-bottom: 24px;
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

const ConfettiContainer = styled.div`
	position: absolute;
	z-index: -1;
`;
const CardWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const ProjectCountLabel = styled.span`
	font-size: 14px;
	font-weight: 500;
	color: #8c8c8c;
	width: 100%;
	text-align: left;
	padding: 10px 12px 10px 12px; // top & bottom: 10px, left & right: 12px
	box-sizing: border-box;
`;

const StyledDocLink = styled.a`
	color: ${brandColors.pinky[500]};
	text-decoration: underline;
	font-size: 14px;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	margin-top: 8px;
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;
const StyledSurveyLink = styled.a`
	color: ${brandColors.pinky[500]};
	text-decoration: underline;
	font-weight: 500;
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;

export default SuccessfulCauseCreation;
