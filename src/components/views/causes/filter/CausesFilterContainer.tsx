import React from 'react';
import { mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import useDetectDevice from '@/hooks/useDetectDevice';
import CausesFiltersDesktop from '@/components/views/causes/filter/CausesFiltersDesktop';
import CausesFiltersMobile from '@/components/views/causes/filter/CausesFiltersMobile';
import CausesFiltersTablet from '@/components/views/causes/filter/CausesFiltersTablet';

export const CausesFilterContainer = () => {
	const { isTablet, isMobile } = useDetectDevice();
	return (
		<FiltersContainer>
			{!isTablet && !isMobile && <CausesFiltersDesktop />}
			{isTablet && <CausesFiltersTablet />}
			{isMobile && <CausesFiltersMobile />}
		</FiltersContainer>
	);
};

const FiltersContainer = styled.div`
	display: flex;
	flex-direction: column;
	background: white;
	position: relative;
	padding: 32px 21px;
	border-radius: 0;
	gap: 16px;
	${mediaQueries.tablet} {
		margin-top: 32px;
		border-radius: 16px;
	}
`;
