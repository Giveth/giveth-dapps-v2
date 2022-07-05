import { GoogleMap, withGoogleMap } from 'react-google-maps';
import React, { FC } from 'react';
import { ICoords } from '@/components/views/create/locationInput/LocationInput';

const GoogleMapComponent: FC<{ coords: ICoords }> = ({ coords }) => {
	const MapComponent = withGoogleMap(() => (
		<GoogleMap
			defaultCenter={coords}
			defaultZoom={13}
			options={{ draggable: false, disableDefaultUI: true }}
		/>
	));

	return (
		<MapComponent
			containerElement={<div style={{ height: `388px` }} />}
			mapElement={
				<div
					style={{
						height: `100%`,
						borderRadius: '8px',
						marginTop: '32px',
					}}
				/>
			}
		/>
	);
};

export default React.memo(GoogleMapComponent);
