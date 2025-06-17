import { IconSearch, IconX } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CausesSearchDesktop from '@/components/views/causes/CausesSearchDesktop';
import CausesFiltersSwiper from '@/components/views/causes/filter/CausesFiltersSwiper';
import CausesSubCategories from '@/components/views/causes/CausesSubCategories';
import {
	FiltersSection,
	IconContainer,
	StyledLine,
} from '@/components/views/projects/common.styled';
import CausesFiltersButton from '@/components/views/causes/filter/CausesFiltersButton';
import { useCausesContext } from '@/context/causes.context';

const CausesFiltersDesktop = () => {
	const { selectedMainCategory, isQF } = useCausesContext();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (router.query.searchTerm) setIsSearchOpen(true);
	}, [router.query.searchTerm]);

	const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

	return (
		<>
			<FiltersSection>
				{isSearchOpen ? (
					<CausesSearchDesktop />
				) : (
					<CausesFiltersSwiper />
				)}
				<FilterAndSearchContainer>
					<BiggerIconContainer onClick={toggleSearch}>
						{isSearchOpen ? <IconX /> : <IconSearch />}
					</BiggerIconContainer>
					<CausesFiltersButton />
				</FilterAndSearchContainer>
			</FiltersSection>
			{!isQF && selectedMainCategory && <StyledLine />}
			{!isQF && <CausesSubCategories />}
		</>
	);
};

const FilterAndSearchContainer = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	gap: 16px;
`;

const BiggerIconContainer = styled(IconContainer)`
	width: 50px;
	height: 50px;
`;

export default CausesFiltersDesktop;
