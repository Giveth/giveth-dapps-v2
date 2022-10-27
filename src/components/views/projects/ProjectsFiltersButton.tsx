import { MouseEvent, useRef, useState } from 'react';
import { IconOptions16 } from '@giveth/ui-design-system';
import { FilterMenu, PinkyColoredNumber } from '@/components/menu/FilterMenu';
import { useProjectsContext } from '@/context/projects.context';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { FiltersButton } from '@/components/views/projects/common.styled';
import { useIntl } from 'react-intl';
import useDelay from '@/hooks/useDelay';

const ProjectsFiltersButton = () => {
	const { formatMessage } = useIntl();
	const { variables } = useProjectsContext();
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filtersCount = variables?.filters?.length ?? 0;

	const delayedIsFilterOpen = useDelay(isFilterOpen, 280);

	const filterMenuRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(filterMenuRef, () => setIsFilterOpen(false));

	const handleFilterClose = (e: MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		setIsFilterOpen(false);
	};

	return (
		<>
			<FiltersButton onClick={() => setIsFilterOpen(true)}>
				{formatMessage({ id: 'label.filters' })}
				{filtersCount !== 0 && (
					<PinkyColoredNumber>{filtersCount}</PinkyColoredNumber>
				)}
				<IconOptions16 />
			</FiltersButton>
			{(delayedIsFilterOpen || isFilterOpen) && (
				<FilterMenu
					isOpen={isFilterOpen}
					handleClose={handleFilterClose}
					ref={filterMenuRef}
				/>
			)}
		</>
	);
};

export default ProjectsFiltersButton;
