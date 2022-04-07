import { H5, P } from '@giveth/ui-design-system';
import React from 'react';
import ImageSuggestions from '@/components/views/create/imageInput/ImageSuggestions';

const ImageNoResults = (props: { onClick: (s: string) => void }) => {
	return (
		<>
			<br />
			<H5 weight={900}>No results found</H5>
			<P>Try searching for something else</P>
			<ImageSuggestions onClick={props.onClick} />
		</>
	);
};

export default ImageNoResults;
