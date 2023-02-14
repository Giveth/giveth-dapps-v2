import { useState, useRef, FC } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { FlexCenter } from '@/components/styled-components/Flex';

interface ITabOverviewVideo {
	src: string;
	poster?: string;
}

export const VideoBlock: FC<ITabOverviewVideo> = ({ src, poster }) => {
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
		<VideoContainer>
			<video
				ref={videoRef}
				id='video'
				onClick={handleVideoClick}
				width='100%'
				onEnded={handleVideoEnd}
				poster={poster}
			>
				<source src={src} type='video/mp4' />
			</video>
			<VideoOverlay onClick={handleVideoClick} hidden={isPlaying}>
				<Image
					src='/images/video_play.svg'
					width='90'
					height='90'
					alt='giveconomy video play button'
					draggable={false}
				/>
			</VideoOverlay>
		</VideoContainer>
	);
};

export const VideoContainer = styled(FlexCenter)`
	position: relative;
	margin: 0 auto;
	width: 100%;
	max-width: 1440px;
	overflow: hidden;
	border-radius: 20px;
	cursor: pointer;
`;

export const VideoOverlay = styled.div<{ hidden: boolean }>`
	display: ${props => (props.hidden ? 'none' : 'flex')};
	justify-content: center;
	align-items: center;
	left: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	background: rgba(0, 0, 0, 0.3);
	transition: background 0.3s ease-in-out;
	user-select: none;
	&:hover {
		background: rgba(0, 0, 0, 0.5);
	}
`;

export default VideoBlock;
