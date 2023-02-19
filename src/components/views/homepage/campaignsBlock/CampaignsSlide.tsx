import { FC, useRef, useState } from 'react';
import {
	brandColors,
	ButtonText,
	H2,
	H4,
	IconChevronRight32,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { ICampaign } from '@/apollo/types/types';
import { Col, Row } from '@/components/Grid';
import { VideoContainer, VideoOverlay } from '@/components/VideoBlock';
import { campaignLinkGenerator } from '@/helpers/url';

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
				<H2>{campaign.title}</H2>
				<H4>{campaign.description}</H4>
				<Link href={campaignLinkGenerator(campaign)}>
					<ExploreLink>
						Explore <IconChevronRight32 />
					</ExploreLink>
				</Link>
			</ContentCol>
			<Col sm={12} md={7}>
				{campaign.video ? (
					<VideoContainer>
						<video
							ref={videoRef}
							id='video'
							onClick={handleVideoClick}
							width='100%'
							onEnded={handleVideoEnd}
						>
							<source src={campaign.video} type='video/mp4' />
						</video>
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
				) : (
					<ImageWrapper>
						<Image
							src={campaign.photo}
							alt='campaign image'
							fill
							style={{ objectFit: 'cover' }}
						/>
					</ImageWrapper>
				)}
			</Col>
		</Row>
	);
};

const ImageWrapper = styled.div`
	width: 100%;
	& > img {
		position: relative !important;
		max-height: 380px;
	}
`;

const ContentCol = styled(Col)`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 24px;
	flex-direction: column;
`;

const ExploreLink = styled(ButtonText)`
	color: ${brandColors.giv[500]};
	display: flex;
	align-items: center;
	gap: 10px;
`;
