import { useState, useRef, FC } from 'react';
import Image from 'next/image';
import { VideoContainer, VideoOverlay } from './Overview.sc';

interface ITabOverviewVideo {
	src: string;
	poster?: string;
}

export const TabOverviewVideo: FC<ITabOverviewVideo> = ({ src, poster }) => {
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

export default TabOverviewVideo;
