import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { createApi } from 'unsplash-js';
import { Basic } from 'unsplash-js/dist/methods/photos/types';
import styled from 'styled-components';
import { neutralColors, Subline } from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';

import SearchBox from '@/components/SearchBox';
import { showToastError } from '@/lib/helpers';
import { Shadow } from '@/components/styled-components/Shadow';
import ExternalLink from '@/components/ExternalLink';
import { unsplashUrl } from '@/components/views/create/imageInput/ImageInput';
import ImageSuggestions from '@/components/views/create/imageInput/ImageSuggestions';
import ImageNoResults from '@/components/views/create/imageInput/ImageNoResults';
import ImageResults from '@/components/views/create/imageInput/ImageResults';
import useDebounce from '@/hooks/useDebounce';

const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_API!;
const unsplash = createApi({ accessKey });

const perPage = 9;
const orientation = 'landscape';

const ImageSearch = (props: {
	setValue: (img: string) => void;
	setAttributes: Dispatch<SetStateAction<{ name: string; username: string }>>;
	attributes: boolean;
}) => {
	const { setValue, attributes, setAttributes } = props;

	const [search, setSearch] = useState('');
	const [images, setImages] = useState<undefined | Basic[]>();

	const debouncedSearch = useDebounce(search);
	const noResults = images && images.length === 0;

	const fetchPhotos = (query: string, loadMore?: boolean) => {
		const page = loadMore && images ? images.length / perPage + 1 : 1;
		unsplash.search
			.getPhotos({ query, orientation, perPage, page })
			.then(res => {
				if (loadMore && images) {
					setImages([...images!, ...res.response?.results!]);
				} else {
					setImages(res.response?.results);
				}
			})
			.catch(error => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'fetchPhotosUnsplashSearch',
					},
				});
			});
	};

	useEffect(() => {
		if (search) fetchPhotos(search);
	}, [debouncedSearch]);

	// It's required by Unsplash guidelines
	const requestDownload = (downloadLocation: string) => {
		unsplash.photos.trackDownload({ downloadLocation }).then();
	};

	const closePopup = () => {
		setSearch('');
		setImages(undefined);
	};

	const handleSelect = (i: Basic) => {
		setAttributes({ name: i.user.name, username: i.user.username });
		setValue(i.urls.regular);
		requestDownload(i.links.download_location);
		closePopup();
	};

	const handleSearch = (query: string) => {
		setSearch(query);
		fetchPhotos(query);
	};

	return (
		<Container>
			{images && <Surrounding onClick={closePopup} />}
			<SearchBox
				onChange={setSearch}
				value={search}
				placeholder='Search Unsplash for photos'
			/>
			{images && (
				<PopupContainer>
					{noResults ? (
						<ImageNoResults onClick={handleSearch} />
					) : (
						<ImageResults
							images={images}
							handleSelect={handleSelect}
							loadMore={() => fetchPhotos(search, true)}
						/>
					)}
				</PopupContainer>
			)}
			{!attributes && (
				<>
					<ImageSuggestions onClick={handleSearch} />
					<PhotoFrom>
						Photos from{' '}
						<ExternalLink href={unsplashUrl} title='Unsplash' />
					</PhotoFrom>
				</>
			)}
		</Container>
	);
};

const PhotoFrom = styled(Subline)`
	margin-top: 28px;
	color: ${neutralColors.gray[600]};
`;

const Surrounding = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: -1;
`;

const Container = styled.div`
	position: relative;
	margin-bottom: 24px;
	z-index: 10;
	text-align: center;
`;

const PopupContainer = styled.div`
	position: absolute;
	background: white;
	border-radius: 10px;
	box-shadow: ${Shadow.Neutral[500]};
	height: 400px;
	overflow: hidden;
	width: 100%;
	text-align: center;
`;

export default ImageSearch;
