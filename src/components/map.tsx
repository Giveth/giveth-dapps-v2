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

import { Regular_Input } from '@/components/styled-components/Input';
import CheckBox from '@/components/Checkbox';

type MyProps = {
	index?: any;
	handleCloseCall?: any;
	extraComponent?: any;
	setLocation?: any;
	location?: string;
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
			.catch((error: any) => console.error('Error: ', error));
	};

	render() {
		console.log(this.state);
		const GoogleMapComponent = withGoogleMap(() => (
			<GoogleMap
				defaultCenter={this.state.coords}
				defaultZoom={13}
				options={{ draggable: false, disableDefaultUI: true }}
			>
				<Marker
					key={this.props.index}
					position={this.state.coords}
					onClick={() =>
						this.setState({
							isOpen: true,
						})
					}
				>
					{this.state.isOpen && (
						<InfoWindow
							onCloseClick={this.props.handleCloseCall}
							options={{ maxWidth: 100 }}
						>
							<span>{this.props.location}</span>
						</InfoWindow>
					)}
				</Marker>
			</GoogleMap>
		));

		return (
			<div>
				<PlacesAutocomplete
					value={this.props.location}
					onChange={address => this.props.setLocation(address)}
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
									placeholder:
										this.props.location === 'Global'
											? 'Global Impact'
											: 'Search Places...',
									className: 'location-search-input',
								})}
								disabled={this.props.location === 'Global'}
							/>
							<CheckBox
								title='This project has a global impact'
								checked={this.props.location === 'Global'}
								onChange={() => {
									this.props.setLocation(
										this.props.location === 'Global'
											? ''
											: 'Global',
									);
								}}
								style={{ marginTop: '20px' }}
							/>
							<div
								className='autocomplete-dropdown-container'
								style={{
									position: 'absolute',
									marginTop: '-40px',
									zIndex: 2,
									width: '677px',
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
					containerElement={
						<div
							style={{
								height: `388px`,
								width: '696.03px',
							}}
						/>
					}
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
