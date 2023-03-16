import React, { Component } from 'react';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { captureException } from '@sentry/nextjs';

import { withScriptjs } from 'react-google-maps';
import CheckBox from '@/components/Checkbox';
import { globalLocation } from '@/lib/constants/projects';
import GoogleMapComponent from '@/components/views/create/locationInput/GoogleMap';
import SearchPlaces from '@/components/views/create/locationInput/SearchPlaces';

export interface ICoords {
	lat: number;
	lng: number;
}
type MyProps = {
	defaultLocation?: string;
	setLocation: (a: string) => void;
};
type MyState = {
	coords: ICoords;
	address: string;
};

class LocationInput extends Component<MyProps, MyState> {
	constructor(props: MyProps | Readonly<MyProps>) {
		super(props);
		this.state = {
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

	handleSelect = (address: string) => {
		geocodeByAddress(address)
			.then(results => {
				return getLatLng(results[0]);
			})
			.then((latLng: ICoords) => {
				this.props.setLocation(address);
				this.setState({
					address,
					coords: latLng,
				});
			})
			.catch(error => {
				console.error('GeocodeByAddress Error: ', error);
				captureException(error, {
					tags: {
						section: 'geocodeByAddress',
					},
				});
			});
	};

	render() {
		const { coords, address } = this.state;
		const { setLocation } = this.props;

		const isGlobal = address === globalLocation;

		return (
			<>
				<SearchPlaces
					setLocation={address => this.setState({ address })}
					address={address}
					onSelect={this.handleSelect}
				/>
				<CheckBox
					//  TODO: FORMAT THIS TO BE A FUNCTIONAL COMPONENT AND ADD USE INTL FOR TRANSLATIONS
					label='This project has a global impact'
					checked={isGlobal}
					onChange={() => {
						const loc = isGlobal ? '' : globalLocation;
						this.setState({ address: loc });
						setLocation(loc);
					}}
				/>
				<GoogleMapComponent coords={coords} />
			</>
		);
	}
}

export default withScriptjs(LocationInput);
