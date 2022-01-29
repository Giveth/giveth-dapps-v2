import React, { useState } from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import { InputContainer, Label } from './Create.sc';
import { withScriptjs } from 'react-google-maps';
import Map from '@/components/map';

import config from '@/configuration';
import styled from 'styled-components';
import CheckBox from '@/components/Checkbox';

const LocationInput = (props: any) => {
	const MapLoader = withScriptjs(Map);
	const [globalImpact, setGlobalImpact] = useState(false);
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
					extraComponent={() => {
						return (
							<CheckBox
								title='This project has a global impact'
								checked={globalImpact}
								onChange={() => setGlobalImpact(!globalImpact)}
								style={{ marginTop: '20px' }}
							/>
						);
					}}
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
