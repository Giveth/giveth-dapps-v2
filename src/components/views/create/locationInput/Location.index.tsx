import React from 'react';
import { H5, Caption } from '@giveth/ui-design-system';
import styled from 'styled-components';

import LocationInput from '@/components/views/create/locationInput/LocationInput';
import { InputContainer, Label } from '../Create.sc';
import config from '@/configuration';

const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`;

const LocationIndex = (props: {
	defaultValue?: string;
	setValue: (a: string) => void;
}) => {
	const { defaultValue, setValue } = props;

	return (
		<>
			<H5>Where will your project have the most impact?</H5>
			<CaptionContainer>
				Make it easier for donors to find your project by providing a
				location.
			</CaptionContainer>
			<InputContainer>
				<Label>Location</Label>
				<LocationInput
					defaultLocation={defaultValue}
					setLocation={setValue}
					googleMapURL={googleMapURL}
					loadingElement={
						<div
							style={{
								width: '100%',
								height: '100%',
							}}
						/>
					}
				/>
			</InputContainer>
		</>
	);
};

const CaptionContainer = styled(Caption)`
	margin-top: 8.5px;
`;

export default LocationIndex;
