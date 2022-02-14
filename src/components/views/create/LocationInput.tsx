import React, { useState, useCallback } from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import { InputContainer, Label } from './Create.sc';
import { withScriptjs } from 'react-google-maps';
import Map from '@/components/map';

import config from '@/configuration';
import styled from 'styled-components';

const LocationInput = (props: any) => {
	const { setValue } = props;
	const MapLoader = withScriptjs(Map);

	const setImpactLocation = useCallback(val => {
		setValue(val);
	}, []);

	const setGlobalLocation = useCallback(val => {
		setValue({ global: true });
	}, []);

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
					googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&libraries=places`}
					loadingElement={
						<div
							style={{
								width: '100%',
								height: '100%',
							}}
						/>
					}
					setGlobalLocation={setGlobalLocation}
					setLocation={setImpactLocation}
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
