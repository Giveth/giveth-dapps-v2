import { FC, memo, useState } from 'react';
import styled from 'styled-components';
import { isNoImg, noImgColor, noImgIcon } from '../../lib/helpers';

interface IProjectCardImageProps {
	image?: string;
}

const ProjectCardImage: FC<IProjectCardImageProps> = ({ image }) => {
	const [src, setSrc] = useState(image);

	return isNoImg(src) ? (
		<NoImg />
	) : (
		<Img
			src={src}
			alt='project image'
			onError={e => {
				setSrc(undefined);
			}}
			loading='lazy'
		/>
	);
};

const Img = styled.img`
	height: 226px;
	width: 100%;
	object-fit: cover;
`;

const NoImg = styled.div`
	background: ${noImgColor};
	width: 100%;
	height: 100%;
	background-image: url(${noImgIcon});
`;

export default memo(ProjectCardImage);
