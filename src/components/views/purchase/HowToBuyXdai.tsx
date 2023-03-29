import React, { FC, useRef, useState } from 'react';
import {
	neutralColors,
	IconPointerLeft,
	IconPointerRight,
	mediaQueries,
	H3,
	Lead,
	Button,
	IconChevronRight,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import {
	NavigationWrapper,
	PaginationWrapper,
	SwiperPaginationWrapper,
} from '@/components/styled-components/SwiperPagination';
import 'swiper/css';

import { Flex } from '@/components/styled-components/Flex';
import { BigArc } from '@/components/styled-components/Arc';
import useDetectDevice from '@/hooks/useDetectDevice';
import { useDonateData } from '@/context/donate.context';
import Routes from '@/lib/constants/Routes';
import { MtPelerinTutorialSteps } from '@/lib/constants/MtPelerinTutorial';

const BuyXDAI: FC = () => {
	const router = useRouter();
	const { query } = router;
	const slug = query?.slug;

	const { isMobile } = useDetectDevice();
	const { project } = useDonateData();
	const { formatMessage } = useIntl();

	const pagElRef = useRef<HTMLDivElement>(null);
	const nextElRef = useRef<HTMLDivElement>(null);
	const prevElRef = useRef<HTMLDivElement>(null);

	const [swiperInstance, setSwiperInstance] = useState<SwiperClass>();
	const [currentSlide, setCurrentSlide] = useState(0);
	const items = MtPelerinTutorialSteps;

	return (
		<>
			<BigArc />
			<Wrapper>
				<Sections>
					<Content>
						<Info>
							<H3>
								{formatMessage({
									id: items[currentSlide].title,
								})}
							</H3>
							<Lead>
								{formatMessage({
									id: items[currentSlide].description,
								})}
							</Lead>
						</Info>

						<PwdMtPelerin>
							Powered By <img src='/images/mtpelerin.svg' />
						</PwdMtPelerin>
					</Content>
					<Right>
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
								onSlideChange={slide => {
									setCurrentSlide(slide.realIndex);
								}}
								loop={false}
								slidesPerView={'auto'}
								spaceBetween={30}
							>
								{items.map(howto => (
									<SwiperSlide key={howto.id}>
										<HowToImg
											src={`/images/mtpelerinHowTo/mtpel-how-to-${howto.id}.png`}
										/>
									</SwiperSlide>
								))}
							</Swiper>
						</SwiperWrapper>
						<SwiperPaginationWrapper>
							<NavigationWrapper ref={prevElRef}>
								<IconPointerLeft size={24} />
							</NavigationWrapper>
							<PaginationWrapper
								ref={pagElRef}
							></PaginationWrapper>
							<NavigationWrapper ref={nextElRef}>
								<IconPointerRight size={24} />
							</NavigationWrapper>
						</SwiperPaginationWrapper>

						{currentSlide >= items.length - 2 && (
							<Btns>
								<Button
									label={formatMessage({
										id: 'label.buy_xdai',
									})}
									buttonType='primary'
									icon={<IconChevronRight />}
									onClick={() =>
										router.push({
											pathname: Routes.PurchaseXdai,
										})
									}
								/>
								<Button
									label={formatMessage({
										id: 'label.go_back_to_donation_page',
									})}
									buttonType='texty-primary'
									icon={<IconChevronRight />}
									onClick={() =>
										router.push({
											pathname: slug
												? `${Routes.Donate}/${slug}`
												: Routes.Projects,
										})
									}
								/>
							</Btns>
						)}
					</Right>
				</Sections>
			</Wrapper>
		</>
	);
};

const Wrapper = styled.div`
	text-align: center;
	padding: 137px 0;
	position: relative;
`;

const Sections = styled.div`
	height: 100%;
	${mediaQueries.tablet} {
		display: grid;
		grid-template-columns: repeat(2, minmax(500px, 1fr));
		grid-auto-rows: minmax(100px, auto);
	}
	${mediaQueries.mobileL} {
		grid-template-columns: repeat(2, minmax(100px, 1fr));
		padding: 0 40px;
	}
`;

const Right = styled.div`
	z-index: 1;
	text-align: left;
	margin: 0 -30px 0 0;
	border-radius: 16px;
	${mediaQueries.tablet} {
		border-radius: 0 16px 16px 0;
	}
`;

const SwiperWrapper = styled.div`
	padding: 24px 32px 20px;
	margin: 0 0 50px 0;
	width: 100%;
	overflow: hidden;
	.swiper {
		overflow: unset;
	}
	${mediaQueries.tablet} {
		padding: 20px 24px 0;
	}
	${mediaQueries.desktop} {
		padding-right: 10px;
	}
	.swiper-slide {
		width: auto !important;
	}
`;
const HowToImg = styled.img`
	width: 300px;
	max-height: 500px;
	object-fit: contain;
	${mediaQueries.tablet} {
		width: 514px;
	}
`;

const Content = styled.div`
	width: 100%;
	text-align: left;
	color: ${neutralColors.gray[900]};
	margin: 50px 0;
	padding: 20px;

	h3 {
		margin: 0 0 10px 0;
		font-weight: 700;
		font-size: 41px;
		line-height: 56px;
	}

	${mediaQueries.tablet} {
		margin: 0;
		max-width: 555px;
	}
`;

const Info = styled.div`
	padding: 10px 0;
	border-bottom: 1px solid rgba(51, 51, 51, 0.35);
`;

const PwdMtPelerin = styled.div`
	display: flex;
	margin: 30px 0 0 0;
	align-items: center;
	gap: 10px;
	font-weight: 400;
	font-size: 19.3613px;
	line-height: 150%;
	color: ${neutralColors.gray[800]} !important;
`;

const Btns = styled(Flex)`
	flex-direction: row;
	gap: 20px;
	margin: 40px 0 0 0;
	justify-content: center;
`;

export default BuyXDAI;
