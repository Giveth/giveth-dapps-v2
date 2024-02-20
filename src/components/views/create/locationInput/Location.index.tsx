import React from 'react';
import { useIntl } from 'react-intl';
import { H5, Caption } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import LocationInput from '@/components/views/create/locationInput/LocationInput';
import { InputContainer, Label } from '../Create.sc';
import config from '@/configuration';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ECreateProjectSections, EInputs } from '../types';

const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`;

interface ILocationIndexProps {
	setActiveProjectSection: (section: ECreateProjectSections) => void;
}

const LocationIndex = ({ setActiveProjectSection }: ILocationIndexProps) => {
	const { getValues, setValue } = useFormContext();
	const { formatMessage } = useIntl();

	const onVisible = () =>
		setActiveProjectSection(ECreateProjectSections.location);
	const delay = 500; // Delay in milliseconds
	const ref = useIntersectionObserver(onVisible, { threshold: 0.8, delay });

	const defaultLocation = getValues(EInputs.impactLocation);

	const handleLocation = (value: string) => {
		setValue(EInputs.impactLocation, value);
	};

	return (
		<div ref={ref}>
			<H5>
				{formatMessage({
					id: 'label.where_will_your_project_have_the_most_impact',
				})}
			</H5>
			<CaptionContainer>
				{formatMessage({
					id: 'label.make_it_easier_for_donors_to_find_your_project',
				})}
			</CaptionContainer>
			<InputContainer>
				<Label>{formatMessage({ id: 'label.location' })}</Label>
				<LocationInput
					defaultLocation={defaultLocation}
					setLocation={handleLocation}
					googleMapURL={googleMapURL}
					loadingElement={<MapContainer />}
				/>
			</InputContainer>
		</div>
	);
};

const MapContainer = styled.div`
	width: 100%;
	height: 100%;
`;

const CaptionContainer = styled(Caption)`
	margin-top: 8.5px;
`;

export default LocationIndex;
