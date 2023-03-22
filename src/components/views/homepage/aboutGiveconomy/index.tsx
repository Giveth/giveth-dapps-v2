import Image from 'next/image';
import {
	Button,
	H3,
	Lead,
	neutralColors,
	IconChevronRight16,
	IconGIVBack,
	IconRocketInSpace,
	IconFarm,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Container } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

interface CustomBtn {
	label: string;
	route: string;
}

const AboutGiveconomy = () => {
	const { formatMessage } = useIntl();

	const Btn = ({ label, route }: CustomBtn) => {
		return (
			<>
				<Button
					label={formatMessage({
						id: label,
					})}
					buttonType='texty-primary'
					icon={<IconChevronRight16 />}
					onClick={() => window?.open(route, '_ blank')}
				/>
			</>
		);
	};

	return (
		<SectionContainer>
			<Container>
				<CustomFlex>
					<Section>
						<Content flexDirection='column' gap='40px'>
							<TitleBox>
								<Title>
									{formatMessage({
										id: 'label.earn_rewards',
									})}
								</Title>
								<Icon>
									<IconGIVBack
										size={64}
										color={neutralColors.gray[900]}
									/>
								</Icon>
							</TitleBox>
							<FirstSubtitle>
								{formatMessage({
									id: 'label.the_first_step_to_empowering',
								})}
							</FirstSubtitle>
							<Description>
								{formatMessage({
									id: 'label.donate_to_verified_projects_and_get_giv',
								})}
							</Description>
							<Btn
								label='label.learn_more_about_giv'
								route='/giveconomy'
							/>
						</Content>
						<ImageBox>
							<Image
								className='earn-img'
								src='/images/earn-rewards.svg'
								width={476}
								height={460}
								alt='GIVpower'
							/>
						</ImageBox>
					</Section>
					<ReverseSection>
						<Content flexDirection='column' gap='24px'>
							<TitleBox>
								<Title>
									{formatMessage({
										id: 'label.elevate_projects',
									})}
								</Title>
								<Icon>
									<IconRocketInSpace size={60} />
								</Icon>
							</TitleBox>
							<Subtitle>
								{formatMessage({
									id: 'label.an_impactful_game_connecting_donors_and_projects',
								})}
							</Subtitle>
							<Description>
								{formatMessage({
									id: 'label.use_your_giv_to_influence',
								})}
							</Description>
							<Btn
								label='label.level_up_with_givpower'
								route='/givpower'
							/>
						</Content>
						<ImageBox>
							<Image
								className='elevate-img'
								src='/images/GIVpower.svg'
								width={476}
								height={460}
								alt='GIVpower'
							/>
						</ImageBox>
					</ReverseSection>
					<Section>
						<Content flexDirection='column' gap='24px'>
							<TitleBox>
								<Title>
									{formatMessage({
										id: 'label.enable_change',
									})}
								</Title>
								<Icon>
									<IconFarm
										size={64}
										color={neutralColors.gray[900]}
									/>
								</Icon>
							</TitleBox>
							<Subtitle>
								{formatMessage({
									id: 'label.an_evolution_in_community_fundrising',
								})}
							</Subtitle>
							<Description>
								{formatMessage({
									id: 'label.your_donations_and_participation_in_the_giveconomy',
								})}
							</Description>
							<Btn
								label='label.discover_our_roadmap'
								route='https://docs.giveth.io/whatisgiveth/'
							/>
						</Content>
						<ImageBox>
							<Image
								className='enable-img'
								src='/images/enable-change-earth.svg'
								width={476}
								height={460}
								alt='GIVpower'
							/>
						</ImageBox>
					</Section>
				</CustomFlex>
			</Container>
		</SectionContainer>
	);
};

const SectionContainer = styled.div`
	background-color: ${neutralColors.gray[100]};
	position: relative;
	padding: 70px 0;
`;

const CustomFlex = styled(Flex)`
	flex-direction: column;
	justify-content: center;
`;

const Title = styled(H3)`
	font-weight: 700;
	font-size: 41px;
	line-height: 56px;
	align-items: center;
	text-align: center;
	color: ${neutralColors.gray[900]};
	* {
		width: 60px;
		height: 60px;
		margin: 0 0 0 46px;
	}
`;

const TitleBox = styled(Flex)`
	width: 100%;
	flex-direction: column-reverse;
	align-items: center;
	text-align: center;
	justify-content: center;
	img {
		width: 60px !important;
		height: 100%;
		margin: 0 0 32px 0;
	}
	${mediaQueries.tablet} {
		justify-content: flex-start;
		flex-direction: row;
		margin: 0 0 -30px 0;
		img {
			margin: 0 0 32px 46px;
		}
	}
`;

const Icon = styled.div`
	margin: 0 0 12px 0;
	${mediaQueries.tablet} {
		margin: 0 0 12px 32px;
	}
`;

const ImageBox = styled.div`
	img {
		max-width: 100%;
		height: 100%;
		object-fit: contain;
	}
	${mediaQueries.desktop} {
		> div {
			position: unset !important;
		}

		img {
			width: 100%;
			object-fit: contain;
			position: relative !important;
			height: unset !important;
		}
		.earn-img {
			width: 476px !important;
		}
		.elevate-img {
			width: 367px !important;
		}
		.enable-img {
			width: 386px !important;
		}
	}
`;

const Description = styled(Lead)`
	font-weight: 400;
	font-size: 20px;
	line-height: 150%;
	text-align: flex-end;
	color: ${neutralColors.gray[900]};
`;

const Subtitle = styled(Description)`
	text-align: center;
	font-style: italic;
	${mediaQueries.tablet} {
		text-align: left;
	}
`;

const FirstSubtitle = styled(Subtitle)`
	margin: -20px 0 0 0;
`;

const Section = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	margin: 50px 0;
	justify-content: center;
	align-items: center;
	text-align: left;
	grid-gap: 100px;
	overflow-wrap: break-word;
	flex-direction: column;
	max-width: 100%;

	${mediaQueries.desktop} {
		flex-direction: row;
	}
`;

const ReverseSection = styled(Section)`
	flex-direction: column;
	${mediaQueries.desktop} {
		align-items: center;
		flex-direction: row-reverse;
	}
`;

const Content = styled(Flex)`
	width: 100%;
	align-items: flex-start;
	${mediaQueries.desktop} {
		max-width: 468px;
	}
`;
export default AboutGiveconomy;
