import React from 'react';
import { useIntl } from 'react-intl';
import { H5, Caption } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import LocationInput from '@/components/views/create/locationInput/LocationInput';
import { InputContainer, Label } from '../Create.sc';
import { ECreateProjectSections, EInputs } from '../types';

interface ILocationIndexProps {
	setActiveProjectSection: (section: ECreateProjectSections) => void;
}

const LocationIndex = ({ setActiveProjectSection }: ILocationIndexProps) => {
	const { getValues, setValue } = useFormContext();
	const { formatMessage } = useIntl();

	const defaultLocation = getValues(EInputs.impactLocation);

	const handleLocation = (value: string) => {
		setValue(EInputs.impactLocation, value);
	};

	return (
		<div
			onMouseEnter={() =>
				setActiveProjectSection(ECreateProjectSections.location)
			}
		>
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
