import { FC, useRef, useState } from 'react';
import {
	brandColors,
	ButtonText,
	H2,
	H4,
	IconChevronRight32,
	neutralColors,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { Col, Row } from '@giveth/ui-design-system';
import { ICampaign } from '@/apollo/types/types';
import { VideoContainer, VideoOverlay } from '@/components/VideoBlock';
import { campaignLinkGenerator } from '@/helpers/url';
import { mediaQueries } from '@/lib/constants/constants';

interface ICampaignsSlideProps {
	campaign: ICampaign;
}

export const CampaignsSlide: FC<ICampaignsSlideProps> = ({ campaign }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const { formatMessage } = useIntl();

	function handleVideoClick() {
		const { current: video } = videoRef;
		if (video?.paused) {
			video?.play();
			setIsPlaying(true);
		} else {
			video?.pause();
			setIsPlaying(false);
		}
	}
	function handleVideoEnd() {
		const { current: video } = videoRef;
		video && (video.currentTime = 0);
		setIsPlaying(false);
	}
	return (
		<Row>
			<ContentCol sm={12} md={5}>
				<H2 weight={700}>{campaign.title}</H2>
				<Desc>{campaign.description}</Desc>
				<Link href={campaignLinkGenerator(campaign) || ''}>
					<ExploreLink>
						{formatMessage({ id: 'page.projects.title.explore' })}{' '}
						<IconChevronRight32 />
					</ExploreLink>
				</Link>
			</ContentCol>
			<Col sm={12} md={7}>
				{campaign.video ? (
					<VideoContainer>
						<StyledVideo
							as='video'
							ref={videoRef}
							id='video'
							onClick={handleVideoClick}
							width='100%'
							onEnded={handleVideoEnd}
							poster={campaign.videoPreview}
						>
							<source src={campaign.video} type='video/mp4' />
						</StyledVideo>
						<VideoOverlay
							onClick={handleVideoClick}
							hidden={isPlaying}
						>
							<Image
								src='/images/video_play.svg'
								width='90'
								height='90'
								alt='giveconomy video play button'
								draggable={false}
							/>
						</VideoOverlay>
					</VideoContainer>
				) : campaign.photo ? (
					<ImageWrapper>
						<Image
							src={campaign.photo}
							alt='campaign image'
							fill
							style={{ objectFit: 'cover' }}
						/>
					</ImageWrapper>
				) : (
					''
				)}
			</Col>
		</Row>
	);
};

const HeightResponsive = styled.div`
	height: 100%;
	${mediaQueries.tablet} {
		height: 360px;
	}
	${mediaQueries.laptopS} {
		height: 298px;
	}
	${mediaQueries.laptopL} {
		height: 373px;
	}
	${mediaQueries.desktop} {
		height: 407px;
	}
`;

const StyledVideo = styled(HeightResponsive)``;

const ImageWrapper = styled(HeightResponsive)`
	width: 100%;
	border-radius: 16px;
	overflow: hidden;
	position: relative;
`;

const ContentCol = styled(Col)`
	display: flex;
	justify-content: center;
	gap: 24px;
	flex-direction: column;
`;

const ExploreLink = styled(ButtonText)`
	color: ${brandColors.giv[500]};
	display: flex;
	align-items: center;
	gap: 10px;
	justify-content: center;
`;

const Desc = styled(H4)`
	color: ${neutralColors.gray[800]};
`;
