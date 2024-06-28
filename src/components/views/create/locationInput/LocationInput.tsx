import React, { useCallback, useEffect, useState } from 'react';
import { LoadScript, Libraries } from '@react-google-maps/api';
import { globalLocation } from '@/lib/constants/projects';
import config from '@/configuration';
import GoogleMapComponent from '@/components/views/create/locationInput/GoogleMap';
import SearchPlaces from '@/components/views/create/locationInput/SearchPlaces';
import CheckBox from '@/components/Checkbox';

const libraries: Libraries = ['places'];

export interface ICoords {
	lat: number;
	lng: number;
}
type MyProps = {
	defaultLocation?: string;
	setLocation: (a: string) => void;
};

const getCoordinates = async (address: string): Promise<ICoords | null> => {
	try {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${config.GOOGLE_MAPS_API_KEY || ''}`,
		);
		const data = await response.json();
		if (data.status === 'OK') {
			const location = data.results[0].geometry.location;
			return { lat: location.lat, lng: location.lng };
		} else {
			console.error('Geocoding API error:', data.status);
			return null;
		}
	} catch (error) {
		console.error('Geocoding API error:', error);
		return null;
	}
};

const LocationIndex = ({ defaultLocation, setLocation }: MyProps) => {
	const [address, setAddress] = useState<string>('');
	const [coords, setCoords] = useState<ICoords>({
		lat: 41.3879,
		lng: 2.15899,
	});

	const isGlobal = address === globalLocation;

	// Set user default address if it isn't global location and find coordinates to setup map location
	useEffect(() => {
		if (defaultLocation) {
			if (defaultLocation === globalLocation) {
				setAddress(globalLocation);
			} else {
				getCoordinates(defaultLocation).then(defaultCoords => {
					if (defaultCoords) {
						setCoords(defaultCoords);
					}
				});
			}
		}
	}, [defaultLocation]);

	// this function we provide to child search input component to get address and coordinates
	const handleSelect = useCallback(
		(address: string, coordinates: ICoords) => {
			setLocation(address);
			setAddress(address);
			setCoords(coordinates);
		},
		[setLocation],
	);

	return (
		<>
			<LoadScript
				googleMapsApiKey={config.GOOGLE_MAPS_API_KEY || ''}
				libraries={libraries}
			>
				<SearchPlaces address={address} onSelect={handleSelect} />
				<CheckBox
					//  TODO: FORMAT THIS TO BE A FUNCTIONAL COMPONENT AND ADD USE INTL FOR TRANSLATIONS
					label='This project has a global impact'
					checked={isGlobal}
					onChange={() => {
						const loc = isGlobal ? '' : globalLocation;
						setAddress(loc);
						setLocation(loc);
					}}
				/>
				<GoogleMapComponent coords={coords} />
			</LoadScript>
		</>
	);
};

export default LocationIndex;
