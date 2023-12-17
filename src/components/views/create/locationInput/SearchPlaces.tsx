import PlacesAutocomplete from 'react-places-autocomplete';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { globalLocation } from '@/lib/constants/projects';
import { Shadow } from '@/components/styled-components/Shadow';
import Input from '@/components/styled-components/Input';

interface IMyProps {
	setLocation: (a: string) => void;
	address: string;
	onSelect: (a: string) => void;
}

const SearchPlaces: FC<IMyProps> = ({ setLocation, address, onSelect }) => {
	const isGlobal = address === globalLocation;
	const { formatMessage } = useIntl();

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
								? formatMessage({ id: 'label.global_impact' })
								: formatMessage({
										id: 'label.search_places...',
								  }),
						})}
						disabled={isGlobal}
					/>
					{(suggestions.length > 0 || loading) && (
						<DropdownContainer>
							{loading && <div>Loading...</div>}
							{!loading &&
								suggestions.map(suggestion => (
									<ListContainer
										{...getSuggestionItemProps(suggestion)}
										key={suggestion.placeId}
									>
										<span>{suggestion.description}</span>
									</ListContainer>
								))}
						</DropdownContainer>
					)}
				</>
			)}
		</PlacesAutocomplete>
	);
};

const InputStyled = styled(Input)`
	margin-bottom: 20px;
`;

const ListContainer = styled.div`
	padding: 10px 20px;
	border-radius: 8px;
	cursor: pointer;
	:hover {
		background: #f5f5f5;
	}
`;

const DropdownContainer = styled.div`
	background: white;
	position: absolute;
	margin-top: -20px;
	z-index: 2;
	box-shadow: ${Shadow.Giv[400]};
	border-radius: 8px;
	padding: 15px;
`;

export default SearchPlaces;
