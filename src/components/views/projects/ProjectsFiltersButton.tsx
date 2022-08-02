import { MouseEvent, useRef, useState } from 'react';
import { IconOptions16 } from '@giveth/ui-design-system';
import { FilterMenu, PinkyColoredNumber } from '@/components/menu/FilterMenu';
import { useProjectsContext } from '@/context/projects.context';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { FiltersButton } from '@/components/views/projects/common.styled';

const ProjectsFiltersButton = () => {
	const { variables } = useProjectsContext();
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filtersCount = variables?.filters?.length ?? 0;

	const filterMenuRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(filterMenuRef, () => setIsFilterOpen(false));

	const handleFilterClose = (e: MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setIsFilterOpen(false);
	};

	return (
		<>
			<FiltersButton onClick={() => setIsFilterOpen(true)}>
				Filters
				{filtersCount !== 0 && (
					<PinkyColoredNumber>{filtersCount}</PinkyColoredNumber>
				)}
				<IconOptions16 />
			</FiltersButton>
			{isFilterOpen && (
				<FilterMenu
					handleClose={handleFilterClose}
					ref={filterMenuRef}
				/>
			)}
		</>
	);
};

export default ProjectsFiltersButton;
