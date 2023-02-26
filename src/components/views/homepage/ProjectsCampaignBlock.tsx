import {
	brandColors,
	ButtonText,
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
import InternalLink from '@/components/InternalLink';
import { ICampaign } from '@/apollo/types/types';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import ProjectCard from '@/components/project-card/ProjectCard';
import 'swiper/css';
import { useAppSelector } from '@/features/hooks';
import { client } from '@/apollo/apolloClient';
import { FETCH_CAMPAIGN_BY_SLUG } from '@/apollo/gql/gqlCampaign';
import { BlockHeader, BlockTitle } from './common';
import { Container } from '@/components/Grid';
import { campaignLinkGenerator } from '@/helpers/url';
import {
	NavigationWrapper,
	PaginationWrapper,
	SwiperPaginationWrapper,
} from '@/components/styled-components/SwiperPagination';

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
		<Wrapper>
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
			<BottomSection>
				<Title>
					<H1 weight={700} style={{ overflowWrap: 'anywhere' }}>
						{campaign.title.split(' ').map(t => (
							<>
								<span>{t}</span>
								<br />
							</>
						))}
					</H1>
					<InternalLink
						href={campaignLinkGenerator(campaign) || ''}
						color={brandColors.giv[500]}
					>
						<ExploreText>
							EXPLORE <IconChevronRight32 />
						</ExploreText>
					</InternalLink>
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
						spaceBetween={24}
						slidesPerGroupAuto
						breakpoints={{
							320: {
								slidesPerView: 1,
							},
							768: {
								slidesPerView: 1.3,
							},
							1024: {
								slidesPerView: 2.1,
							},
							1280: {
								slidesPerView: 2.2,
							},
						}}
					>
						{projects.map(project => (
							<SwiperSlide key={project.id}>
								<ProjectCard project={project} />
							</SwiperSlide>
						))}
					</Swiper>
				</SwiperWrapper>
			</BottomSection>
		</Wrapper>
	);
};

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
`;

const BottomSection = styled(Flex)`
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const ExploreText = styled(ButtonText)`
	margin-top: 44px;
	display: flex;
	align-items: center;
	gap: 10px;
`;

const Title = styled(FlexCenter)`
	flex-direction: column;
	border-radius: 12px;
	box-shadow: 12px 0 20px rgba(212, 218, 238, 0.4);
	margin: 0 32px;
	user-select: none;
	padding-right: 24px;
	${mediaQueries.tablet} {
		margin: 0;
		width: 263px;
	}
	${mediaQueries.desktop} {
		width: 391px;
	}
`;

const Wrapper = styled(Container)`
	padding: 40px 0 80px;
`;

export default ProjectsCampaignBlock;
