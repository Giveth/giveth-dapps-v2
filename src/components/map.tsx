import React, { Component } from 'react';
import {
	withGoogleMap,
	GoogleMap,
	Marker,
	InfoWindow,
} from 'react-google-maps';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete';

import { captureException } from '@sentry/nextjs';
import { Regular_Input } from '@/components/styled-components/Input';
import CheckBox from '@/components/Checkbox';
import { globalLocation } from '@/lib/constants/projects';

type MyProps = {
	index?: any;
	handleCloseCall?: any;
	extraComponent?: any;
	defaultLocation?: string;
	setLocation?: any;
};
type MyState = {
	isOpen: boolean;
	coords: any;
	address: string;
};

class Map extends Component<MyProps, MyState> {
	constructor(props: any) {
		super(props);
		this.state = {
			isOpen: false,
			coords: { lat: 41.3879, lng: 2.15899 },
			address: '',
		};
	}

	componentDidMount() {
		const { defaultLocation } = this.props;
		if (defaultLocation) {
			if (defaultLocation === globalLocation) {
				this.setState({ address: globalLocation });
			} else this.handleSelect(defaultLocation);
		}
	}

	handleSelect = (address: any) => {
		geocodeByAddress(address)
			.then((results: any) => {
				return getLatLng(results[0]);
			})
			.then((latLng: any) => {
				this.props.setLocation(address);
				this.setState({
					address,
					coords: latLng,
				});
			})
			.catch((error: any) => {
				console.error('Error: ', error);
				captureException(error, {
					tags: {
						section: 'Map',
					},
				});
			});
	};

	render() {
		const { coords, address, isOpen } = this.state;
		const { index, setLocation, handleCloseCall } = this.props;
		const isGlobal = address === globalLocation;

		const GoogleMapComponent = withGoogleMap(() => (
			<GoogleMap
				defaultCenter={coords}
				defaultZoom={13}
				options={{ draggable: false, disableDefaultUI: true }}
			>
				<Marker
					key={index}
					position={coords}
					onClick={() => this.setState({ isOpen: true })}
				>
					{isOpen && (
						<InfoWindow
							onCloseClick={handleCloseCall}
							options={{ maxWidth: 100 }}
						>
							<span>{address}</span>
						</InfoWindow>
					)}
				</Marker>
			</GoogleMap>
		));

		return (
			<div>
				<PlacesAutocomplete
					value={address}
					onChange={address => this.setState({ address })}
					onSelect={this.handleSelect}
				>
					{({
						getInputProps,
						suggestions,
						getSuggestionItemProps,
						loading,
					}) => (
						<div>
							<Regular_Input
								{...getInputProps({
									placeholder: isGlobal
										? 'Global Impact'
										: 'Search Places...',
									className: 'location-search-input',
								})}
								disabled={isGlobal}
							/>
							<CheckBox
								title='This project has a global impact'
								checked={isGlobal}
								onChange={() => {
									const loc = isGlobal ? '' : globalLocation;
									setLocation(loc);
									this.setState({ address: loc });
								}}
								style={{ marginTop: '20px' }}
							/>
							<div
								className='autocomplete-dropdown-container'
								style={{
									position: 'absolute',
									marginTop: '-40px',
									zIndex: 2,
								}}
							>
								{loading && <div>Loading...</div>}
								{suggestions.map((suggestion: any) => {
									const className = suggestion.active
										? 'suggestion-item--active'
										: 'suggestion-item';
									// inline style for demonstration purpose
									const style = suggestion.active
										? {
												backgroundColor: '#fafafa',
												cursor: 'pointer',
												padding: '4px 0',
										  }
										: {
												backgroundColor: '#ffffff',
												cursor: 'pointer',
												padding: '4px 0',
										  };
									return (
										<div
											{...getSuggestionItemProps(
												suggestion,
												{
													className,
													style,
												},
											)}
											key={suggestion.placeId}
										>
											<span>
												{suggestion.description}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</PlacesAutocomplete>
				<GoogleMapComponent
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
			</div>
		);
	}
}

export default Map;
