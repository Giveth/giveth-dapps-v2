import { brandColors, H2, H4, neutralColors } from '@giveth/ui-design-system';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { Flex } from '@/components/styled-components/Flex';
import { Container } from '@/components/Grid';
import {
	VideoContainer,
	VideoOverlay,
} from '@/components/homeTabs/Overview.sc';
import { mediaQueries } from '@/lib/constants/constants';
import Wave from '@/components/particles/Wave';
import SemiCircle from '@/components/particles/SemiCircle';

const VideoBlock = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
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
		<SectionContainer>
			<Container>
				<CustomFlex alignItems='center'>
					<Flex flexDirection='column' gap='24px'>
						<H2>Learn about Giveth in 60 seconds</H2>
						<H4>
							What people say about the Giveth and why they love
							it.
						</H4>
					</Flex>
					<VideoParticlesContainer>
						<CustomizedVideoContainer>
							<video
								ref={videoRef}
								id='video'
								onClick={handleVideoClick}
								width='100%'
								onEnded={handleVideoEnd}
							>
								<source
									src='/video/givpower.mp4'
									type='video/mp4'
								/>
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
						</CustomizedVideoContainer>
						<VideoWaveContainer>
							<Wave />
						</VideoWaveContainer>
						<VideoSemiCircleContainer>
							<SemiCircle color={brandColors.giv[200]} />
						</VideoSemiCircleContainer>
					</VideoParticlesContainer>
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

const CustomizedVideoContainer = styled(VideoContainer)`
	position: relative;
	border-radius: 20px;
	margin-bottom: 0;
	margin-top: 0;
`;

const CustomFlex = styled(Flex)`
	flex-direction: column-reverse;
	gap: 40px;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

const VideoParticlesContainer = styled.div`
	position: relative;
`;

const VideoWaveContainer = styled.div`
	position: absolute;
	bottom: 20px;
	right: -30px;
`;

const VideoSemiCircleContainer = styled.div`
	position: absolute;
	top: -40px;
	right: 40px;
`;

export default VideoBlock;
