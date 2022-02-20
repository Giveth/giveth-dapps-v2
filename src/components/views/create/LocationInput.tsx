import React, { useCallback } from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import { withScriptjs } from 'react-google-maps';
import styled from 'styled-components';

import Map from '@/components/map';
import { InputContainer, Label } from './Create.sc';
import config from '@/configuration';

const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`;

const LocationInput = (props: {
	value: string;
	setValue: (a: string) => void;
}) => {
	const { value, setValue } = props;
	const MapLoader = withScriptjs(Map);

	const setImpactLocation = useCallback(val => setValue(val), [value]);

	return (
		<>
			<H5>Where will your project have the most impact?</H5>
			<div>
				<CaptionContainer>
					Make it easier for donors to find your project by providing
					a location.
				</CaptionContainer>
			</div>

			<InputContainer>
				<Label>Location</Label>
				<MapLoader
					googleMapURL={googleMapURL}
					loadingElement={
						<div
							style={{
								width: '100%',
								height: '100%',
							}}
						/>
					}
					setLocation={setImpactLocation}
					location={value}
				/>
			</InputContainer>
		</>
	);
};

const CaptionContainer = styled(Caption)`
	height: 18px;
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

export default LocationInput;
