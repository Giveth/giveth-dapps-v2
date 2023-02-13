import styled from 'styled-components';
import {
	brandColors,
	H4,
	IconRocket,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import VideoBlock from '@/components/VideoBlock';
import TrazadoMustardIcon from 'public/images/trazado-mustard.svg';
import TrazadoGivIcon from 'public/images/trazado-giv.svg';

const GIVpowerVideo = () => {
	const { formatMessage } = useIntl();
	return (
		<VideoContainer>
			<TrazadoMustard>
				<Image src={TrazadoMustardIcon} alt='trazado-mustard' />
			</TrazadoMustard>
			<ArcPurple />
			<RocketPurple>
				<IconRocket color={brandColors.giv[600]} size={64} />
			</RocketPurple>
			<TrazadoGiv>
				<Image src={TrazadoGivIcon} alt='trazado-giv' />
			</TrazadoGiv>
			<H4Styled>
				{formatMessage({
					id: 'label.imagine_a_world_where',
				})}
			</H4Styled>
			<VideoBlock
				src='/video/givpower.mp4'
				poster='/video/giv-giv-giv.jpg'
			/>
		</VideoContainer>
	);
};

const RocketPurple = styled.div`
	transform: rotate(45deg);
	position: absolute;
	left: 140px;
	bottom: -80px;
	${mediaQueries.laptopS} {
		left: 340px;
		bottom: -30px;
	}
`;

const ArcPurple = styled.div`
	position: absolute;
	top: -100px;
	right: 156px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: 13px solid ${brandColors.giv[600]};
	border-right-color: transparent;
	border-left-color: transparent;
	border-top-color: transparent;
	transform: rotate(-45deg);
`;

const TrazadoMustard = styled.div`
	position: absolute;
	top: 0;
	left: 0;
`;

const TrazadoGiv = styled.div`
	position: absolute;
	bottom: -80px;
	right: 0;
`;

const H4Styled = styled(H4)`
	color: ${neutralColors.gray[200]};
	${mediaQueries.laptopS} {
		max-width: 400px;
	}
`;

const VideoContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column-reverse;
	gap: 40px;
	max-width: 1280px;
	margin: 120px auto 113px;
	padding: 0 40px;
	${mediaQueries.laptopS} {
		align-items: center;
		flex-direction: row;
	}
`;

export default GIVpowerVideo;
