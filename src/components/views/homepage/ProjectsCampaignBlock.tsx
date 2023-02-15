import {
	brandColors,
	ButtonText,
	H1,
	H4,
	IconChevronRight32,
	IconPointerLeft,
	IconPointerRight,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FC, useEffect, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper/types';
import InternalLink from '@/components/InternalLink';
import { ICampaign } from '@/apollo/types/types';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import ProjectCard from '@/components/project-card/ProjectCard';
import useDetectDevice from '@/hooks/useDetectDevice';
import { Shadow } from '@/components/styled-components/Shadow';
import 'swiper/css';
import { PaginationItem } from '@/components/SwiperPagination';
import { useAppSelector } from '@/features/hooks';
import { client } from '@/apollo/apolloClient';
import { FETCH_ALL_PROJECTS } from '@/apollo/gql/gqlProjects';

interface IProjectsCampaignBlockProps {
	campaign: ICampaign;
}

const ProjectsCampaignBlock: FC<IProjectsCampaignBlockProps> = ({
	campaign,
}) => {
	const user = useAppSelector(state => state.user.userData);
	const [projects, setProjects] = useState(campaign);

	useEffect(() => {
		if (!user || !user.id) return;
		const variables: any = {};
		const fetchCampaign = async (userId: string) => {
			if (userId) {
				variables.connectedWalletUserId = Number(userId);
			}
			const { data } = await client.query({
				query: FETCH_ALL_PROJECTS,
				variables,
				fetchPolicy: 'network-only',
			});
			console.log('data', data);
		};
		fetchCampaign(user.id);
	}, [user]);

	const { isMobile, isTablet, isLaptopS, isLaptopL, isDesktop } =
		useDetectDevice();
	const [swiperInstance, setSwiperInstance] = useState<SwiperClass>();
	const [currentSlide, setCurrentSlide] = useState(1);
	const slidesPerView = isMobile
		? 1
		: isTablet
		? 1.3
		: isLaptopS
		? 2.1
		: isLaptopL
		? 2.3
		: 3;

	let paginationCount = Math.floor(
		campaign.relatedProjectsCount - slidesPerView + 1,
	);
	if (!isDesktop && !isMobile) paginationCount += 1;
	const pages = Array.from(Array(paginationCount).keys());

	useEffect(() => {
		if (swiperInstance)
			swiperInstance?.on('slideChange', () =>
				setCurrentSlide(swiperInstance?.realIndex + 1),
			);
	}, [swiperInstance]);

	return (
		<Wrapper>
			<UpperSection>
				<Title weight={700}>#FreshCampaign</Title>
				<Pagination>
					<PointerWrapper id='homeCampaignPrev'>
						<IconPointerLeft size={24} />
					</PointerWrapper>
					{pages.map(index => (
						<PaginationItem
							key={index}
							onClick={() => swiperInstance?.slideTo(index)}
							isActive={currentSlide === index + 1}
						>
							{index + 1}
						</PaginationItem>
					))}
					<PointerWrapper id='homeCampaignNext'>
						<IconPointerRight size={24} />
					</PointerWrapper>
				</Pagination>
			</UpperSection>
			<BottomSection>
				<SavePlanet>
					<H1 weight={700}>Save The Planet!</H1>
					<InternalLink href={''} color={brandColors.giv[500]}>
						<ExploreText>
							EXPLORE <IconChevronRight32 />
						</ExploreText>
					</InternalLink>
				</SavePlanet>
				<SwiperWrapper>
					<Swiper
						onSwiper={setSwiperInstance}
						slidesPerView={slidesPerView}
						modules={[Navigation]}
						navigation={{
							nextEl: '#homeCampaignNext',
							prevEl: '#homeCampaignPrev',
						}}
						spaceBetween={24}
					>
						{campaign.relatedProjects.map(project => (
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

const UpperSection = styled(Flex)`
	flex-direction: column;
	margin-bottom: 50px;
	${mediaQueries.tablet} {
		margin-bottom: 32px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
`;

const PointerWrapper = styled(FlexCenter)`
	cursor: pointer;
	border-radius: 48px;
	box-shadow: ${Shadow.Giv[400]};
	padding: 8px 13px;
	&.swiper-button-disabled {
		opacity: 0.4;
		cursor: default;
	}
`;

const Pagination = styled(Flex)`
	gap: 24px;
	align-items: center;
	margin: 0 auto;
	${mediaQueries.tablet} {
		margin-left: 0;
		margin-right: 32px;
	}
	${mediaQueries.laptopL} {
		margin-right: 40px;
	}
	${mediaQueries.desktop} {
		margin-right: 120px;
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
`;

const BottomSection = styled(Flex)`
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const Title = styled(H4)`
	color: ${neutralColors.gray[600]};
	padding-left: 58px;
	margin-bottom: 40px;
	${mediaQueries.tablet} {
		margin-bottom: 0;
		padding-left: 32px;
	}
	${mediaQueries.laptopL} {
		padding-left: 40px;
	}
	${mediaQueries.desktop} {
		padding-left: 120px;
	}
`;

const ExploreText = styled(ButtonText)`
	margin-top: 44px;
	display: flex;
	align-items: center;
	gap: 10px;
`;

const SavePlanet = styled.div`
	border-radius: 12px;
	box-shadow: 12px 0 20px rgba(212, 218, 238, 0.4);
	padding: 16px 24px 20px 16px;
	margin: 0 32px;
	user-select: none;
	${mediaQueries.tablet} {
		margin: 0;
		max-width: 263px;
		padding: 73px 24px 70px 34px;
	}
	${mediaQueries.desktop} {
		max-width: 391px;
		padding: 73px 24px 77px 144px;
	}
`;

const Wrapper = styled.div`
	padding: 40px 0 80px;
	max-width: 1440px;
	margin: 0 auto;
	${mediaQueries.tablet} {
		padding: 42px 0;
	}
`;

export default ProjectsCampaignBlock;
