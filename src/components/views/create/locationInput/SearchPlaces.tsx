import React, { FC, useEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useIntl } from 'react-intl';
import { StandaloneSearchBox } from '@react-google-maps/api';
import Input from '@/components/styled-components/Input';
import { ICoords } from './LocationInput';
import { globalLocation } from '@/lib/constants/projects';

interface IMyProps {
	address: string;
	onSelect: (a: string, c: ICoords) => void;
}

const SearchPlaces: FC<IMyProps> = ({ address, onSelect }) => {
	const [searchBox, setSearchBox] =
		useState<google.maps.places.SearchBox | null>(null);
	const [, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
	const [, setSelectedPlace] =
		useState<google.maps.places.PlaceResult | null>(null);
	const [inputValue, setInputValue] = useState<string>(address);
	const { formatMessage } = useIntl();

	// If it is global address disable search and add default value
	const searchInputRef = useRef<HTMLInputElement>(null);
	const isGlobal = address === globalLocation;

	useEffect(() => {
		if (isGlobal && searchInputRef.current) {
			searchInputRef.current.value = globalLocation;
			setInputValue(globalLocation);
		} else {
			if (searchInputRef.current) {
				searchInputRef.current.value = '';
				setInputValue('');
			}
		}
	}, [isGlobal]);

	const onLoadSearchBox = (ref: google.maps.places.SearchBox) => {
		setSearchBox(ref);
	};

	// When user pickup some location we must provide full address and coordinates to parent component
	const onPlacesChanged = () => {
		if (searchBox) {
			const places = searchBox.getPlaces() || [];
			setPlaces(places);
			if (places.length > 0) {
				setSelectedPlace(places[0]);
				const location = places[0].geometry?.location;
				if (location) {
					const choosedAddress =
						places[0].name + ', ' + places[0].formatted_address;
					onSelect(choosedAddress, {
						lat: location?.lat(),
						lng: location?.lng(),
					});
				}
			}
		}
	};

	return (
		<>
			<GlobalStyles />
			<StandaloneSearchBox
				onLoad={onLoadSearchBox}
				onPlacesChanged={onPlacesChanged}
			>
				<InputStyled
					ref={searchInputRef}
					placeholder={
						isGlobal
							? formatMessage({ id: 'label.global_impact' })
							: formatMessage({ id: 'label.search_places...' })
					}
					defaultValue={inputValue}
					disabled={isGlobal}
				/>
			</StandaloneSearchBox>
		</>
	);
};

const InputStyled = styled(Input)`
	margin-bottom: 20px;
`;

// Custom styles for the Google Places autocomplete dropdown
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
