import {
	Button,
	H1,
	IconChevronRight32,
	IconPointerLeft,
	IconPointerRight,
	mediaQueries,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FC, useEffect, useRef, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper/types';
import Link from 'next/link';
import { ICampaign } from '@/apollo/types/types';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import ProjectCard from '@/components/project-card/ProjectCard';
import 'swiper/css';
import { useAppSelector } from '@/features/hooks';
import { client } from '@/apollo/apolloClient';
import { FETCH_CAMPAIGN_BY_SLUG } from '@/apollo/gql/gqlCampaign';
import { BlockHeader, BlockTitle } from './common';
import { Container, OneSideContainer } from '@/components/Grid';
import {
	NavigationWrapper,
	PaginationWrapper,
	SwiperPaginationWrapper,
} from '@/components/styled-components/SwiperPagination';
import { campaignLinkGenerator } from '@/helpers/url';

interface IProjectsCampaignBlockProps {
	campaign: ICampaign;
}

const ProjectsCampaignBlock: FC<IProjectsCampaignBlockProps> = ({
	campaign,
}) => {
	const user = useAppSelector(state => state.user.userData);
	const [projects, setProjects] = useState(campaign.relatedProjects);

	const pagElRef = useRef<HTMLDivElement>(null);
	const nextElRef = useRef<HTMLDivElement>(null);
	const prevElRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!user || !user.id) return;
		const variables: any = {
			slug: campaign.slug,
		};
		const fetchCampaign = async (userId: string) => {
			variables.connectedWalletUserId = Number(userId);
			const { data } = await client.query({
				query: FETCH_CAMPAIGN_BY_SLUG,
				variables,
				fetchPolicy: 'network-only',
			});
			setProjects(data.findCampaignBySlug.relatedProjects);
		};
		fetchCampaign(user.id);
	}, [campaign.slug, user]);

	const [swiperInstance, setSwiperInstance] = useState<SwiperClass>();

	return (
		<>
			<TopContainer>
				<BlockHeader>
					<BlockTitle weight={700}>
						{campaign.hashtags && campaign.hashtags.length > 0
							? campaign.hashtags.map(hashtag => `#${hashtag} `)
							: ''}
					</BlockTitle>
					<SwiperPaginationWrapper>
						<NavigationWrapper ref={prevElRef}>
							<IconPointerLeft size={24} />
						</NavigationWrapper>
						<PaginationWrapper ref={pagElRef}></PaginationWrapper>
						<NavigationWrapper ref={nextElRef}>
							<IconPointerRight size={24} />
						</NavigationWrapper>
					</SwiperPaginationWrapper>
				</BlockHeader>
			</TopContainer>
			<Wrapper>
				<BottomContainer>
					<BottomSection>
						<Title>
							<H1 weight={700}>{campaign.title}</H1>
							<Link href={campaignLinkGenerator(campaign) || ''}>
								<Button
									buttonType='texty-primary'
									label='EXPLORE'
									icon={<IconChevronRight32 />}
								/>
							</Link>
						</Title>
						<SwiperWrapper>
							<Swiper
								onSwiper={setSwiperInstance}
								modules={[Navigation, Pagination]}
								navigation={{
									nextEl: nextElRef.current,
									prevEl: prevElRef.current,
								}}
								pagination={{
									el: pagElRef.current,
									clickable: true,
									type: 'bullets',
									renderBullet: function (index, className) {
										return (
											'<span class="' +
											className +
											'">' +
											(index + 1) +
											'</span>'
										);
									},
								}}
								slidesPerView={'auto'}
								spaceBetween={30}
								// slidesPerGroupAuto
								// breakpoints={{
								// 	320: {
								// 		slidesPerView: 1,
								// 	},
								// 	768: {
								// 		slidesPerView: 1.3,
								// 	},
								// 	1024: {
								// 		slidesPerView: 2.1,
								// 	},
								// 	1280: {
								// 		slidesPerView: 2.2,
								// 	},
								// }}
							>
								{projects.map(project => (
									<SwiperSlide key={project.id}>
										<StyledProjectCard>
											<ProjectCard project={project} />
										</StyledProjectCard>
									</SwiperSlide>
								))}
							</Swiper>
						</SwiperWrapper>
					</BottomSection>
				</BottomContainer>
			</Wrapper>
		</>
	);
};
const Wrapper = styled.div`
	width: 100vw;
	overflow-x: hidden;
`;

const StyledProjectCard = styled.div`
	width: 360px;
	margin: 0;
`;

const SwiperWrapper = styled.div`
	padding: 24px 32px 20px;
	width: 100%;
	overflow: hidden;
	.swiper {
		overflow: unset;
	}
	${mediaQueries.tablet} {
		padding: 20px 24px 20px;
	}
	${mediaQueries.desktop} {
		padding-right: 10px;
	}
	.swiper-slide {
		width: auto !important;
	}
`;

const BottomSection = styled(Flex)`
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

// const ExploreText = styled(Button)``;

const Title = styled(FlexCenter)`
	flex-direction: column;
	border-radius: 12px;
	box-shadow: 12px 0 20px rgba(212, 218, 238, 0.4);
	margin: 0 32px;
	user-select: none;
	padding-right: 24px;
	gap: 24px;
	${mediaQueries.tablet} {
		margin: 0;
		width: 263px;
	}
	${mediaQueries.desktop} {
		width: 391px;
	}
`;

const TopContainer = styled(Container)`
	padding-top: 40px;
`;

const BottomContainer = styled(OneSideContainer)`
	padding-bottom: 80px;
`;

export default ProjectsCampaignBlock;
