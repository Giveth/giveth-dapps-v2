import React, { FC, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useIntl } from 'react-intl';
import {
	LoadScript,
	StandaloneSearchBox,
	Libraries,
} from '@react-google-maps/api';
import Input from '@/components/styled-components/Input';
import config from '@/configuration';
import { ICoords } from './LocationInput';
import { globalLocation } from '@/lib/constants/projects';

interface IMyProps {
	address: string;
	onSelect: (a: string, c: ICoords) => void;
}

const libraries: Libraries = ['places'];

const SearchPlaces: FC<IMyProps> = ({ address, onSelect }) => {
	const [searchBox, setSearchBox] =
		useState<google.maps.places.SearchBox | null>(null);
	const [, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
	const [, setSelectedPlace] =
		useState<google.maps.places.PlaceResult | null>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const isGlobal = address === globalLocation;
	const { formatMessage } = useIntl();

	const onLoadSearchBox = (ref: google.maps.places.SearchBox) => {
		setSearchBox(ref);
	};

	// When user pickup some location we must provide full address and cooirdinates to parent component
	const onPlacesChanged = () => {
		if (searchBox) {
			const places = searchBox.getPlaces() || [];
			setPlaces(places);
			if (places.length > 0) {
				setSelectedPlace(places[0]);
				console.log(places[0]);
				const location = places[0].geometry?.location;
				if (location && mapRef.current) {
					const choosedAddress =
						places[0].name + ', ' + places[0].formatted_address;
					onSelect(choosedAddress, {
						lat: location?.lat(),
						lng: location?.lng(),
					});
					mapRef.current.setCenter(location);
					mapRef.current.setZoom(15);
				}
			}
		}
	};

	return (
		<div>
			<GlobalStyles />
			<LoadScript
				googleMapsApiKey={config.GOOGLE_MAPS_API_KEY || ''}
				libraries={libraries}
			>
				<StandaloneSearchBox
					onLoad={onLoadSearchBox}
					onPlacesChanged={onPlacesChanged}
				>
					<InputStyled
						placeholder={
							isGlobal
								? formatMessage({ id: 'label.global_impact' })
								: formatMessage({
										id: 'label.search_places...',
									})
						}
						disabled={isGlobal}
					/>
				</StandaloneSearchBox>
			</LoadScript>
		</div>
	);
};

const InputStyled = styled(Input)`
	margin-bottom: 20px;
`;

/* Custom styles for the Google Places Autocomplete dropdown */
const GlobalStyles = createGlobalStyle`
  .pac-container {
    background-color: #fff;
    z-index: 10000000001; /* Ensure it is above other elements */
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
  }

  .pac-item {
    padding: 10px 20px;
    font-size: 14px;
    color: #333;
  }

  .pac-item:hover {
    background-color: #f0f0f0;
	cursor: pointer;
  }

  .pac-item-query {
    font-weight: bold;
  }

  /* Hide the "Powered by Google" text */
  .pac-logo::after {
    display: none !important;
  }
`;

export default SearchPlaces;
