import {
	brandColors,
	Button,
	H2,
	H4,
	IconChevronRight24,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { Container } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import {
	VideoContainer,
	VideoOverlay,
} from '@/components/GIVeconomyPages/GIVeconomy.sc';
import { mediaQueries } from '@/lib/constants/constants';
import Wave from '@/components/particles/Wave';
import SemiCircle from '@/components/particles/SemiCircle';
import QuarterCircle from '@/components/particles/QuarterCircle';
import Routes from '@/lib/constants/Routes';

const VideoBlock = () => {
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
		<SectionContainer>
			<Container>
				<CustomFlex alignItems='center'>
					<Flex flexDirection='column' gap='24px'>
						<H2 weight={700}>
							{formatMessage({ id: 'label.what_is_giveth' })}
						</H2>
						<Desc>
							{formatMessage({
								id: 'label.discover_what_makes_giveth_different',
							})}
						</Desc>
						<Link href={Routes.AboutUs} passHref>
							<AboutUsButton
								buttonType='texty-secondary'
								label={formatMessage({
									id: 'label.more_about_us',
								})}
								icon={<IconChevronRight24 />}
							/>
						</Link>
					</Flex>
					<VideoParticlesContainer>
						<CustomizedVideoContainer>
							<video
								ref={videoRef}
								id='video'
								onClick={handleVideoClick}
								width='100%'
								onEnded={handleVideoEnd}
								poster='https://giveth.mypinata.cloud/ipfs/QmZ3Xw8EbiirXFFvEzUWSZDwqjg2Y2acQj7H6tgxWoC7SX'
							>
								<source
									src='/video/homepage-intro.mp4'
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
					<TopWaveContainer>
						<Wave color={brandColors.pinky[200]} />
					</TopWaveContainer>
				</CustomFlex>
			</Container>
			<QuarterCircleContainer>
				<QuarterCircle />
			</QuarterCircleContainer>
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

const TopWaveContainer = styled.div`
	position: absolute;
	top: 30px;
	left: 0;
`;

const VideoSemiCircleContainer = styled.div`
	position: absolute;
	top: -40px;
	right: 40px;
`;

const QuarterCircleContainer = styled.div`
	position: absolute;
	bottom: 20px;
	left: 30%;
`;

const AboutUsButton = styled(Button)`
	max-width: 200px;
`;

const Desc = styled(H4)`
	color: ${neutralColors.gray[800]};
`;

export default VideoBlock;
