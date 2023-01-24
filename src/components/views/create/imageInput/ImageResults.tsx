import Scrollbars from 'react-custom-scrollbars';
import Image from 'next/image';
import React, { FC } from 'react';
import styled from 'styled-components';
import { brandColors } from '@giveth/ui-design-system';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import { useIntl } from 'react-intl';
import { FlexCenter } from '@/components/styled-components/Flex';

interface IImageResults {
	images: Basic[];
	handleSelect: (i: Basic) => void;
	loadMore: () => void;
}

const ImageResults: FC<IImageResults> = ({
	images,
	handleSelect,
	loadMore,
}) => {
	const { formatMessage } = useIntl();

	return (
		<Scrollbars autoHeight autoHeightMax='380px'>
			<ImagesContainer>
				{images?.map(i => (
					<ImageContainer key={i.id} onClick={() => handleSelect(i)}>
						<Image
							src={i.urls.thumb}
							alt={i.alt_description!}
							fill
						/>
					</ImageContainer>
				))}
			</ImagesContainer>
			<LoadMore onClick={loadMore}>
				{formatMessage({ id: 'component.button.load_more' })} ...
			</LoadMore>
		</Scrollbars>
	);
};

const ImageContainer = styled.div`
	width: 200px;
	height: 138px;
	border-radius: 5px;
	overflow: hidden;
	position: relative;
	cursor: pointer;

	img {
		object-fit: cover;
	}
`;

const ImagesContainer = styled(FlexCenter)`
	padding: 10px;
	flex-wrap: wrap;
	gap: 10px;
`;

const LoadMore = styled.div`
	margin: 20px 0;
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export default ImageResults;
