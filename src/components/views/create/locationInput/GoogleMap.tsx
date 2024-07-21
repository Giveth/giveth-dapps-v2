import React, { FC } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { ICoords } from '@/components/views/create/locationInput/LocationInput';

const GoogleMapComponent: FC<{ coords: ICoords }> = ({ coords }) => {
	return (
		<GoogleMap
			mapContainerStyle={mapContainerStyle}
			center={coords}
			zoom={13}
			options={{ draggable: false, disableDefaultUI: true }}
		></GoogleMap>
	);
};

const mapContainerStyle = {
	height: '388px',
	width: '100%',
	borderRadius: '8px',
	marginTop: '32px',
};

export default React.memo(GoogleMapComponent);
