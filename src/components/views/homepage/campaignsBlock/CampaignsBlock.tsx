import React, { FC, useRef, useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import {
	IconPointerLeft,
	IconPointerRight,
	neutralColors,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import { Navigation, Pagination } from 'swiper';
import { useIntl } from 'react-intl';
import { Container, Row } from '@giveth/ui-design-system';
import { BlockHeader, BlockTitle } from '../common';
import { ICampaign } from '@/apollo/types/types';
import { CampaignsSlide } from './CampaignsSlide';
import TrazadoPink from '/public/images/trazado-pink.svg';
import CaminhoPink from '/public/images/caminho-pink.svg';
import CaminhoGIV from '/public/images/caminho-giv.svg';
import {
	NavigationWrapper,
	PaginationWrapper,
	SwiperPaginationWrapper,
} from '@/components/styled-components/SwiperPagination';

interface ICampaignsBlockProps {
	campaigns: ICampaign[];
}

export const CampaignsBlock: FC<ICampaignsBlockProps> = ({ campaigns }) => {
	const [swiper, setSwiper] = useState<SwiperType>();
	const pagElRef = useRef<HTMLDivElement>(null);
	const nextElRef = useRef<HTMLDivElement>(null);
	const prevElRef = useRef<HTMLDivElement>(null);
	const { formatMessage } = useIntl();

	return (
		<CampaignsBlockWrapper>
			<ContainerRelative>
				<BlockHeader>
					<BlockTitle>
						{formatMessage({
							id: 'label.whats_up_on_giveth',
						})}
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
					<TrazadoPinkWrapper>
						<Image
							src={TrazadoPink}
							width={216}
							height={38}
							alt='wave'
						/>
					</TrazadoPinkWrapper>
				</BlockHeader>
				<SwiperWrapper>
					<Swiper
						slidesPerView={1}
						onSwiper={setSwiper}
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
					>
						{campaigns.map(campaign => (
							<SwiperSlide key={campaign.id}>
								<CampaignsSlide campaign={campaign} />
							</SwiperSlide>
						))}
					</Swiper>
				</SwiperWrapper>
				<CaminhoPinkWrapper>
					<Image
						src={CaminhoPink}
						width={32}
						height={32}
						alt='caminho'
					/>
				</CaminhoPinkWrapper>
				<CaminhoGivWrapper>
					<Image
						src={CaminhoGIV}
						width={27}
						height={27}
						alt='caminho'
					/>
				</CaminhoGivWrapper>
			</ContainerRelative>
		</CampaignsBlockWrapper>
	);
};

const CampaignsBlockWrapper = styled.div`
	padding-top: 70px;
	padding-bottom: 110px;
	background: ${neutralColors.gray[200]};
	overflow-x: hidden;
`;

const ContainerRelative = styled(Container)`
	position: relative;
`;

const SwiperWrapper = styled(Row)``;

const ParticleWrapper = styled.div`
	position: absolute;
	user-select: none;
`;

const TrazadoPinkWrapper = styled(ParticleWrapper)`
	top: -44px;
	left: -151px;
`;

const CaminhoPinkWrapper = styled(ParticleWrapper)`
	bottom: -72px;
	left: 30%;
`;

const CaminhoGivWrapper = styled(ParticleWrapper)`
	bottom: 30px;
	right: -70px;
`;
