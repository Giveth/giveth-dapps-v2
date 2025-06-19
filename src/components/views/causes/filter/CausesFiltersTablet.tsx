import { IconDots, IconX, Flex } from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import CausesSearchTablet from '@/components/views/causes/CausesSearchTablet';
import CausesFiltersSwiper from '@/components/views/causes/filter/CausesFiltersSwiper';
import {
	FiltersSection,
	IconContainer,
	StyledLine,
} from '@/components/views/projects/common.styled';
import CausesSubCategories from '@/components/views/causes/CausesSubCategories';
import CausesFiltersButton from '@/components/views/causes/filter/CausesFiltersButton';
import { useCausesContext } from '@/context/causes.context';

const CausesFiltersTablet = () => {
	const { selectedMainCategory, isQF } = useCausesContext();
	const [showSearchAndFilter, setShowSearchAndFilter] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (router.query.searchTerm) setShowSearchAndFilter(true);
	}, [router.query.searchTerm]);

	return (
		<>
			{showSearchAndFilter ? (
				<FilterAndSearchContainer
					$justifyContent='space-between'
					$alignItems='center'
					gap='16px'
					className='fadeIn'
				>
					<CausesSearchTablet />
					<CausesFiltersButton />
					<IconContainer
						onClick={() => setShowSearchAndFilter(false)}
					>
						<IconX />
					</IconContainer>
				</FilterAndSearchContainer>
			) : (
				<FiltersSection>
					<CausesFiltersSwiper />
					<IconContainer
						className='fadeIn'
						onClick={() => setShowSearchAndFilter(true)}
					>
						<IconDots />
					</IconContainer>
				</FiltersSection>
			)}
			{!isQF && selectedMainCategory && <StyledLine />}
			{!isQF && <CausesSubCategories />}
		</>
	);
};

const FilterAndSearchContainer = styled(Flex)`
	flex-grow: 1;
`;

export default CausesFiltersTablet;
