import { FC, memo, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { isNoImg } from '../../lib/helpers';

interface IProjectCardImageProps {
	image?: string;
}

const ProjectCardImage: FC<IProjectCardImageProps> = ({ image }) => {
	const [src, setSrc] = useState(image);

	return isNoImg(src) ? (
		<NoImg />
	) : (
		<Img
			src={src!}
			fill
			alt='project image'
			onError={() => setSrc('/images/backgrounds/project-bg.png')}
			loading='lazy'
		/>
	);
};

const Img = styled(Image)`
	height: 226px;
	width: 100%;
	object-fit: cover;
`;

const NoImg = styled.div`
	width: 100%;
	height: 100%;
	background-image: url('/images/backgrounds/project-bg.png');
	background-size: cover;
`;

export default memo(ProjectCardImage);
