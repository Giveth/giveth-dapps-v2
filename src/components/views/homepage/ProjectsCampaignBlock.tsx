import {
	Button,
	H1,
	IconChevronRight32,
	IconPointerLeft,
	IconPointerRight,
	mediaQueries,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FC, useRef, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper/types';
import Link from 'next/link';
import { Container, OneSideContainer } from '@giveth/ui-design-system';
import { ICampaign } from '@/apollo/types/types';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import ProjectCard from '@/components/project-card/ProjectCard';
import 'swiper/css';
import { BlockHeader, BlockTitle } from './common';
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
	const pagElRef = useRef<HTMLDivElement>(null);
	const nextElRef = useRef<HTMLDivElement>(null);
	const prevElRef = useRef<HTMLDivElement>(null);
	//Please don't remove this
	const [swiperInstance, setSwiperInstance] = useState<SwiperClass>();
	const { formatMessage } = useIntl();

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
			<BottomContainer>
				<BottomSection>
					<Title>
						<H1 weight={700}>{campaign.title}</H1>
						<Link href={campaignLinkGenerator(campaign) || ''}>
							<Button
								buttonType='texty-primary'
								label={formatMessage({
									id: 'page.projects.title.explore',
								})}
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
						>
							{campaign.relatedProjects.map(project => (
								<SwiperSlide key={project.id}>
									<StyledProjectCard project={project} />
								</SwiperSlide>
							))}
						</Swiper>
					</SwiperWrapper>
				</BottomSection>
			</BottomContainer>
		</>
	);
};

const StyledProjectCard = styled(ProjectCard)`
	width: 360px;
	margin: 0;
	${mediaQueries.laptopS} {
		width: 384px !important;
	}
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
	${mediaQueries.tablet} {
		.swiper-slide:last-of-type {
			margin-right: 60px;
		}
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
	z-index: 10;
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
