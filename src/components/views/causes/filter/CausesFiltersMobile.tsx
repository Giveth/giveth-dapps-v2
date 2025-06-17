import { Flex } from '@giveth/ui-design-system';
import CausesSubCategories from '@/components/views/causes/CausesSubCategories';
import CausesFiltersSwiper from '@/components/views/causes/filter/CausesFiltersSwiper';
import { StyledLine } from '@/components/views/projects/common.styled';
import CausesFiltersButton from '@/components/views/causes/filter/CausesFiltersButton';
import { useCausesContext } from '@/context/causes.context';
import CausesSearchTablet from '@/components/views/causes/CausesSearchTablet';

const CausesFiltersMobile = () => {
	const { isQF } = useCausesContext();

	return (
		<>
			<CausesFiltersSwiper />
			{!isQF && <StyledLine />}
			{!isQF && <CausesSubCategories />}
			<Flex $alignItems='center' gap='16px'>
				<CausesSearchTablet />
				<CausesFiltersButton />
			</Flex>
		</>
	);
};

export default CausesFiltersMobile;
