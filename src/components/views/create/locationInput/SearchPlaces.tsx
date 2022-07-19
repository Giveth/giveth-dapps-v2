import PlacesAutocomplete from 'react-places-autocomplete';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Input } from '@/components/styled-components/Input';
import { globalLocation } from '@/lib/constants/projects';

interface IMyProps {
	setLocation: (a: string) => void;
	address: string;
	onSelect: (a: string) => void;
}

const SearchPlaces: FC<IMyProps> = ({ setLocation, address, onSelect }) => {
	const isGlobal = address === globalLocation;

	return (
		<PlacesAutocomplete
			value={address}
			onChange={address => setLocation(address)}
			onSelect={onSelect}
		>
			{({
				getInputProps,
				suggestions,
				getSuggestionItemProps,
				loading,
			}) => (
				<>
					<InputStyled
						{...getInputProps({
							placeholder: isGlobal
								? 'Global Impact'
								: 'Search Places...',
							className: 'location-search-input',
						})}
						disabled={isGlobal}
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
						{suggestions.map(suggestion => {
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
									{...getSuggestionItemProps(suggestion, {
										className,
										style,
									})}
									key={suggestion.placeId}
								>
									<span>{suggestion.description}</span>
								</div>
							);
						})}
					</div>
				</>
			)}
		</PlacesAutocomplete>
	);
};

const InputStyled = styled(Input)`
	margin-bottom: 20px;
`;

export default SearchPlaces;
