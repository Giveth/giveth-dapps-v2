import React from 'react';
import { mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ProjectsFiltersDesktop from '@/components/views/projects/filterContainer/ProjectsFiltersDesktop';
import ProjectsFiltersTablet from '@/components/views/projects/filterContainer/ProjectsFiltersTablet';
import ProjectsFiltersMobile from '@/components/views/projects/filterContainer/ProjectsFiltersMobile';
import useDetectDevice from '@/hooks/useDetectDevice';

export const FilterContainer = () => {
	const { isTablet, isMobile } = useDetectDevice();
	return (
		<FiltersContainer>
			{!isTablet && !isMobile && <ProjectsFiltersDesktop />}
			{isTablet && <ProjectsFiltersTablet />}
			{isMobile && <ProjectsFiltersMobile />}
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
	margin-bottom: 24px;
	gap: 16px;
	${mediaQueries.tablet} {
		margin-top: 32px;
		border-radius: 16px;
	}
`;
